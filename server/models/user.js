const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fname: String,
    lname: String,
    gender: String,
    image_id: String,
    social_id: String,
    social_type: String,
});


module.exports = mongoose.model('User', userSchema);