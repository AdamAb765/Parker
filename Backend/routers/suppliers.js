const { Router } = require("express");
const app = Router();

app.get("/suppliers", (req, res, next) => {
  res.json([
    {
      Address: "Tel-Aviv, Eben Gaviroll",
      Contact: "0522515944",
      Price: "22.5",
    },
    { Name: "Beni Aviv", Contact: "0566515944" },
    { Name: "Ariel Kahal", Contact: "0522535944" },
    { Name: "Oz Tzuri", Contact: "0522515144" },
    { Name: "Guy Yadid", Contact: "0522515974" },
  ]);
});

app.post("/RegisterSupplier", (req, res) => {
  console.log("Supplier params:" + req.body);
  res.send("POST request to register a supplier");
});

module.exports = app;
