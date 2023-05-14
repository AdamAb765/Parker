const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({

    client: String,
    timeStart: String,
    timeEnd: String,
    isFinished: Boolean
});

module.exports = new mongoose.model("Order", OrderSchema);
