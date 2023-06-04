const { Router } = require("express");
const { get } = require("axios");
const Park = require("../models/Park");
const { isParkingSpotAvalibale } = require("../common/prakingSpotsBL");

const app = Router();

app.get("/", async (req, res, next) => {
  const allParks = await Park.find();
  res.json(allParks);
});

app.get("/:id", async (req, res, next) => {
  if (req.params.id) {
    const park = await Park.findById(req.params.id);
    if (!park) {
      res.json([]);
    } else {
      res.json(park);
    }
  }
});

app.get("/parkByOwner/:ownerId", async (req, res) => {
  const query = { ownerId: req.params.ownerId };
  const park = await Park.find(query);
  if (!park) {
    res.json([]);
  } else {
    res.json(park);
  }
});

app.get("/isAvailable/:id", async (req, res, next) => {
  const park = await Park.findById(req.params.id);
  if (!park) {
    return res.json([]);
  }

  if (await isParkingSpotAvalibale(park)) {
    res.status(200).send(true);
  } else {
    res.status(200).send(false);
  }
});

app.post("/create", (req, res) => {
  const newPark = new Park(req.body);
  newPark
    .save()
    .then(() => {
      res.status(200).send("Added successfully");
    })
    .catch((err) => res.status(404).send("Failed to add parking"));
});

app.post("/createMany", (req, res) => {
  const parks = req.body;
  Park.insertMany(parks)
    .then(() => {
      res.status(200).send("Added successfully");
    })
    .catch((err) => res.status(404).send("Failed to add parking"));
});

app.put("/edit", async (req, res) => {
  const park = new Park(req.body);
  const query = { _id: park._id };

  const doc = await Park.findOneAndUpdate(query, park, {
    returnOriginal: false,
  });

  res.json(doc);
});

app.put("/setCamera", async (req, res) => {
  const query = { _id: req.body.parkId };
  const camera = {
    cameraName: req.body.cameraName,
    cameraPort: req.body.cameraPort,
    cameraIpAddress: req.body.cameraIpAddress,
  };
  console.log(camera);
  const doc = await Park.findOneAndUpdate(query, camera, {
    returnOriginal: false,
    multi: true,
  });

  res.json(doc);
});

module.exports = app;
