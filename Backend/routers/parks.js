const { Router } = require("express");
const app = Router();

app.get("/parks", (req, res, next) => {
  res.json([
    {
      Address: "Tel-Aviv, Eben Gaviroll",
      Contact: "0522515944",
      Price: "22.5",
    },
    { Address: "Bnei-Barak, Heletz", Contact: "0522515944", Price: "12.5" },
    { Address: "Tel-Aviv, HaMasger", Contact: "0522515944", Price: "21" },
    { Address: "Tel-Aviv, Savidor", Contact: "0522515944", Price: "14.5" },
    { Address: "Glilot, military camp", Contact: "0522515944", Price: "10.5" },
  ]);
});

app.post("/RegisterPark", (req, res) => {
  console.log(req.body);
  res.send("POST request to register a park");
});

app.post("/DocumentPark", (req, res) => {
  console.log("Client params:" + req.body);
  res.send("POST request to document a park that has been finisehd");
});

module.exports = app;
