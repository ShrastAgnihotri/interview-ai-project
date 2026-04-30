import { useEffect, useState } from "react"
import { useProject } from "../hooks/useProject"
import "../styles/project.scss"

export const ProjectsList = ({ onSelectProject }) => {
    const { projects, loading, error, fetchProjects, deleteProject } = useProject()
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    useEffect(() => {
        fetchProjects()
    }, [fetchProjects])

    const handleDelete = async (projectId) => {
        try {
            await deleteProject(projectId)
            setDeleteConfirm(null)
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) return <div className="projects-loading">Loading projects...</div>
    if (error) return <div className="projects-error">{error}</div>

    return (
        <div className="projects-list">
            <h2>Projects</h2>
            {projects.length === 0 ? (
                <div className="no-projects">No projects yet. Create one to get started!</div>
            ) : (
                <div className="projects-grid">
                    {projects.map(project => (
                        <div key={project._id} className="project-card">
                            <div className="project-header">
                                <h3>{project.name}</h3>
                                <span className={`status ${project.status}`}>{project.status}</span>
                            </div>
                            <p className="project-description">{project.description}</p>
                            <div className="project-meta">
                                <span>{project.members.length + 1} members</span>
                                {project.dueDate && (
                                    <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                                )}
                            </div>
                            <div className="project-actions">
                                <button
                                    className="btn-primary"
                                    onClick={() => onSelectProject(project._id)}
                                >
                                    View
                                </button>
                                <button
                                    className="btn-danger"
                                    onClick={() => setDeleteConfirm(project._id)}
                                >
                                    Delete
                                </button>
                            </div>

                            {deleteConfirm === project._id && (
                                <div className="delete-confirm">
                                    <p>Are you sure? This will delete all tasks.</p>
                                    <button
                                        onClick={() => handleDelete(project._id)}
                                        className="btn-danger-confirm"
                                    >
                                        Confirm Delete
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
