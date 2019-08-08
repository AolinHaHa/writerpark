"use strict";
const express = require("express");
const router = express.Router();
const Order = require("../schema/orderSchema");

var query = {};

router.get("/", (req, res) => {
  res.json({ message: "order api!" });
});

router.get("/orders", (req, res) => {
  console.log(req.query);
  let options = JSON.parse(req.query.options);
  Order.paginate(query, options)
    .then(orders => {
      console.log("GET orders - res - ", res.data);
      res.status(200).json(orders);
    })
    .catch(err => {
      console.log("GET orders - err - ", err);
      res.status(500).send(err);
    });
});

router.post("/neworder", (req, res) => {
  //   console.log("neworder - ", req.body);
  var order = new Order();
  order.wpnumber = req.body.wpnumber;
  order.referencenumber = req.body.referencenumber;
  order.status = req.body.status;
  order.deadline = req.body.deadline;
  order.subject = req.body.subject;
  order.topic = req.body.topic;
  order.instruction = req.body.instruction;
  order.page = req.body.page;
  order.ppt = req.body.ppt;
  order.rate = req.body.rate;
  order.supportingfile = req.body.supportingfile;
  order.productionfile = req.body.productionfile;
  order.clientid = req.body.clientid;
  order.email = req.body.email;
  order.amountcharged = req.body.amountcharged;
  order.appliedcoupon = req.body.appliedcoupon;
  order.assignedspecialty = req.body.assignedspecialty;
  order.initialtime = Date();
  order.save(err => {
    if (err) {
      res.status.apply(501).send(err);
    }
    res.status(200).json({ message: "Order Created" });
  });
});

router.get("/orders/:order_id", (req, res) => {
  console.log("findorder - ", req.params);
  Order.findById(req.params.order_id, (err, order) => {
    if (err) {
      res.send(err);
    }
    res.json(order);
  });
});

router.put("/orders/:order_id", (req, res) => {
  console.log("update order - params - ", req.params);
  console.log("update order - body - ", req.body);
  Order.findById(req.params.order_id, (err, order) => {
    if (err) {
      res.send(err);
    }
    order.wpnumber = req.body.wpnumber;
    order.referencenumber = req.body.referencenumber;
    order.status = req.body.status;
    order.deadline = req.body.deadline;
    order.subject = req.body.subject;
    order.topic = req.body.topic;
    order.instruction = req.body.instruction;
    order.page = req.body.page;
    order.ppt = req.body.ppt;
    order.rate = req.body.rate;
    order.supportingfile = req.body.supportingfile;
    order.productionfile = req.body.productionfile;
    order.clientid = req.body.clientid;
    order.email = req.body.email;
    order.amountcharged = req.body.amountcharged;
    order.appliedcoupon = req.body.appliedcoupon;
    order.assignedspecialty = req.body.assignedspecialty;
    order.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "order updated!" });
    });
  });
});

router.delete("/orders/:order_id", (req, res) => {
  Order.remove(
    {
      _id: req.params.order_id
    },
    (err, order) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Successfully deleted" });
    }
  );
});

module.exports = router;
