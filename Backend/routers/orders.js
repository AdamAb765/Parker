const { Router } = require("express");
const Order = require("../models/Order");

const app = Router();

app.get("/", async (req, res, next) => {
  const allOrders = await Order.find();
  res.json(allOrders);
});

app.get("/:id", async (req, res, next) => {
  const query = { _id: req.params._id };

  const order = await Order.find(query);
  res.json(order);
});

app.get("/orderByConsumer/:consumerId", async (req, res, next) => {
  const query = { consumerId: req.params.consumerId };
  const order = await Order.find(query);
  res.json(order);
});

app.post("/create", (req, res) => {
  const newOrder = new Order({ ...req.body.order, timeStart: time() });
  newOrder
    .save()
    .then(() => {
      res.send("Documented successfully");
    })
    .catch((err) => console.log(err));
});

app.put("/finishPark", async (req, res) => {
  // 1
  const { order: { _id } } = req.body;
  const query = { _id: _id };
  // 2
  // const { order: { _id: query } } = req.body;

  const timeEnd = { timeEnd: time() };
  const doc = await Order.findOneAndUpdate(query, timeEnd, {
    returnOriginal: false,
  });

  res.json(doc);
});


app.put("/edit", async (req, res) => {
  console.log("update: " + req.body);
  const { order: { _id } } = req.body;
  const query = { _id: _id };
  
  const doc = await Order.findOneAndUpdate(query, order, {
    returnOriginal: false,
  });

  res.json(doc);
});

const time = () => {
  let dateObject = new Date();
  let date = ("0" + dateObject.getDate()).slice(-2);
  let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  let year = dateObject.getFullYear();
  
  let hours = dateObject.getHours();
  let minutes = dateObject.getMinutes();
  let seconds = dateObject.getSeconds();
  
  const currTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  console.log(currTime);
  return(currTime);
};

module.exports = app;