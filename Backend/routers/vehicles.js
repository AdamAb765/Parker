const { Router } = require("express");
const Vehicle = require('../models/Vehicle')
const app = Router();

app.get("/", async (req, res, next) => {
  const allVehicles = await Vehicle.find();
  res.json(allVehicles);
});

app.get("/:serial", async (req, res, next) => {
  const {serial} = req.params;
  const query = {'serial': serial};
  const vehicle = await Vehicle.findOne(query);
  res.json(vehicle);
});

app.get("/vehicleByOwner/:ownerId", async (req, res, next) => {
  const {ownerId} = req.params;
  const query = {'ownerId': ownerId};
  const vehicle = await Vehicle.findOne(query);
  res.json(vehicle);
});

app.post("/create", (req, res) => {
  const {vehicle} = req.body;
  const newVehicle = new Vehicle(vehicle);
  newVehicle
      .save()
      .then(() => {
        res.send("Vehicle added successfully")
      })
      .catch(err => console.log(err));
});

app.put("/edit", async (req, res) => {
  console.log("update: " + req.body);
  const {vehicle} = req.body;
  const {serial} = {vehicle};

  const query = {'serial': serial};
  const doc = await Vehicle.findOneAndUpdate(query, vehicle, {
    returnOriginal: false
  });

  res.json(doc);

});


module.exports = app;
