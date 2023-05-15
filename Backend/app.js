const express = require("express");
const mongoose = require("mongoose");
const parks = require("./routers/parks");
const vehicles = require("./routers/vehicles");
const users = require("./routers/users");
const orders = require("./routers/orders");

const db_url = "mongodb://localhost:27018/parker";

mongoose.connect(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// parks.use("/parks", (req, res, next) => {
//   console.log("Hello to parks");
//   next();
// });

// routes
app.use(parks);
app.use(orders);
app.use(vehicles);
app.use(users);

// server config
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
