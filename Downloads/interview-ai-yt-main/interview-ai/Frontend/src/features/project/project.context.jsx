import { createContext, useState, useCallback } from "react"
import projectAPI from "../services/project.api"

export const ProjectContext = createContext()

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([])
    const [currentProject, setCurrentProject] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await projectAPI.getProjects()
            setProjects(response.data.data)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch projects")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchProject = useCallback(async (projectId) => {
        try {
            setLoading(true)
            setError(null)
            const response = await projectAPI.getProject(projectId)
            setCurrentProject(response.data.data)
            return response.data.data
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch project")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    const createProject = useCallback(async (data) => {
        try {
            setLoading(true)
            setError(null)
            const response = await projectAPI.createProject(data)
            setProjects([response.data.data, ...projects])
            return response.data.data
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create project")
            console.error(err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [projects])

    const updateProject = useCallback(async (projectId, data) => {
        try {
            setLoading(true)
            setError(null)
            const response = await projectAPI.updateProject(projectId, data)
            setProjects(projects.map(p => p._id === projectId ? response.data.data : p))
            if (currentProject?._id === projectId) {
                setCurrentProject(response.data.data)
            }
            return response.data.data
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update project")
            console.error(err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [projects, currentProject])

    const deleteProject = useCallback(async (projectId) => {
        try {
            setLoading(true)
            setError(null)
            await projectAPI.deleteProject(projectId)
            setProjects(projects.filter(p => p._id !== projectId))
            if (currentProject?._id === projectId) {
                setCurrentProject(null)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete project")
            console.error(err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [projects, currentProject])

    const addMember = useCallback(async (projectId, email, role = "member") => {
        try {
            setLoading(true)
            setError(null)
            const response = await projectAPI.addMember(projectId, email, role)
            setProjects(projects.map(p => p._id === projectId ? response.data.data : p))
            if (currentProject?._id === projectId) {
                setCurrentProject(response.data.data)
            }
            return response.data.data
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add member")
            console.error(err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [projects, currentProject])

    const removeMember = useCallback(async (projectId, memberId) => {
        try {
            setLoading(true)
            setError(null)
            const response = await projectAPI.removeMember(projectId, memberId)
            setProjects(projects.map(p => p._id === projectId ? response.data.data : p))
            if (currentProject?._id === projectId) {
                setCurrentProject(response.data.data)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to remove member")
            console.error(err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [projects, currentProject])

    const updateMemberRole = useCallback(async (projectId, memberId, role) => {
        try {
            setLoading(true)
            setError(null)
            const response = await projectAPI.updateMemberRole(projectId, memberId, role)
            setProjects(projects.map(p => p._id === projectId ? response.data.data : p))
            if (currentProject?._id === projectId) {
                setCurrentProject(response.data.data)
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update member role")
            console.error(err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [projects, currentProject])

    const value = {
        projects,
        currentProject,
        loading,
        error,
        fetchProjects,
        fetchProject,
        createProject,
        updateProject,
        deleteProject,
        addMember,
        removeMember,
        updateMemberRole
    }

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    )
}
