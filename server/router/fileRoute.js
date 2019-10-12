"use strict";
const express = require("express");
const router = express.Router();
const File = require("../schema/fileSchema");
const stream = require("stream");
var fs = require("fs");

const bodyParser = require("body-parser");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const mongoURI = "mongodb://localhost:27017/WriterParkDB";

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

// @route GET /
// @desc Loads form
router.get("/", (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render("index", { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png"
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render("index", { files: files });
    }
  });
});

// @route POST /upload
// @desc  Uploads file to DB
router.post("/upload", upload.single("file"), (req, res) => {
  console.log("upload file", req.file);
  res.json({ file: req.file });
  // res.redirect("/");
});

// @route GET /files
// @desc  Display all files in JSON
router.get("/files", (req, res) => {
  console.log("get files");
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist"
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display single file object
router.get("/files/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists"
      });
    }
    // File exists
    return res.json(file);
  });
});

// @route GET /image/:filename
// @desc Display Image
router.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists"
      });
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image"
      });
    }
  });
});

// @route DELETE /files/:id
// @desc  Delete file
router.delete("/files/:id", (req, res) => {
  gfs.remove({ _id: req.params.id, root: "uploads" }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.redirect("/");
  });
});

// router.get("/", (req, res) => {
//   res.json({ message: "hooray! welcome to our api!" });
// });

// router.post("/newfile", (req, res) => {
//   console.log("newfile - ", req.body);
//   var file = new File();
//   file.order_id = req.body.order_id;
//   file.fileData = req.body.fileData;
//   file.fileName = req.body.fileName;
//   file.fileType = req.body.fileType;
//   file.isProduction = req.body.isProduction;
//   file.timestamp = new Date();
//   file.save(err => {
//     if (err) {
//       res.status(501).json(err);
//     }
//     res.status(200).json({ message: "File Created" });
//   });
// });

// //list order files
// router.get("/files/:order_id", (req, res) => {
//   console.log("find file - params", req.params);
//   File.find({ order_id: req.params.order_id }, (err, file) => {
//     if (err) {
//       res.send(err);
//     }
//     res.json(file);
//   });
// });

// //download order file
// router.get("/downloadFile/:file_id", (req, res) => {
//   console.log("find file - params", req.params.file_id);
//   File.findById(req.params.file_id, (err, file) => {
//     if (err) {
//       res.send(err);
//     }
//     console.log("downloadFile", file);
//     // res.download(file.fileData);
//     // var fileContents = Buffer.from(file.fileData, "base64");
//     // var readStream = new stream.PassThrough();
//     // readStream.end(fileContents);
//     // response.set(
//     //   "Content-disposition",
//     //   "attachment; filename=" + file.fileName
//     // );
//     // response.set("Content-Type", "text/plain");

//     // readStream.pipe(res);
//     var fileContents = Buffer.from(file.fileData, "base64");
//     var savedFilePath = "C:/Users/Aolin/Desktop/folder1/" + file.fileName; // in some convenient temporary file folder
//     fs.writeFile(savedFilePath, fileContents, function() {
//       res.status(200).download(savedFilePath, file.fileName);
//     });
//   });
// });

// app.get('/download', function(req, res){
//   const file = `${__dirname}/upload-folder/dramaticpenguin.MOV`;
//   res.download(file); // Set disposition and send it.
// });

module.exports = router;

// router.post("/login", (req, res) => {
//   console.log("api - login - req.body.account - ", req.body.account);

//   const decryptAccount = CryptoJS.AES.decrypt(
//     req.body.account,
//     "Secret Passphrase"
//   ).toString(CryptoJS.enc.Utf8);

//   const decryptPassword = CryptoJS.AES.decrypt(
//     req.body.password,
//     "Secret Passphrase"
//   ).toString(CryptoJS.enc.Utf8);

//   User.find(
//     //email and password
//     { email: decryptAccount, password: decryptPassword },
//     (err, user) => {
//       if (err) {
//         res.status(404).json(err);
//       }
//       res.status(200).json(user);
//     }
//   );
//   // res.json({ message: req.body });
// });

// router.get("/files", (req, res) => {
//   console.log("get users - req -");
//   File.find((err, users) => {
//     if (err) {
//       res.status(500).send(err);
//     }
//     res.status(200).json(users);
//   });
// });

// router.put("/users/:user_id", (req, res) => {
//   console.log("update user - params - ", req.params);
//   console.log("update user - body - ", req.body);
//   User.findById(req.params.user_id, (err, user) => {
//     if (err) {
//       res.send(err);
//     }
//     user.account = req.body.account;
//     user.password = req.body.password;
//     user.email = req.body.email;
//     user.role = req.body.role;
//     user.save(err => {
//       if (err) {
//         res.send(err);
//       }
//       res.json({ message: "User updated!" });
//     });
//   });
// });

// router.delete("/users/:user_id", (req, res) => {
//   User.remove(
//     {
//       _id: req.params.user_id
//     },
//     (err, user) => {
//       if (err) {
//         res.send(err);
//       }
//       res.json({ message: "Successfully deleted" });
//     }
//   );
// });
