const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const circleFriendSchema = new Schema({
    friend_id: String,
    fname: String,
    lname: String,
    image_id: String,
});


module.exports = mongoose.model('CircleFriend', circleFriendSchema);