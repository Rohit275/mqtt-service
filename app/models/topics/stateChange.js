const mongoose = require('mongoose');

var stateChangeSchema = new mongoose.Schema({}, { strict: false });
module.exports = mongoose.model("statechange", stateChangeSchema);