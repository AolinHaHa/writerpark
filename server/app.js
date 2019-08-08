"use strict";

const express = require("express");
const app = express();
const port = 7017;
const userRoute = require("./router/userRoute");
const orderRoute = require("./router/orderRoute");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const originUrl = "http://localhost:3000/";

mongoose.connect("mongodb://localhost:27017/WriterParkDB");

//base
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());
app.use("/api", userRoute);
app.use("/api", orderRoute);
app.use(cors({ origin: originUrl, credentials: true }));

app.listen(port, () => {
  console.log("listening on ", port);
});

userRoute.get("/", (req, res) => {
  res.send("hello from root");
});
