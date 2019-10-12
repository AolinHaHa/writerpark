"use strict";
const express = require("express");
const router = express.Router();
const Order = require("../schema/orderSchema");

router.get("/", (req, res) => {
  res.json({ message: "order api!" });
});

router.get("/orders", (req, res) => {
  console.log("GET orders - options -", req.query.options);
  console.log("GET orders - query -", req.query.query);
  let query;
  if (req.query.query !== "{}") {
    if (req.query.query.match(/^[0-9a-fA-F]{24}$/)) {
      // Yes, it's a valid ObjectId, proceed with `findById` call.
      query = {
        $or: [
          { wpnumber: new RegExp(req.query.query) },
          { referencenumber: new RegExp(req.query.query) },
          { _id: req.query.query }
          // { referencenumber: new RegExp(req.query.query) }
        ]
      };
    } else {
      query = {
        $or: [
          { wpnumber: new RegExp(req.query.query) },
          { referencenumber: new RegExp(req.query.query) }
        ]
      };
    }
  } else {
    query = {};
  }
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
    order.log = req.body.log;
    order.message = req.body.message;
    order.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "order updated!" });
    });
  });
});

//modify log by order id
router.put("/orders/log/:order_id", (req, res) => {
  console.log("update order - body - ", req.body);
  Order.findById(req.body.order_id, (err, order) => {
    if (err) {
      res.send(err);
    }
    order.log = req.body.orderLog;
    order.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "order log updated!" });
    });
  });
});

//modify message by order id
router.put("/orders/msg/:order_id", (req, res) => {
  console.log("update order msg - body - ", req.body);
  // res.json({ received: req.body });
  Order.findById(req.body.order_id, (err, order) => {
    if (err) {
      res.send(err);
    }
    order.message = req.body.message;
    order.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "order msg updated!" });
    });
  });
});

//check files by order id
router.put("/orders/productionfile/:order_id", (req, res) => {
  console.log("update order productionfile - body - ", req.body);
  // res.json({ received: req.body });
  Order.findById(req.body.order_id, (err, order) => {
    if (err) {
      res.send(err);
    }
    order.productionfiles = req.body.productionfiles;
    order.save(err => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "order productionfiles updated!" });
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
