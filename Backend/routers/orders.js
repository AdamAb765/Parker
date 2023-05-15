const { Router } = require("express");
const Order = require("../models/Order");

const app = Router();

app.get("/orders", async (req, res, next) => {
  const allOrders = await Order.find();
  res.json(allOrders);
});

app.get("/orderByConsumer/:consumerId", async (req, res, next) => {
  const { consumerId } = req.params;
  const query = { consumerId: consumerId };
  const order = await Order.find(query);
  res.json(order);
});

app.get("/orderByConsumer/:id", async (req, res, next) => {
  const { id } = req.params;
  const query = { id: id };
  const order = await Order.find(query);
  res.json(order);
});

app.post("/DocumentPark", (req, res) => {
  const { order } = req.body;
  const newOrder = new Order(order);
  newOrder["timeStart"] = time();
  newOrder
    .save()
    .then(() => {
      res.send("Documented successfully");
    })
    .catch((err) => console.log(err));
});

app.put("/editOrder", async (req, res) => {
  console.log("update: " + req.body);
  const { order } = req.body;
  const { id } = { order };

  const query = { id: id };
  const doc = await Order.findOneAndUpdate(query, order, {
    returnOriginal: false,
  });

  res.json(doc);
});

const time = () => {
  let dateObject = new Date();
  console.log("A date object is defined")
  
  let date = ("0" + dateObject.getDate()).slice(-2);
  let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  let year = dateObject.getFullYear();
  
  let hours = dateObject.getHours();
  let minutes = dateObject.getMinutes();
  let seconds = dateObject.getSeconds();
  
  console.log("\displaying date and time in yyyy-mm-dd format")
  
  console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
};

module.exports = app;
