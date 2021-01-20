var mongoose = require("mongoose");

// Product schema
var productSchema = new mongoose.Schema({
    name:String,
});
module.exports = mongoose.model('product',productSchema);
