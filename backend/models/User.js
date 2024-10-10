// backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    githubId: {
        type: String,
        required: true,
        unique: true,
    },
    username: String,
    accessToken: String,
});

module.exports = mongoose.model('User', userSchema);
