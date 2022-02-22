const mongoose = require("mongoose");

var dataSchema = new mongoose.Schema({}, { strict: false });
module.exports = mongoose.model("data", dataSchema);
