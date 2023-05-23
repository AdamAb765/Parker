const { Router } = require("express");
const { get } = require("axios");
const Park = require("../models/Park");

const app = Router();

app.get("/", async (req, res, next) => {
  const allParks = await Park.find();
  res.json(allParks);
});

app.get("/:id", async (req, res, next) => {
  if (req.params.id) {
    const park = await Park.findById(req.params.id);
    if (!park) {
      return res.json([]);
    }
    res.json(park);
  }
  res.status(404).send("Not found");
});

app.get("/parkByOwner/:ownerId", async (req, res, next) => {
  const query = { ownerId: req.params.ownerId };
  const park = await Park.findOne(query);
  if (!park) {
    return res.json([]);
  }
  res.json(park);
});

app.get("/isAvailable/:id", async (req, res, next) => {
  const park = await Park.findById(req.params.id);
  if (!park) {
    return res.json([]);
  }
  const cameraUrl = "http://" + park.cameraIpAddress + ":" +
    park.cameraPort + "/captureParking/" + park.cameraName;
  await get(cameraUrl)
    .then(ans => {
      console.log(ans.data.results);
      if (Array.isArray(ans.data.results) && ans.data.results.length) {
        res.status(200).send(false);
      } else {
        res.status(200).send(true);
      }

    })
    .catch(err => {
      console.log(err);
    })
});

app.post("/create", (req, res) => {
  const newPark = new Park(req.body.park);
  newPark
    .save()
    .then(() => {
      console.log("Successfully added park!");
      res.send("Added successfully");
    })
    .catch((err) => console.log(err));
});

app.put("/edit", async (req, res) => {
  const { park } = req.body;
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
    cameraIpAddress: req.body.cameraIpAddress
  }
  console.log(camera);
  const doc = await Park.findOneAndUpdate(query, camera, {
    returnOriginal: false,
    multi: true
  });

  res.json(doc);
});


module.exports = app;
