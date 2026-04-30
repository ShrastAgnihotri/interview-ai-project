import { useState } from "react"
import { useTask } from "../hooks/useTask"
import "../styles/task.scss"

export const CreateTaskForm = ({ projectId, members, onSuccess }) => {
    const { createTask, loading, error } = useTask()
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        assignedTo: "",
        priority: "medium",
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

        if (!formData.title.trim()) {
            setSubmitError("Task title is required")
            return
        }

        try {
            const taskData = {
                ...formData,
                assignedTo: formData.assignedTo || null
            }
            await createTask(projectId, taskData)
            setFormData({
                title: "",
                description: "",
                assignedTo: "",
                priority: "medium",
                dueDate: ""
            })
            onSuccess?.()
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Failed to create task")
        }
    }

    return (
        <form className="create-task-form" onSubmit={handleSubmit}>
            <h2>Create New Task</h2>

            {(error || submitError) && (
                <div className="form-error">{error || submitError}</div>
            )}

            <div className="form-group">
                <label htmlFor="title">Task Title *</label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
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
                    placeholder="Enter task description"
                    rows="3"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="assignedTo">Assign To</label>
                    <select
                        id="assignedTo"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                    >
                        <option value="">Unassigned</option>
                        {members.map(member => (
                            <option key={member.userId._id} value={member.userId._id}>
                                {member.userId.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
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
                {loading ? "Creating..." : "Create Task"}
            </button>
        </form>
    )
}
