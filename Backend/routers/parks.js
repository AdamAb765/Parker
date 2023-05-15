const { Router } = require("express");
const Park = require("../models/Park");

const app = Router();

app.get("/parks", async (req, res, next) => {
  const allParks = await Park.find();
  res.json(allParks);
});

app.get("/park/:id", async (req, res, next) => {
  const { id } = req.params;
  const park = await Park.findById(id);
  if (!park) {
    return res.status(404).send("Cant find a shit");
  }
  res.json(park);
});

app.get("/parkByOwner/:ownerId", async (req, res, next) => {
  const { ownerId } = req.params;
  const query = { ownerId: ownerId };
  const park = await Park.findOne(query);
  if (!park) {
    return res.status(404).send("Cant find a shit");
  }
  res.json(park);
});

app.post("/registerPark", (req, res) => {
  const { park } = req.body;
  const newPark = new Park(park);
  newPark
    .save()
    .then(() => {
      console.log("Successfully added park!");
      res.send("Added successfully");
    })
    .catch((err) => console.log(err));
});

app.put("/editPark", async (req, res) => {
  console.log("update: " + req.body);
  const { park } = req.body;
  const { _id } = park;

  const query = { _id: _id };
  const doc = await Park.findOneAndUpdate(query, park, {
    returnOriginal: false,
  });

  res.json(doc);
});

module.exports = app;
