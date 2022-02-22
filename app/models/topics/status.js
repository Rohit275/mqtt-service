const mongoose = require('mongoose');

var statusSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("status", statusSchema);