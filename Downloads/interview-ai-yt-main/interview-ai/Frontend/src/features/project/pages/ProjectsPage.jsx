import { useEffect, useState } from "react"
import { useProject } from "../hooks/useProject"
import { ProjectsList } from "../components/ProjectsList"
import { CreateProjectForm } from "../components/CreateProjectForm"
import "../styles/project.scss"

export const ProjectsPage = ({ onSelectProject }) => {
    const [showCreateForm, setShowCreateForm] = useState(false)

    const handleProjectCreated = () => {
        setShowCreateForm(false)
    }

    return (
        <div className="projects-page">
            <div className="projects-header">
                <h1>Projects</h1>
                <button
                    className="btn-primary"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? "Hide Form" : "Create Project"}
                </button>
            </div>

            <div className="projects-content">
                {showCreateForm && (
                    <div className="projects-form-section">
                        <CreateProjectForm onSuccess={handleProjectCreated} />
                    </div>
                )}

                <ProjectsList onSelectProject={onSelectProject} />
            </div>
        </div>
    )
}
