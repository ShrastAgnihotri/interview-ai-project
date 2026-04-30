const { Router } = require('express')
const authMiddleware = require("../middlewares/auth.middleware")
const taskController = require("../controllers/task.controller")

const taskRouter = Router()

/**
 * @route POST /api/projects/:projectId/tasks
 * @description Create a new task
 * @access Private
 */
taskRouter.post("/:projectId/tasks", authMiddleware.authUser, taskController.createTaskController)

/**
 * @route GET /api/projects/:projectId/tasks
 * @description Get all tasks in project
 * @access Private
 */
taskRouter.get("/:projectId/tasks", authMiddleware.authUser, taskController.getProjectTasksController)

/**
 * @route GET /api/tasks/:taskId
 * @description Get single task
 * @access Private
 */
taskRouter.get("/:taskId", authMiddleware.authUser, taskController.getTaskController)

/**
 * @route PUT /api/tasks/:taskId
 * @description Update task
 * @access Private
 */
taskRouter.put("/:taskId", authMiddleware.authUser, taskController.updateTaskController)

/**
 * @route DELETE /api/tasks/:taskId
 * @description Delete task
 * @access Private
 */
taskRouter.delete("/:taskId", authMiddleware.authUser, taskController.deleteTaskController)

/**
 * @route GET /api/tasks/dashboard
 * @description Get user dashboard
 * @access Private
 */
taskRouter.get("/dashboard/my", authMiddleware.authUser, taskController.getDashboardController)

module.exports = taskRouter
