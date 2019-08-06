"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    wpnumber: String, // order_id
    referencenumber: String, // inner id
    status: Number, // 0 | 1 | 2 | 3 | 4 | 5 | ==> unpaid | assign writer | in progress | in progress(RE) | finished | confirmed |
    deadline: Number,
    subject: String,
    topic: String,
    instruction: String,
    page: Number,
    ppt: Number,
    rate: Number,
    supportingfile: String,
    productionfile: String,
    clientid: String,
    email: String,
    amountcharged: Number,
    appliedcoupon: String,
    assignedspecialty: String
  },
  { collection: "order" }
);

module.exports = mongoose.model("order", OrderSchema);
