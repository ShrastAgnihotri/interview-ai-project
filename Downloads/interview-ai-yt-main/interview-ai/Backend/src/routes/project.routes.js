const { Router } = require('express')
const authMiddleware = require("../middlewares/auth.middleware")
const { checkProjectOwnerOrAdmin } = require("../middlewares/rbac.middleware")
const projectController = require("../controllers/project.controller")

const projectRouter = Router()

/**
 * @route POST /api/projects
 * @description Create a new project
 * @access Private
 */
projectRouter.post("/", authMiddleware.authUser, projectController.createProjectController)

/**
 * @route GET /api/projects
 * @description Get all user's projects
 * @access Private
 */
projectRouter.get("/", authMiddleware.authUser, projectController.getProjectsController)

/**
 * @route GET /api/projects/:projectId
 * @description Get single project
 * @access Private
 */
projectRouter.get("/:projectId", authMiddleware.authUser, projectController.getProjectController)

/**
 * @route PUT /api/projects/:projectId
 * @description Update project
 * @access Private (Owner/Admin only)
 */
projectRouter.put("/:projectId", authMiddleware.authUser, checkProjectOwnerOrAdmin, projectController.updateProjectController)

/**
 * @route DELETE /api/projects/:projectId
 * @description Delete project
 * @access Private (Owner only)
 */
projectRouter.delete("/:projectId", authMiddleware.authUser, projectController.deleteProjectController)

/**
 * @route POST /api/projects/:projectId/members
 * @description Add member to project
 * @access Private (Owner/Admin only)
 */
projectRouter.post("/:projectId/members", authMiddleware.authUser, checkProjectOwnerOrAdmin, projectController.addProjectMemberController)

/**
 * @route DELETE /api/projects/:projectId/members/:memberId
 * @description Remove member from project
 * @access Private (Owner/Admin only)
 */
projectRouter.delete("/:projectId/members/:memberId", authMiddleware.authUser, checkProjectOwnerOrAdmin, projectController.removeProjectMemberController)

/**
 * @route PUT /api/projects/:projectId/members/:memberId
 * @description Update member role
 * @access Private (Owner/Admin only)
 */
projectRouter.put("/:projectId/members/:memberId", authMiddleware.authUser, checkProjectOwnerOrAdmin, projectController.updateProjectMemberRoleController)

module.exports = projectRouter
