const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    parkId: Number,
    payment: Number,
    consumerId: Number,
    vehicleSerial: Number,
    timeStart: String,
    timeEnd: String,
});

module.exports = new mongoose.model("Order", OrderSchema);
