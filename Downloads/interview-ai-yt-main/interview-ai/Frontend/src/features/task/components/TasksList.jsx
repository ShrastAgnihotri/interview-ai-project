import { useEffect, useState } from "react"
import { useTask } from "../hooks/useTask"
import "../styles/task.scss"

export const TasksList = ({ projectId, members }) => {
    const { tasks, loading, error, fetchProjectTasks, updateTask, deleteTask } = useTask()
    const [filters, setFilters] = useState({ status: "", priority: "" })
    const [editingTask, setEditingTask] = useState(null)

    useEffect(() => {
        fetchProjectTasks(projectId, filters)
    }, [projectId, filters, fetchProjectTasks])

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateTask(taskId, { status: newStatus })
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Delete this task?")) {
            try {
                await deleteTask(taskId)
            } catch (err) {
                console.error(err)
            }
        }
    }

    const getPriorityClass = (priority) => {
        return `priority-${priority}`
    }

    const getStatusClass = (status) => {
        return `status-${status.replace("-", "")}`
    }

    const isOverdue = (task) => {
        return task.isOverdue && task.status !== "completed"
    }

    if (loading) return <div className="tasks-loading">Loading tasks...</div>

    return (
        <div className="tasks-container">
            <h2>Tasks</h2>

            <div className="tasks-filters">
                <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="filter-select"
                >
                    <option value="">All Status</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>

                <select
                    value={filters.priority}
                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                    className="filter-select"
                >
                    <option value="">All Priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            {error && <div className="tasks-error">{error}</div>}

            {tasks.length === 0 ? (
                <div className="no-tasks">No tasks found</div>
            ) : (
                <div className="tasks-list">
                    {tasks.map(task => (
                        <div
                            key={task._id}
                            className={`task-card ${getStatusClass(task.status)} ${isOverdue(task) ? "overdue" : ""}`}
                        >
                            <div className="task-header">
                                <h3>{task.title}</h3>
                                <div className="task-badges">
                                    <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                                        {task.priority}
                                    </span>
                                    {isOverdue(task) && <span className="overdue-badge">Overdue</span>}
                                </div>
                            </div>

                            <p className="task-description">{task.description}</p>

                            <div className="task-meta">
                                {task.assignedTo && (
                                    <span>Assigned: {task.assignedTo.username}</span>
                                )}
                                {task.dueDate && (
                                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                )}
                            </div>

                            <div className="task-actions">
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                    className="status-select"
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>

                                <button
                                    className="btn-small-danger"
                                    onClick={() => handleDeleteTask(task._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
