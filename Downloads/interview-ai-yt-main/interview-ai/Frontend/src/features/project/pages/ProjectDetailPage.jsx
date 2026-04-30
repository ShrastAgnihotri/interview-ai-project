import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { useProject } from "../hooks/useProject"
import { useTask } from "../../task/hooks/useTask"
import { ProjectMembers } from "../components/ProjectMembers"
import { CreateTaskForm } from "../../task/components/CreateTaskForm"
import { TasksList } from "../../task/components/TasksList"
import "../styles/project.scss"

export const ProjectDetailPage = () => {
    const { projectId } = useParams()
    const { currentProject, fetchProject, loading, error } = useProject()
    const [activeTab, setActiveTab] = useState("tasks")

    useEffect(() => {
        if (projectId) {
            fetchProject(projectId)
        }
    }, [projectId, fetchProject])

    if (loading) return <div className="project-detail-loading">Loading project...</div>
    if (error) return <div className="project-detail-error">{error}</div>
    if (!currentProject) return <div className="project-detail-empty">Project not found</div>

    return (
        <div className="project-detail">
            <div className="project-detail-header">
                <div className="project-info">
                    <h1>{currentProject.name}</h1>
                    <p className="project-description">{currentProject.description}</p>
                    <div className="project-status">
                        <span className={`status ${currentProject.status}`}>{currentProject.status}</span>
                        {currentProject.dueDate && (
                            <span className="due-date">
                                Due: {new Date(currentProject.dueDate).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="project-tabs">
                <button
                    className={`tab-button ${activeTab === "tasks" ? "active" : ""}`}
                    onClick={() => setActiveTab("tasks")}
                >
                    Tasks
                </button>
                <button
                    className={`tab-button ${activeTab === "members" ? "active" : ""}`}
                    onClick={() => setActiveTab("members")}
                >
                    Team
                </button>
            </div>

            <div className="project-content">
                {activeTab === "tasks" && (
                    <div className="tasks-section">
                        <div className="tasks-create">
                            <CreateTaskForm
                                projectId={projectId}
                                members={currentProject.members}
                                onSuccess={() => fetchProject(projectId)}
                            />
                        </div>
                        <div className="tasks-list">
                            <TasksList
                                projectId={projectId}
                                members={currentProject.members}
                            />
                        </div>
                    </div>
                )}

                {activeTab === "members" && (
                    <ProjectMembers
                        projectId={projectId}
                        members={currentProject.members}
                        owner={currentProject.owner}
                    />
                )}
            </div>
        </div>
    )
}
