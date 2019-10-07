"use strict";
const express = require("express");
const router = express.Router();
const User = require("../schema/userSchema");
const CryptoJS = require("crypto-js");

router.get("/", (req, res) => {
  res.json({ message: "hooray! welcome to our api!" });
});

router.post("/login", (req, res) => {
  console.log("api - login - req.body.account - ", req.body.account);

  const decryptAccount = CryptoJS.AES.decrypt(
    req.body.account,
    "Secret Passphrase"
  ).toString(CryptoJS.enc.Utf8);

  const decryptPassword = CryptoJS.AES.decrypt(
    req.body.password,
    "Secret Passphrase"
  ).toString(CryptoJS.enc.Utf8);

  User.find(
    //email and password
    { email: decryptAccount, password: decryptPassword },
    (err, user) => {
      if (err) {
        res.status(404).json(err);
      }
      res.status(200).json(user);
    }
  );
  // res.json({ message: req.body });
});

router.get("/users", (req, res) => {
  console.log("get users - req -");
  User.find((err, users) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(users);
  });
});

router.post("/newuser", (req, res) => {
  //   console.log("newuser - ", req.body);
  var user = new User();
  user.account = req.body.account;
  user.password = req.body.password;
  user.email = req.body.email;
  user.role = req.body.role;
  user.save(err => {
    if (err) {
      res.status.apply(501).send(err);
    }
    res.status(200).json({ message: "User Created" });
  });
});

router.get("/users/:user_id", (req, res) => {
  console.log("finduser - ", req.params);
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      res.send(err);
    }
    res.json(user);
  });
});

router.put("/users/:user_id", (req, res) => {
  console.log("update user - params - ", req.params);
  console.log("update user - body - ", req.body);
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      res.send(err);
    }
    user.account = req.body.account;
    user.password = req.body.password;
    user.email = req.body.email;
    user.role = req.body.role;
    user.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "User updated!" });
    });
  });
});

router.delete("/users/:user_id", (req, res) => {
  User.remove(
    {
      _id: req.params.user_id
    },
    (err, user) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Successfully deleted" });
    }
  );
});

module.exports = router;
