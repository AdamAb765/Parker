const mongoose = require("mongoose");

const ParkSchema = new mongoose.Schema({
    ownerId: Number,
    accesableHours: String,
    price: Number,
    description: String,
    image: String,
    address: String,
    isAvailable: Boolean,
    cameraName: String,
    cameraPort: Number,
    cameraIpAddress: String
});

module.exports = new mongoose.model("Park", ParkSchema);
