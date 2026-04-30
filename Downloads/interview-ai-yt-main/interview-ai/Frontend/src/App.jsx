import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"
import { ProjectProvider } from "./features/project/project.context.jsx"
import { TaskProvider } from "./features/task/task.context.jsx"

function App() {

  return (
    <AuthProvider>
      <InterviewProvider>
        <ProjectProvider>
          <TaskProvider>
            <RouterProvider router={router} />
          </TaskProvider>
        </ProjectProvider>
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
