import { useEffect } from "react"
import { useTask } from "../hooks/useTask"
import "../styles/dashboard.scss"

export const Dashboard = () => {
    const { dashboard, loading, error, fetchDashboard } = useTask()

    useEffect(() => {
        fetchDashboard()
    }, [fetchDashboard])

    if (loading) return <div className="dashboard-loading">Loading dashboard...</div>
    if (error) return <div className="dashboard-error">{error}</div>
    if (!dashboard) return <div className="dashboard-empty">No data available</div>

    return (
        <div className="dashboard">
            <h1>Your Dashboard</h1>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Total Tasks</h3>
                    <p className="stat-value">{dashboard.totalTasks}</p>
                </div>

                <div className="stat-card">
                    <h3>To Do</h3>
                    <p className="stat-value status-todo">{dashboard.statusCounts.todo}</p>
                </div>

                <div className="stat-card">
                    <h3>In Progress</h3>
                    <p className="stat-value status-inprogress">{dashboard.statusCounts.inProgress}</p>
                </div>

                <div className="stat-card">
                    <h3>Completed</h3>
                    <p className="stat-value status-completed">{dashboard.statusCounts.completed}</p>
                </div>

                <div className="stat-card alert">
                    <h3>Overdue</h3>
                    <p className="stat-value">{dashboard.overdueTasks}</p>
                </div>

                <div className="stat-card">
                    <h3>Upcoming (7 days)</h3>
                    <p className="stat-value">{dashboard.upcomingTasks}</p>
                </div>
            </div>

            <div className="dashboard-sections">
                {dashboard.overdue.length > 0 && (
                    <div className="dashboard-section">
                        <h2>Overdue Tasks</h2>
                        <div className="tasks-mini-list">
                            {dashboard.overdue.map(task => (
                                <div key={task._id} className="task-mini-item overdue">
                                    <span className="task-title">{task.title}</span>
                                    <span className="task-project">{task.project.name}</span>
                                    <span className="due-date">
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {dashboard.upcoming.length > 0 && (
                    <div className="dashboard-section">
                        <h2>Upcoming Tasks (Next 7 days)</h2>
                        <div className="tasks-mini-list">
                            {dashboard.upcoming.map(task => (
                                <div key={task._id} className="task-mini-item">
                                    <span className="task-title">{task.title}</span>
                                    <span className="task-project">{task.project.name}</span>
                                    <span className="due-date">
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="dashboard-section">
                    <h2>All Assigned Tasks</h2>
                    <div className="tasks-mini-list">
                        {dashboard.tasks.map(task => (
                            <div key={task._id} className={`task-mini-item status-${task.status.replace("-", "")}`}>
                                <span className="task-title">{task.title}</span>
                                <span className="task-status">{task.status}</span>
                                <span className="task-project">{task.project.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
