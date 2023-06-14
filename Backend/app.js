const express = require("express");
const mongoose = require("mongoose");
const parks = require("./routers/parks");
const vehicles = require("./routers/vehicles");
const users = require("./routers/users");
const orders = require("./routers/orders");

//const db_url = "mongodb://10.10.248.133:21771/parker";
const db_url = "mongodb://localhost:27017/parker";

mongoose
  .connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.error(error));

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/parks", parks);
app.use("/orders", orders);
app.use("/vehicles", vehicles);
app.use("/users", users);

// server config
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
