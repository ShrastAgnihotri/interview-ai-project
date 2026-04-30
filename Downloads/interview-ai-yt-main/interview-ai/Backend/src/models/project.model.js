const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Project name is required"],
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    members: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member"
        }
    }],

    status: {
        type: String,
        enum: ["active", "completed", "archived"],
        default: "active"
    },

    dueDate: {
        type: Date
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const projectModel = mongoose.model("projects", projectSchema)

module.exports = projectModel
