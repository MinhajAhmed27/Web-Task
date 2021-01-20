var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose')

// make models dir and move all schema stuff
var customerSchema = new mongoose.Schema({
    username: String,
    password: String,
    //Customer can have multiple products
    product:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    }]
});

customerSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("customer",customerSchema);
