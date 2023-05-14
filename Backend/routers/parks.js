const { Router } = require("express");
const Park = require('../models/Park')

const app = Router();

app.get("/parks", async (req, res, next) => {
  const allParks = await Park.find();
  console.log("====" + allParks);
  res.send(allParks);

});

app.post("/RegisterPark", (req, res) => {
  const {park} = req.body;
  const newPark = new Park(park);
  newPark
      .save()
      .then(() => {
        console.log("Successfully added park!");
        // res.redirect("/");
        res.send("Added successfully");
      })
      .catch((err) => console.log(err));

});

app.post("/DocumentPark", (req, res) => {
  console.log("Client params:" + req.body);
  res.send("POST request to document a park that has been finisehd");
});

module.exports = app;
