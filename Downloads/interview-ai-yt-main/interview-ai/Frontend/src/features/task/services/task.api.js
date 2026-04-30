import axios from "axios"

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const taskAPI = {
    // Create task
    createTask: (projectId, data) =>
        axios.post(`${API_BASE}/tasks/${projectId}/tasks`, data, { withCredentials: true }),

    // Get project tasks
    getProjectTasks: (projectId, filters = {}) =>
        axios.get(`${API_BASE}/tasks/${projectId}/tasks`, {
            params: filters,
            withCredentials: true
        }),

    // Get single task
    getTask: (taskId) =>
        axios.get(`${API_BASE}/tasks/${taskId}`, { withCredentials: true }),

    // Update task
    updateTask: (taskId, data) =>
        axios.put(`${API_BASE}/tasks/${taskId}`, data, { withCredentials: true }),

    // Delete task
    deleteTask: (taskId) =>
        axios.delete(`${API_BASE}/tasks/${taskId}`, { withCredentials: true }),

    // Get dashboard
    getDashboard: () =>
        axios.get(`${API_BASE}/tasks/dashboard/my`, { withCredentials: true })
}

export default taskAPI
