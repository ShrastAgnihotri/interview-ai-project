import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import { ProjectsPage } from "./features/project/pages/ProjectsPage";
import { ProjectDetailPage } from "./features/project/pages/ProjectDetailPage";
import { DashboardPage } from "./features/task/pages/DashboardPage";
import { useNavigate } from "react-router";

// Wrapper for ProjectsPage to handle navigation
const ProjectsPageWrapper = () => {
    const navigate = useNavigate()
    const handleSelectProject = (projectId) => {
        navigate(`/projects/${projectId}`)
    }
    return <ProjectsPage onSelectProject={handleSelectProject} />
}

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        path: "/projects",
        element: <Protected><ProjectsPageWrapper /></Protected>
    },
    {
        path: "/projects/:projectId",
        element: <Protected><ProjectDetailPage /></Protected>
    },
    {
        path: "/dashboard",
        element: <Protected><DashboardPage /></Protected>
    }
])