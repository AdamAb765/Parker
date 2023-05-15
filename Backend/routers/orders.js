const { Router } = require("express");
const Order = require("../models/Order");

const app = Router();

app.get("/orders", async (req, res, next) => {
  const allOrders = await Order.find();
  res.json(allOrders);

});

app.get("/orderByConsumer/:consumerId", async (req, res, next) => {
  const {consumerId} = req.params;
  const query = {'consumerId': consumerId};
  const order = await Order.find(query);
  res.json(order);
});

app.get("/orderByConsumer/:id", async (req, res, next) => {
  const {id} = req.params;
  const query = {'id': id};
  const order = await Order.find(query);
  res.json(order);
});

app.post("/DocumentPark", (req, res) => {
  const {order} = req.body;
  const newOrder = new Order(order);
  newOrder
      .save()
      .then(() => {
        res.send("Documented successfully");
      })
      .catch((err) => console.log(err));

});

app.put("/editOrder", async (req, res) => {
  console.log("update: " + req.body);
  const {order} = req.body;
  const {id} = {order};

  const query = {'id': id};
  const doc = await Order.findOneAndUpdate(query, order, {
    returnOriginal: false
  });

  res.json(doc);

});

module.exports = app;
