const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    id: Number,
    firstName: String,
    lastName: String,
    mail: String,
    password: String,
    phone: String,
});

module.exports = new mongoose.model("User", UserSchema);
