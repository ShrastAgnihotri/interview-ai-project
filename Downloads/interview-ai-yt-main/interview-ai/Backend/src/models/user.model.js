const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [ true, "username already taken" ],
        required: true,
    },

    email: {
        type: String,
        unique: [ true, "Account already exists with this email address" ],
        required: true,
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["admin", "member"],
        default: "member"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const userModel = mongoose.model("users", userSchema)

module.exports = userModel