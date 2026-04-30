const taskModel = require("../models/task.model")
const projectModel = require("../models/project.model")

/**
 * @route POST /api/projects/:projectId/tasks
 * @description Create a new task in project
 * @access Private (Project member only)
 */
const createTaskController = async (req, res) => {
    try {
        const { projectId } = req.params
        const { title, description, assignedTo, priority, dueDate } = req.body
        const userId = req.user._id

        if (!title) {
            return res.status(400).json({ message: "Task title is required" })
        }

        // Check if project exists and user has access
        const project = await projectModel.findById(projectId)
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        const task = new taskModel({
            title,
            description,
            project: projectId,
            assignedTo,
            createdBy: userId,
            priority,
            dueDate,
            status: "todo"
        })

        await task.save()
        await task.populate([
            { path: "assignedTo", select: "username email" },
            { path: "createdBy", select: "username email" },
            { path: "project", select: "name" }
        ])

        return res.status(201).json({
            message: "Task created successfully",
            data: task
        })
    } catch (error) {
        return res.status(500).json({ message: "Error creating task", error: error.message })
    }
}

/**
 * @route GET /api/projects/:projectId/tasks
 * @description Get all tasks in a project
 * @access Private (Project member only)
 */
const getProjectTasksController = async (req, res) => {
    try {
        const { projectId } = req.params
        const { status, priority, assignedTo } = req.query

        const filter = { project: projectId }

        if (status) {
            filter.status = status
        }

        if (priority) {
            filter.priority = priority
        }

        if (assignedTo) {
            filter.assignedTo = assignedTo
        }

        const tasks = await taskModel.find(filter)
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .populate("project", "name")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            data: tasks,
            count: tasks.length
        })
    } catch (error) {
        return res.status(500).json({ message: "Error fetching tasks", error: error.message })
    }
}

/**
 * @route GET /api/tasks/:taskId
 * @description Get single task details
 * @access Private (Project member only)
 */
const getTaskController = async (req, res) => {
    try {
        const { taskId } = req.params

        const task = await taskModel.findById(taskId)
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .populate("project", "name")

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        return res.status(200).json({ data: task })
    } catch (error) {
        return res.status(500).json({ message: "Error fetching task", error: error.message })
    }
}

/**
 * @route PUT /api/tasks/:taskId
 * @description Update task
 * @access Private (Project member or task creator only)
 */
const updateTaskController = async (req, res) => {
    try {
        const { taskId } = req.params
        const { title, description, assignedTo, status, priority, dueDate } = req.body

        const task = await taskModel.findByIdAndUpdate(
            taskId,
            {
                ...(title && { title }),
                ...(description !== undefined && { description }),
                ...(assignedTo !== undefined && { assignedTo }),
                ...(status && { status }),
                ...(priority && { priority }),
                ...(dueDate && { dueDate }),
                updatedAt: new Date()
            },
            { new: true }
        )
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .populate("project", "name")

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        return res.status(200).json({
            message: "Task updated successfully",
            data: task
        })
    } catch (error) {
        return res.status(500).json({ message: "Error updating task", error: error.message })
    }
}

/**
 * @route DELETE /api/tasks/:taskId
 * @description Delete task
 * @access Private (Project admin or task creator only)
 */
const deleteTaskController = async (req, res) => {
    try {
        const { taskId } = req.params

        const task = await taskModel.findByIdAndDelete(taskId)

        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        return res.status(200).json({ message: "Task deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: "Error deleting task", error: error.message })
    }
}

/**
 * @route GET /api/tasks/user/dashboard
 * @description Get dashboard data - tasks assigned to user
 * @access Private
 */
const getDashboardController = async (req, res) => {
    try {
        const userId = req.user._id

        // Get tasks assigned to user
        const assignedTasks = await taskModel.find({ assignedTo: userId })
            .populate("assignedTo", "username email")
            .populate("createdBy", "username email")
            .populate("project", "name")
            .sort({ dueDate: 1 })

        // Get counts by status
        const statusCounts = {
            todo: 0,
            inProgress: 0,
            completed: 0
        }

        assignedTasks.forEach(task => {
            if (task.status === "todo") statusCounts.todo++
            else if (task.status === "in-progress") statusCounts.inProgress++
            else if (task.status === "completed") statusCounts.completed++
        })

        // Get overdue tasks
        const overdueTasks = assignedTasks.filter(t => t.isOverdue && t.status !== "completed")

        // Get upcoming tasks (due in next 7 days)
        const now = new Date()
        const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

        const upcomingTasks = assignedTasks.filter(t => {
            return t.dueDate && t.dueDate >= now && t.dueDate <= sevenDaysLater && t.status !== "completed"
        })

        return res.status(200).json({
            data: {
                totalTasks: assignedTasks.length,
                statusCounts,
                overdueTasks: overdueTasks.length,
                upcomingTasks: upcomingTasks.length,
                tasks: assignedTasks,
                overdue: overdueTasks,
                upcoming: upcomingTasks
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Error fetching dashboard", error: error.message })
    }
}

module.exports = {
    createTaskController,
    getProjectTasksController,
    getTaskController,
    updateTaskController,
    deleteTaskController,
    getDashboardController
}
