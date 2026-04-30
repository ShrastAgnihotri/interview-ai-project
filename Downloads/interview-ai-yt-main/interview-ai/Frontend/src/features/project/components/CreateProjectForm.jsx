import { useState } from "react"
import { useProject } from "../hooks/useProject"
import "../styles/project.scss"

export const CreateProjectForm = ({ onSuccess }) => {
    const { createProject, loading, error } = useProject()
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        dueDate: ""
    })
    const [submitError, setSubmitError] = useState("")

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitError("")

        if (!formData.name.trim()) {
            setSubmitError("Project name is required")
            return
        }

        try {
            await createProject(formData)
            setFormData({ name: "", description: "", dueDate: "" })
            onSuccess?.()
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Failed to create project")
        }
    }

    return (
        <form className="create-project-form" onSubmit={handleSubmit}>
            <h2>Create New Project</h2>

            {(error || submitError) && (
                <div className="form-error">{error || submitError}</div>
            )}

            <div className="form-group">
                <label htmlFor="name">Project Name *</label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter project description"
                    rows="4"
                />
            </div>

            <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                    id="dueDate"
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Creating..." : "Create Project"}
            </button>
        </form>
    )
}
