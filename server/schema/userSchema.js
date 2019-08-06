"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: String,
    password: String,
    role: Number, // 0|1|2|3 => admin | manager | writer | user
    email: String
  },
  { collection: "user" }
);

module.exports = mongoose.model("user", UserSchema);
