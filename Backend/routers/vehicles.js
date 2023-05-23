const { Router } = require("express");
const Vehicle = require("../models/Vehicle");
const app = Router();

app.get("/", async (req, res, next) => {
  const allVehicles = await Vehicle.find();
  res.json(allVehicles);
});

app.get("/:serial", async (req, res, next) => {
  const query = { serial: req.params.serial };
  const vehicle = await Vehicle.findOne(query);
  res.json(vehicle);
});

app.get("/vehicleByOwner/:ownerId", async (req, res) => {
    const query = { ownerId: req.params.ownerId };
    const vehicle = await Vehicle.find(query);
    res.json(vehicle);
  // return res.status(404).send("Vehicles not found");
});

app.post("/create", (req, res) => {
  const newVehicle = new Vehicle(req.body.vehicle);
  newVehicle
    .save()
    .then(() => {
      res.send("Vehicle added successfully");
    })
    .catch((err) => console.log(err));
});

app.put("/edit", async (req, res) => {
  const { vehicle } = req.body;

  const query = { serial: vehicle.serial };
  const doc = await Vehicle.findOneAndUpdate(query, vehicle, {
    returnOriginal: false,
  });

  res.json(doc);
});

module.exports = app;
