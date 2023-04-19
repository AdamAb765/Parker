const express = require("express");
const parks = require("./routers/parks");
const suplliers = require("./routers/suppliers");
const clients = require("./routers/clients");

const app = express();

app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(parks);
app.use(suplliers);
app.use(clients);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
