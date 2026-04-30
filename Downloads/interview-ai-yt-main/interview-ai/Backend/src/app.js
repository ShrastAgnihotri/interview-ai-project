const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    // origin: process.env.FRONTEND_URL || "http://localhost:5173",
    origin: [process.env.FRONTEND_URL, "https://interview-ai-project-delta.vercel.app", "http://localhost:5173"],
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")
const projectRouter = require("./routes/project.routes")
const taskRouter = require("./routes/task.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/projects", projectRouter)
app.use("/api/tasks", taskRouter)



module.exports = app