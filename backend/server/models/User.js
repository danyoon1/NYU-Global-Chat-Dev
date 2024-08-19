const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2121
        },
        Admin: Number
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    profile: {
        school: {
            type: Number,
            default: 0
        },
        year: {
            type: Number,
            default: 0
        },
        biography: {
            type: String,
            default: ''
        }
    },
    refreshToken: [String]
});

module.exports = mongoose.model('User', userSchema);