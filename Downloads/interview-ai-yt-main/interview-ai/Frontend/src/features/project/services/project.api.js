import axios from "axios"

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const projectAPI = {
    // Create project
    createProject: (data) =>
        axios.post(`${API_BASE}/projects`, data, { withCredentials: true }),

    // Get all projects
    getProjects: () =>
        axios.get(`${API_BASE}/projects`, { withCredentials: true }),

    // Get single project
    getProject: (projectId) =>
        axios.get(`${API_BASE}/projects/${projectId}`, { withCredentials: true }),

    // Update project
    updateProject: (projectId, data) =>
        axios.put(`${API_BASE}/projects/${projectId}`, data, { withCredentials: true }),

    // Delete project
    deleteProject: (projectId) =>
        axios.delete(`${API_BASE}/projects/${projectId}`, { withCredentials: true }),

    // Add member to project
    addMember: (projectId, email, role = "member") =>
        axios.post(
            `${API_BASE}/projects/${projectId}/members`,
            { email, role },
            { withCredentials: true }
        ),

    // Remove member from project
    removeMember: (projectId, memberId) =>
        axios.delete(
            `${API_BASE}/projects/${projectId}/members/${memberId}`,
            { withCredentials: true }
        ),

    // Update member role
    updateMemberRole: (projectId, memberId, role) =>
        axios.put(
            `${API_BASE}/projects/${projectId}/members/${memberId}`,
            { role },
            { withCredentials: true }
        )
}

export default projectAPI
