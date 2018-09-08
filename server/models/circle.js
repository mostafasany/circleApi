const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CircleFriends = require('../models/circleFriends');
const CircleFriendSchema = mongoose.model('CircleFriend').schema;

const circleSchema = new Schema({
    name: String,
    image_id: String,
    user_id: String,
    friends: [CircleFriendSchema]
});


module.exports = mongoose.model('Circle', circleSchema);