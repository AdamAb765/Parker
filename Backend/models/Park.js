const mongoose = require("mongoose");

const ParkSchema = new mongoose.Schema({

    address: String,
    owner: String,
    isAvailable: Boolean
});

module.exports = new mongoose.model("Park", ParkSchema);
