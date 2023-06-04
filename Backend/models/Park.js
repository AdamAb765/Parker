const mongoose = require("mongoose");

const ParkSchema = new mongoose.Schema({
    ownerId: Number,
    accessibleStartTime: String,
    accessibleEndTime: String,
    price: Number,
    title: String,
    instructions: String,
    image: String,
    address: String,
    longitude: Number,
    latitude: Number,
    isAvailable: Boolean,
    cameraName: String,
    cameraPort: Number,
    cameraIpAddress: String
});

module.exports = new mongoose.model("Park", ParkSchema);
