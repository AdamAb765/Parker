const { Router } = require("express");
const { get } = require("axios");
const Park = require("../models/Park");
const { isParkingSpotAvalibale } = require("../common/prakingSpotsBL");

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
var fs = require('fs');
var path = require('path');

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

app.post("/createMany", (req, res) => {
  const parks = req.body;
  Park.insertMany(parks)
    .then(() => {
      res.status(200).send("Added successfully");
    })
    .catch((err) => res.status(404).send("Failed to add parking"));
});

app.post("/create", multipartMiddleware, async (req, res) => {
  const newPark = new Park(req.body);

  const imageExt = req.files.image.name.split('.').pop();
  const newImageName = `${newPark._id}.${imageExt}`;
  newPark.image = newImageName;
  const newImagePath = `./parking_images/${newImageName}`;

  await fs.readFile(req.files.image.path, async function (err, data) {
      await fs.writeFile(newImagePath, data, function (err) {
          if (err) {
              console.log(err);
              res.status(503).send("Something went wrong!");
          }
      });
  });

  newPark
    .save()
    .then(() => {
      res.status(200).send("Added successfully");
    })
    .catch((err) => {
      fs.unlink(newImagePath, (e) => console.log("unlinking image"));
      res.status(404).send("Failed to add parking");
    });
});

app.get("/image/:imageName", async (req, res, next) => {
  const filePath = `${__dirname}/../parking_images/${req.params.imageName}`;
  const defaultFilePath = `${__dirname}/../parking_images/default.jpg`;
  if (fs.existsSync(filePath)) {
    res.sendFile(path.resolve(filePath));
  } else {
    res.sendFile(path.resolve(defaultFilePath));
  }
});

app.put("/edit", async (req, res) => {
  const park = new Park(req.body);
  const query = { _id: park._id };
  
  const doc = await Park.findOneAndUpdate(query, park, {
    returnOriginal: false,
  });

  res.json(doc);
});

app.put("/:id", async (req, res) => {
  const { licensePlate, pictureDateTime } = req.body;

  const park = await Park.findById(req.params.id);
  if (!park) {
    res.status(404).send("parking spot not found");
  }

  park.currentParkingCar = licensePlate;
  park.lastCameraRecord = pictureDateTime;
  park.isAvailable = licensePlate ? false : true;

  const updatedParking = await park.save();
  res.status(200).send(updatedParking);
});

app.put("/:_id/image", multipartMiddleware, async (req, res) => {
  console.log(req)
  const query = { _id: req.params._id };
  const park = await Park.findOne(query);
  if (!park) {
    res.status(404).send("Parking not found");
    return;
  }
  const imageExt = req.files.image.name.split('.').pop();
  const newImageName = `${park._id}.${imageExt}`;
  const newImagePath = `./parking_images/${newImageName}`;

  await fs.readFile(req.files.image.path, async function (err, data) {
      await fs.writeFile(newImagePath, data, function (err) {
          if (err) {
              console.log(err);
              res.status(503).send("Something went wrong!");
          }
      });
  });
  
  let oldImageName = park.image;
  park.image = newImageName;

  Park.updateOne(query, { $set: park })
  .then(() => {
    if (oldImageName !== newImageName) {
      fs.unlink(`./parking_images/${oldImageName}`, (e) => console.log("unlinking image"));
    }
    res.status(200).send("Added successfully");
  })
  .catch((err) => {
    if (oldImageName !== newImageName) {
      fs.unlink(newImagePath, (e) => console.log("unlinking image"));
    }
    res.status(404).send("Failed to add parking");
  });
});

app.put("/setCamera", async (req, res) => {
  const query = { _id: req.body.parkId };
  const camera = {
    cameraName: req.body.cameraName,
    cameraPort: req.body.cameraPort,
    cameraIpAddress: req.body.cameraIpAddress,
  };

  const doc = await Park.findOneAndUpdate(query, camera, {
    returnOriginal: false,
    multi: true,
  });

  res.json(doc);
});

module.exports = app;