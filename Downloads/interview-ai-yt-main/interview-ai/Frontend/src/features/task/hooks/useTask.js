import { useContext } from "react"
import { TaskContext } from "../task.context"

export const useTask = () => {
    const context = useContext(TaskContext)
    if (!context) {
        throw new Error("useTask must be used within TaskProvider")
    }
    return context
}
