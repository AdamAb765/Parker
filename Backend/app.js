const express = require("express");
const mongoose = require("mongoose");
const parks = require("./routers/parks");
const suplliers = require("./routers/suppliers");
const clients = require("./routers/clients");

const db_url = "mongodb://localhost:27017/parker";

mongoose.connect(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use(parks);
app.use(suplliers);
app.use(clients);

// server config
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
