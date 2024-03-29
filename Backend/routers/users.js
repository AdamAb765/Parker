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

app.get("/byEmail/:email", async (req, res) => {
  const email = req.params.email;
  const filter = { email: email };
  const user = await User.findOne(filter);
  res.json(user);
});

app.post("/create", (req, res) => {
  const newUser = new User(req.body);
  newUser
    .save()
    .then(() => {
      res.send("User added successfully");
    })
    .catch((err) => console.log(err));
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const query = { email: email, password: password };
  const user = await User.findOne(query);
  if (!user) {
    res.status(409).send("No such a user");
  } else {
    res.status(200).send(user);
  }
});

app.put("/edit", async (req, res) => {
  const { user } = req.body;
  const query = { id: user.id };

  const doc = await User.findOneAndUpdate(query, user, {
    returnOriginal: false,
  });

  res.json(doc);
});

module.exports = app;
