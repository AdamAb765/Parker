const { Router } = require("express");
const Park = require('../models/Park')

const app = Router();

app.get("/parks", async (req, res, next) => {
  const allParks = await Park.find();
  res.json(allParks);

});

app.get("/user/:ownerId", async (req, res, next) => {
  const {id} = req.params;
  const user = await User.findById(id);
  res.json(user);
});

app.get("/vehicle/:ownerId", async (req, res, next) => {
  const {ownerId} = req.params;
  const query = {'ownerId': ownerId};
  const park = await Park.findOne(query);
  res.json(park);
});

app.post("/RegisterPark", (req, res) => {
  const {park} = req.body;
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
  const {park} = req.body;
  const {id} = {park};

  const query = {'id': id};
  const doc = await Park.findOneAndUpdate(query, park, {
    returnOriginal: false
  });

  res.json(doc);

});

module.exports = app;
