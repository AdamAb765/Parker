const { Router } = require("express");
const Order = require("../models/Order");
const Park = require("../models/Park");
const {
  isParkingSpotAvalibale,
  getCurrLicensePlate,
} = require("../common/prakingSpotsBL");

const app = Router();

app.get("/", async (req, res, next) => {
  const allOrders = await Order.find();
  res.json(allOrders);
});

app.get("/:_id", async (req, res, next) => {
  const query = { _id: req.params._id };

  const order = await Order.find(query);
  res.json(order);
});

app.get("/byParkId/:_id", async (req, res, next) => {
  const query = { parkId: req.params._id };

  const order = await Order.find(query);
  res.json(order);
});

app.get("/byConsumerIsRenting/:consumerId", async (req, res) => {
  const query = {
    consumerId: req.params.consumerId,
    timeEnd: "",
  };

  let order;
  try {
    order = await Order.findOne(query);
  } catch {
    order = null;
  }

  if (order) {
    res.json(order);
  } else {
    res.json(false);
  }
});

app.get("/byParkAndConsumer/:parkId/:consumerId", async (req, res) => {
  const query = {
    parkId: req.params.parkId,
    consumerId: req.params.consumerId,
    timeEnd: "",
  };

  let order;
  try {
    order = await Order.findOne(query);
  } catch {
    order = null;
  }

  if (order) {
    res.json(order);
  } else {
    res.json(false);
  }
});

app.get("/orderByConsumer/:consumerId", async (req, res, next) => {
  const query = { consumerId: req.params.consumerId };
  const order = await Order.find(query);
  res.json(order);
});

app.post("/create", async (req, res) => {
  const initialOrder = { timeEnd: "" };
  const newOrder = new Order({ ...req.body, ...initialOrder });

  const park = await Park.findById(newOrder.parkId);
  if (!park) {
    return res.status(404).send("Parking spot not found");
  }

  if (!park.cameraIpAddress || !park.cameraName || !park.cameraPort) {
    return res.status(403).send("Parking camera not detected");
  }

  if (await isParkingSpotAvalibale(park)) {
    newOrder
      .save()
      .then(() => {
        res.status(200).send("Documented successfully");
      })
      .catch((err) => console.log(err));
  } else {
    res.status(403).send("The parking spot already taken");
  }
});

app.post("/createMany", async (req, res) => {
  // const newOrder = new Order({ ...req.body, ...initialOrder });
  const orders = req.body;
  Order.insertMany(orders)
    .then(() => {
      res.status(200).send("Documented successfully");
    })
    .catch((err) => console.log(err));
});

app.put("/finishPark", async (req, res) => {
  const { _id } = req.body;

  const order = await Order.findById(_id);
  const park = await Park.findById(order.parkId);

  if (park.currentParkingCar != order.vehicleSerial && !order.isFinished) {
    order.timeEnd = new Date().toISOString()
    order.save()

    res.json(order);
  } else {
    res.status(403).json([]);
  }
});

app.put("/edit", async (req, res) => {
  const { order } = req.body;
  const query = { _id: order._id };

  const doc = await Order.findOneAndUpdate(query, order, {
    returnOriginal: false,
  });

  res.json(doc);
});

setInterval(async () => {
  const query = { isFinished: false }
  const allOpenOrders = await Order.find(query);

  allOpenOrders.forEach(async (order) => {
    const accordingParking = await Park.findOne({_id: order.parkId})
    const timeNow = new Date()

    if(accordingParking.currentParkingCar != order.vehicleSerial &&
       order.timeEnd && new Date(order.timeEnd) < timeNow) {
        order.isFinished = true
        order.timeEnd = timeNow.toISOString()
        order.save()
       }
  })
}, 0.1 * 60 * 1000)

const time = () => {
  let dateObject = new Date();
  let date = ("0" + dateObject.getDate()).slice(-2);
  let month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  let year = dateObject.getFullYear();

  let hours = dateObject.getHours();
  let minutes = dateObject.getMinutes();
  let seconds = dateObject.getSeconds();

  const currTime =
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return currTime;
};

module.exports = app;
