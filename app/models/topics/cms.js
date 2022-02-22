const mongoose = require('mongoose');

var cmsSchema = new mongoose.Schema({}, { strict: false });
module.exports = mongoose.model("cms", cmsSchema);