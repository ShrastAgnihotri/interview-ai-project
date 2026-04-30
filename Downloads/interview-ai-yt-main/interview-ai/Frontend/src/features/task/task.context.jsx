import { createContext, useState, useCallback } from "react"
import taskAPI from "../services/task.api"

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([])
    const [dashboard, setDashboard] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchProjectTasks = useCallback(async (projectId, filters = {}) => {
        try {
            setLoading(true)
            setError(null)
            const response = await taskAPI.getProjectTasks(projectId, filters)
            setTasks(response.data.data)
            return response.data.data
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch tasks")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await taskAPI.getDashboard()
            setDashboard(response.data.data)
            return response.data.data
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch dashboard")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    const createTask = useCallback(async (projectId, data) => {
        try {
            setLoading(true)
            setError(null)
            const response = await taskAPI.createTask(projectId, data)
            setTasks([response.data.data, ...tasks])
            return response.data.data
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create task")
            console.error(err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [tasks])

    const updateTask = useCallback(async (taskId, data) => {
        try {
            setLoading(true)
            setError(null)
            const response = await taskAPI.updateTask(taskId, data)
            setTasks(tasks.map(t => t._id === taskId ? response.data.data : t))
            return response.data.data
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update task")
            console.error(err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [tasks])

    const deleteTask = useCallback(async (taskId) => {
        try {
            setLoading(true)
            setError(null)
            await taskAPI.deleteTask(taskId)
            setTasks(tasks.filter(t => t._id !== taskId))
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete task")
            console.error(err)
            throw err
        } finally {
            setLoading(false)
        }
    }, [tasks])

    const value = {
        tasks,
        dashboard,
        loading,
        error,
        fetchProjectTasks,
        fetchDashboard,
        createTask,
        updateTask,
        deleteTask
    }

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    )
}
