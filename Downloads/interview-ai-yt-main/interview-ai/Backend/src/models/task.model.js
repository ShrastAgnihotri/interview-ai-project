const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "projects",
        required: true
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    status: {
        type: String,
        enum: ["todo", "in-progress", "completed"],
        default: "todo"
    },

    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },

    dueDate: {
        type: Date
    },

    isOverdue: {
        type: Boolean,
        default: false
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

// Middleware to check if task is overdue
taskSchema.pre("save", function(next) {
    if (this.dueDate && this.status !== "completed") {
        this.isOverdue = new Date() > this.dueDate
    }
    next()
})

const taskModel = mongoose.model("tasks", taskSchema)

module.exports = taskModel
