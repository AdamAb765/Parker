const { Router } = require("express");
const User = require('../models/User')
const app = Router();

app.get("/users", async (req, res, next) => {
  const allUsers = await User.find();
  res.json(allUsers);
});

app.get("/user/:id", async (req, res, next) => {
  const {id} = req.params;
  const user = await User.findById(id);
  res.json(user);
});


app.post("/newUser", (req, res) => {
  // console.log("Supplier params:" + req.body);
  const {user} = req.body;
  const newUser = new User(user);
  newUser
      .save()
      .then(() => {
        res.send("User added successfully")
      })
      .catch(err => console.log(err));
});

app.put("/editUser", async (req, res) => {
  console.log("update: " + req.body);
  const {user} = req.body;
  const {id} = {user};
  const query = {'id': id};

  const doc = await User.findOneAndUpdate(query, user, {
    returnOriginal: false
  });

  res.json(doc);

});

module.exports = app;
