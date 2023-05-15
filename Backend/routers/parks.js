const { Router } = require("express");
const Park = require("../models/Park");

const app = Router();

app.get("/", async (req, res, next) => {
  const allParks = await Park.find();
  res.json(allParks);
});

app.get("/:id", async (req, res, next) => {
  const park = await Park.findById(req.params.id);
  if (!park) {
    return res.status(404).send("Cant find a shit");
  }
  res.json(park);
});

app.get("/parkByOwner/:ownerId", async (req, res, next) => {
  const query = { ownerId: req.params.ownerId };
  const park = await Park.findOne(query);
  if (!park) {
    return res.status(404).send("Cant find a shit");
  }
  res.json(park);
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
  const { park : {_id}} = req.body;

  const query = { _id: _id };
  const doc = await Park.findOneAndUpdate(query, park, {
    returnOriginal: false,
  });

  res.json(doc);
});

module.exports = app;
