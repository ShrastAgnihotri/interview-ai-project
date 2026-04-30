const projectModel = require("../models/project.model")
const userModel = require("../models/user.model")
const taskModel = require("../models/task.model")

/**
 * @route POST /api/projects
 * @description Create a new project
 * @access Private
 */
const createProjectController = async (req, res) => {
    try {
        const { name, description, dueDate } = req.body
        const userId = req.user._id

        if (!name) {
            return res.status(400).json({ message: "Project name is required" })
        }

        const project = new projectModel({
            name,
            description,
            dueDate,
            owner: userId,
            members: []
        })

        await project.save()
        await project.populate([
            { path: "owner", select: "username email" },
            { path: "members.userId", select: "username email" }
        ])

        return res.status(201).json({
            message: "Project created successfully",
            data: project
        })
    } catch (error) {
        return res.status(500).json({ message: "Error creating project", error: error.message })
    }
}

/**
 * @route GET /api/projects
 * @description Get all projects of logged-in user
 * @access Private
 */
const getProjectsController = async (req, res) => {
    try {
        const userId = req.user._id

        // Get projects where user is owner or member
        const projects = await projectModel.find({
            $or: [
                { owner: userId },
                { "members.userId": userId }
            ]
        })
            .populate("owner", "username email")
            .populate("members.userId", "username email")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            data: projects,
            count: projects.length
        })
    } catch (error) {
        return res.status(500).json({ message: "Error fetching projects", error: error.message })
    }
}

/**
 * @route GET /api/projects/:projectId
 * @description Get single project details
 * @access Private
 */
const getProjectController = async (req, res) => {
    try {
        const { projectId } = req.params

        const project = await projectModel.findById(projectId)
            .populate("owner", "username email")
            .populate("members.userId", "username email")

        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        return res.status(200).json({ data: project })
    } catch (error) {
        return res.status(500).json({ message: "Error fetching project", error: error.message })
    }
}

/**
 * @route PUT /api/projects/:projectId
 * @description Update project details
 * @access Private (Owner/Admin only)
 */
const updateProjectController = async (req, res) => {
    try {
        const { projectId } = req.params
        const { name, description, dueDate, status } = req.body

        const project = await projectModel.findByIdAndUpdate(
            projectId,
            {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(dueDate && { dueDate }),
                ...(status && { status }),
                updatedAt: new Date()
            },
            { new: true }
        )
            .populate("owner", "username email")
            .populate("members.userId", "username email")

        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        return res.status(200).json({
            message: "Project updated successfully",
            data: project
        })
    } catch (error) {
        return res.status(500).json({ message: "Error updating project", error: error.message })
    }
}

/**
 * @route DELETE /api/projects/:projectId
 * @description Delete project
 * @access Private (Owner only)
 */
const deleteProjectController = async (req, res) => {
    try {
        const { projectId } = req.params
        const userId = req.user._id

        const project = await projectModel.findById(projectId)

        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        if (project.owner.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Only project owner can delete the project" })
        }

        // Delete all tasks in this project
        await taskModel.deleteMany({ project: projectId })

        await projectModel.findByIdAndDelete(projectId)

        return res.status(200).json({ message: "Project deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Error deleting project", error: error.message })
    }
}

/**
 * @route POST /api/projects/:projectId/members
 * @description Add member to project
 * @access Private (Owner/Admin only)
 */
const addProjectMemberController = async (req, res) => {
    try {
        const { projectId } = req.params
        const { email, role } = req.body

        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const project = await projectModel.findById(projectId)
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        // Check if already a member
        const isMember = project.members.some(m => m.userId.toString() === user._id.toString())
        if (isMember) {
            return res.status(400).json({ message: "User is already a member of this project" })
        }

        project.members.push({
            userId: user._id,
            role: role || "member"
        })

        await project.save()
        await project.populate([
            { path: "owner", select: "username email" },
            { path: "members.userId", select: "username email" }
        ])

        return res.status(200).json({
            message: "Member added successfully",
            data: project
        })
    } catch (error) {
        return res.status(500).json({ message: "Error adding member", error: error.message })
    }
}

/**
 * @route DELETE /api/projects/:projectId/members/:memberId
 * @description Remove member from project
 * @access Private (Owner/Admin only)
 */
const removeProjectMemberController = async (req, res) => {
    try {
        const { projectId, memberId } = req.params

        const project = await projectModel.findById(projectId)
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        project.members = project.members.filter(m => m.userId.toString() !== memberId)

        await project.save()
        await project.populate([
            { path: "owner", select: "username email" },
            { path: "members.userId", select: "username email" }
        ])

        return res.status(200).json({
            message: "Member removed successfully",
            data: project
        })
    } catch (error) {
        return res.status(500).json({ message: "Error removing member", error: error.message })
    }
}

/**
 * @route PUT /api/projects/:projectId/members/:memberId
 * @description Update member role
 * @access Private (Owner/Admin only)
 */
const updateProjectMemberRoleController = async (req, res) => {
    try {
        const { projectId, memberId } = req.params
        const { role } = req.body

        if (!role || !["admin", "member"].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be 'admin' or 'member'" })
        }

        const project = await projectModel.findById(projectId)
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        const member = project.members.find(m => m.userId.toString() === memberId)
        if (!member) {
            return res.status(404).json({ message: "Member not found in this project" })
        }

        member.role = role
        await project.save()
        await project.populate([
            { path: "owner", select: "username email" },
            { path: "members.userId", select: "username email" }
        ])

        return res.status(200).json({
            message: "Member role updated successfully",
            data: project
        })
    } catch (error) {
        return res.status(500).json({ message: "Error updating member role", error: error.message })
    }
}

module.exports = {
    createProjectController,
    getProjectsController,
    getProjectController,
    updateProjectController,
    deleteProjectController,
    addProjectMemberController,
    removeProjectMemberController,
    updateProjectMemberRoleController
}
