const { Router } = require("express");
const app = Router();

app.get("/clients", (req, res, next) => {
  res.json([
    {
      Address: "Tel-Aviv, Eben Gaviroll",
      Contact: "0522515944",
      Price: "22.5",
    },
    { Name: "Or Aviv", Contact: "0566511144" },
    { Name: "Carmel Kahal", Contact: "0511135944" },
    { Name: "Shay Tzuri", Contact: "0515615144" },
    { Name: "Amir Yadid", Contact: "0522514584" },
  ]);
});

app.post("/RegisterClient", (req, res) => {
  console.log("Client params:" + req.body);
  res.send("POST request to register a client");
});

module.exports = app;
