const mongoose = require("mongoose");

const ParkSchema = new mongoose.Schema({
    ownerId: Number,
    price: Number,
    title: String,
    instructions: String,
    image: String,
    address: String,
    longitude: Number,
    latitude: Number,
    isAvailable: Boolean,
    lastCameraRecord: String,
    currentParkingCar: Number,
    cameraName: String,
    cameraPort: Number,
    cameraIpAddress: String,
    accessibleStartTimeSun: String,
    accessibleEndTimeSun: String,
    accessibleStartTimeMon: String,
    accessibleEndTimeMon: String,
    accessibleStartTimeTue: String,
    accessibleEndTimeTue: String,
    accessibleStartTimeWed: String,
    accessibleEndTimeWed: String,
    accessibleStartTimeThu: String,
    accessibleEndTimeThu: String,
    accessibleStartTimeFri: String,
    accessibleEndTimeFri: String,
    accessibleStartTimeSat: String,
    accessibleEndTimeSat: String,
});

module.exports = new mongoose.model("Park", ParkSchema);
