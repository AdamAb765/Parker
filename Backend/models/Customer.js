const mongoose = require("mongoose");

const ParkSchema = new mongoose.Schema({

    name: String,
    username: String,
    password: String
});

module.exports = new mongoose.model("Park", ParkSchema);
