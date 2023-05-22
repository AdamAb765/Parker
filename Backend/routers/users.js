const { Router } = require("express");
const User = require("../models/User");
const app = Router();

app.get("/", async (req, res, next) => {
  const allUsers = await User.find();
  res.json(allUsers);
});

app.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const filter = { id: id };
  const user = await User.findOne(filter);
  res.json(user);
});

app.post("/create", (req, res) => {
  console.log(req.body);
  const { user } = req.body;
  const newUser = new User(req.body);
  newUser
    .save()
    .then(() => {
      res.send("User added successfully");
    })
    .catch((err) => console.log(err));
});

app.put("/edit", async (req, res) => {
  console.log("update: " + req.body);
  const { user } = req.body;
  const query = { id: user.id };

  const doc = await User.findOneAndUpdate(query, user, {
    returnOriginal: false,
  });

  res.json(doc);
});

module.exports = app;
