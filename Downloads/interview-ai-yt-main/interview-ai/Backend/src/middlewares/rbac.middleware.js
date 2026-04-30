const projectModel = require("../models/project.model")

/**
 * Middleware to check if user has required role in project
 * @param {string} requiredRole - "admin" or "member"
 */
const checkProjectRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const { projectId } = req.params
            const userId = req.user._id

            if (!projectId) {
                return res.status(400).json({ message: "Project ID is required" })
            }

            const project = await projectModel.findById(projectId)

            if (!project) {
                return res.status(404).json({ message: "Project not found" })
            }

            // Owner is always admin
            if (project.owner.toString() === userId.toString()) {
                return next()
            }

            // Check if user is a member
            const member = project.members.find(m => m.userId.toString() === userId.toString())

            if (!member) {
                return res.status(403).json({ message: "You are not a member of this project" })
            }

            if (requiredRole === "admin" && member.role !== "admin") {
                return res.status(403).json({ message: "Only admins can perform this action" })
            }

            next()
        } catch (error) {
            return res.status(500).json({ message: "Error checking project role", error: error.message })
        }
    }
}

/**
 * Middleware to check if user is project owner or admin
 */
const checkProjectOwnerOrAdmin = async (req, res, next) => {
    try {
        const { projectId } = req.params
        const userId = req.user._id

        if (!projectId) {
            return res.status(400).json({ message: "Project ID is required" })
        }

        const project = await projectModel.findById(projectId)

        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        // Check if user is owner
        if (project.owner.toString() === userId.toString()) {
            return next()
        }

        // Check if user is admin member
        const member = project.members.find(m => m.userId.toString() === userId.toString())

        if (member && member.role === "admin") {
            return next()
        }

        return res.status(403).json({ message: "Only project owner or admin can perform this action" })
    } catch (error) {
        return res.status(500).json({ message: "Error checking authorization", error: error.message })
    }
}

module.exports = {
    checkProjectRole,
    checkProjectOwnerOrAdmin
}
