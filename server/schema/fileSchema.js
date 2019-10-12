"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    order_id: String,
    fileName: String,
    fileData: Buffer,
    fileType: String,
    isProduction: Boolean,
    timestamp: Date
  },
  { collection: "orderFile" }
);

module.exports = mongoose.model("orderFile", OrderSchema);
