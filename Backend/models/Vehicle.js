const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({

    serial: Number,
    color: String,
    brand: String,
    ownerId: Number
});

module.exports = new mongoose.model("Vehicle", VehicleSchema);
