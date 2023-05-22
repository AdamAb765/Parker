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

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { mail, password } = req.body;
  const query = { mail: mail, password: password }
  const user = await User.findOne(query);
  if (!user) {
    res.status(409).send("No such a user");
  } else {
    res.status(200).send(user);
  }
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
