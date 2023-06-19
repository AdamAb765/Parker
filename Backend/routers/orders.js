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
  const park = await Park.findById(req.params.parkId);
  const timeNow = new Date()
  const day = new Date().toDateString().substring(0, 3)
  let timeEnd

  for (const key of Object.keys(park.schema.obj)) {
    if (key.includes(day)) {
      timeEnd = new Date(park[key])
      break
    }
  }

  const query = {
    parkId: req.params.parkId,
    consumerId: req.params.consumerId,
    timeStart: {
      $lte: new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate(),
        timeEnd.getHours(), timeEnd.getMinutes(), timeEnd.getSeconds()).toISOString()
    },
    timeEnd: { $gte: timeNow.toISOString() },
    isFinished: false
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

app.get("/orderByConsumer/:consumerId", async (req, res) => {
  const query = { consumerId: req.params.consumerId };
  const order = await Order.find(query);
  res.json(order);
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
    order.timeEnd = new Date()
    order.isFinished = true
    order.save()

    res.status(200).json(order);
  } else {
    res.status(200).json(false);
  }
});

app.delete("/cancel", async (req, res) => {
  const { _id } = req.body;

  const order = await Order.deleteOne(_id);

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(200).json(false);
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


app.post("/create", async (req, res) => {
  const newOrder = new Order({ ...req.body });

  const park = await Park.findById(newOrder.parkId);

  let canOrderPark = true

  const query = {
    timeStart: { $lte: newOrder.timeEnd },
    timeEnd: { $gte: newOrder.timeStart },
    parkId: newOrder.parkId,
    isFinished: false
  }

  const order = await Order.findOne(query)

  if (order)
    canOrderPark = false

  if (canOrderPark) {
    newOrder.save().then(() => {
      res.status(200).send("SUCCESS")
    }).catch((err) => console.log(err));
  } else {
    res.status(200).send("OCCUPIED");
  }
})

const updateOrdersStatus = async () => {
  const query = { isFinished: false }
  const allOpenOrders = await Order.find(query);

  allOpenOrders.forEach(async (order) => {
    const accordingParking = await Park.findOne({ _id: order.parkId })
    const timeNow = new Date()
    const orderEndTime = new Date(order.timeEnd)
    const orderStartTime = new Date(order.startEnd)

    if (accordingParking.currentParkingCar != order.vehicleSerial &&
      orderEndTime < timeNow) {
      order.isFinished = true
      order.timeEnd = timeNow.toISOString()
      order.save()

      accordingParking.isAvailable = true
      accordingParking.save()
    } else if (orderEndTime > timeNow &&
      orderStartTime < timeNow) {
      accordingParking.isAvailable = false
      accordingParking.save()
    }
  })
}

setInterval(() => {
  updateOrdersStatus()
}, 0.5 * 60 * 1000)

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
