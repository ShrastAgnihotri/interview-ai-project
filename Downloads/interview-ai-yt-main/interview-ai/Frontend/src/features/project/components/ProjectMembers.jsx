import { useState } from "react"
import { useProject } from "../hooks/useProject"
import "../styles/project.scss"

export const ProjectMembers = ({ projectId, members, owner }) => {
    const { addMember, removeMember, updateMemberRole, loading } = useProject()
    const [showAddForm, setShowAddForm] = useState(false)
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("member")
    const [error, setError] = useState("")

    const handleAddMember = async (e) => {
        e.preventDefault()
        setError("")

        if (!email.trim()) {
            setError("Email is required")
            return
        }

        try {
            await addMember(projectId, email, role)
            setEmail("")
            setRole("member")
            setShowAddForm(false)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add member")
        }
    }

    const handleChangeRole = async (memberId, newRole) => {
        try {
            await updateMemberRole(projectId, memberId, newRole)
        } catch (err) {
            console.error(err)
        }
    }

    const handleRemoveMember = async (memberId) => {
        if (window.confirm("Are you sure you want to remove this member?")) {
            try {
                await removeMember(projectId, memberId)
            } catch (err) {
                console.error(err)
            }
        }
    }

    return (
        <div className="project-members">
            <h3>Team Members</h3>

            <div className="members-list">
                <div className="member-item owner">
                    <div className="member-info">
                        <span className="member-name">{owner.username}</span>
                        <span className="member-role owner">Owner</span>
                    </div>
                </div>

                {members.map(member => (
                    <div key={member.userId._id} className="member-item">
                        <div className="member-info">
                            <span className="member-name">{member.userId.username}</span>
                            <select
                                value={member.role}
                                onChange={(e) => handleChangeRole(member.userId._id, e.target.value)}
                                className="member-role"
                                disabled={loading}
                            >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button
                            className="btn-small-danger"
                            onClick={() => handleRemoveMember(member.userId._id)}
                            disabled={loading}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {!showAddForm ? (
                <button
                    className="btn-secondary"
                    onClick={() => setShowAddForm(true)}
                    disabled={loading}
                >
                    Add Member
                </button>
            ) : (
                <form className="add-member-form" onSubmit={handleAddMember}>
                    {error && <div className="form-error">{error}</div>}

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Member email"
                        disabled={loading}
                    />

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        disabled={loading}
                    >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                    </select>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={loading}>
                            Add
                        </button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setShowAddForm(false)}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}
