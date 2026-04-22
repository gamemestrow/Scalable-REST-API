/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function AdminPanel() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState("users");

    useEffect(() => {
        fetchUsers();
        fetchAllTasks();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await API.get("/users");
            setUsers(res.data.data);
        } catch (err) {
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const fetchAllTasks = async () => {
        try {
            const res = await API.get("/tasks/admin/all");
            setTasks(res.data.data);
        } catch (err) {
            setError("Failed to load tasks");
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            await API.delete(`/users/${id}`);
            setSuccess("User deleted!");
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete user");
        }
    };

    const handleDeleteTask = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await API.delete(`/tasks/${id}`);
            setSuccess("Task deleted!");
            fetchAllTasks();
        } catch (err) {
            setError("Failed to delete task");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const roleColor = { admin: "#fef3c7", user: "#e0f2fe" };
    const roleText = { admin: "#d97706", user: "#0369a1" };
    const priorityColor = {
        low: "#86efac",
        medium: "#fcd34d",
        high: "#fca5a5",
    };
    const statusColor = {
        todo: "#e2e8f0",
        in_progress: "#bfdbfe",
        done: "#bbf7d0",
    };

    return (
        <div style={styles.container}>
            {/* Navbar */}
            <div style={styles.navbar}>
                <h2 style={styles.logo}>⚙️ Admin Panel</h2>
                <div style={styles.navRight}>
                    <span style={styles.welcome}>👋 {user?.name}</span>
                    <span style={styles.adminBadge}>Admin</span>
                    <button
                        style={styles.dashBtn}
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </button>
                    <button
                        style={styles.logoutBtn}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div style={styles.content}>
                {/* Messages */}
                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}

                {/* Stats Row */}
                <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                        <h3 style={styles.statNumber}>{users.length}</h3>
                        <p style={styles.statLabel}>Total Users</p>
                    </div>
                    <div style={styles.statCard}>
                        <h3 style={styles.statNumber}>{tasks.length}</h3>
                        <p style={styles.statLabel}>Total Tasks</p>
                    </div>
                    <div style={styles.statCard}>
                        <h3 style={styles.statNumber}>
                            {tasks.filter((t) => t.status === "done").length}
                        </h3>
                        <p style={styles.statLabel}>Completed Tasks</p>
                    </div>
                    <div style={styles.statCard}>
                        <h3 style={styles.statNumber}>
                            {
                                tasks.filter((t) => t.status === "in_progress")
                                    .length
                            }
                        </h3>
                        <p style={styles.statLabel}>In Progress</p>
                    </div>
                </div>

                {/* Tabs */}
                <div style={styles.tabs}>
                    <button
                        style={{
                            ...styles.tab,
                            ...(activeTab === "users" ? styles.activeTab : {}),
                        }}
                        onClick={() => setActiveTab("users")}
                    >
                        👥 Users ({users.length})
                    </button>
                    <button
                        style={{
                            ...styles.tab,
                            ...(activeTab === "tasks" ? styles.activeTab : {}),
                        }}
                        onClick={() => setActiveTab("tasks")}
                    >
                        📋 All Tasks ({tasks.length})
                    </button>
                </div>

                {/* Users Tab */}
                {activeTab === "users" && (
                    <div style={styles.tableWrapper}>
                        {loading ? (
                            <p style={styles.center}>Loading...</p>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Name</th>
                                        <th style={styles.th}>Email</th>
                                        <th style={styles.th}>Role</th>
                                        <th style={styles.th}>Joined</th>
                                        <th style={styles.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr
                                            key={u.id}
                                            style={styles.tr}
                                        >
                                            <td style={styles.td}>{u.name}</td>
                                            <td style={styles.td}>{u.email}</td>
                                            <td style={styles.td}>
                                                <span
                                                    style={{
                                                        ...styles.badge,
                                                        background:
                                                            roleColor[u.role],
                                                        color: roleText[u.role],
                                                    }}
                                                >
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                {new Date(
                                                    u.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td style={styles.td}>
                                                {u.id !== user?.id && (
                                                    <button
                                                        style={styles.deleteBtn}
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                u.id,
                                                            )
                                                        }
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Tasks Tab */}
                {activeTab === "tasks" && (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Title</th>
                                    <th style={styles.th}>User</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Priority</th>
                                    <th style={styles.th}>Due Date</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((t) => (
                                    <tr
                                        key={t.id}
                                        style={styles.tr}
                                    >
                                        <td style={styles.td}>{t.title}</td>
                                        <td style={styles.td}>{t.user_name}</td>
                                        <td style={styles.td}>
                                            <span
                                                style={{
                                                    ...styles.badge,
                                                    background:
                                                        statusColor[t.status],
                                                }}
                                            >
                                                {t.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <span
                                                style={{
                                                    ...styles.badge,
                                                    background:
                                                        priorityColor[
                                                            t.priority
                                                        ],
                                                }}
                                            >
                                                {t.priority}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            {t.due_date
                                                ? t.due_date.split("T")[0]
                                                : "—"}
                                        </td>
                                        <td style={styles.td}>
                                            <button
                                                style={styles.deleteBtn}
                                                onClick={() =>
                                                    handleDeleteTask(t.id)
                                                }
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        background: "#f0f2f5",
        fontFamily: "sans-serif",
    },
    navbar: {
        background: "white",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    logo: { margin: 0, fontSize: "1.4rem", color: "#d97706" },
    navRight: { display: "flex", alignItems: "center", gap: "1rem" },
    welcome: { color: "#444", fontSize: "0.95rem" },
    adminBadge: {
        background: "#fef3c7",
        color: "#d97706",
        padding: "0.2rem 0.6rem",
        borderRadius: "20px",
        fontSize: "0.8rem",
        fontWeight: "600",
    },
    dashBtn: {
        background: "#4f46e5",
        color: "white",
        border: "none",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },
    logoutBtn: {
        background: "#ef4444",
        color: "white",
        border: "none",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },
    content: { maxWidth: "1100px", margin: "2rem auto", padding: "0 1rem" },
    error: {
        background: "#fee2e2",
        color: "#dc2626",
        padding: "0.75rem",
        borderRadius: "8px",
        marginBottom: "1rem",
    },
    success: {
        background: "#dcfce7",
        color: "#16a34a",
        padding: "0.75rem",
        borderRadius: "8px",
        marginBottom: "1rem",
    },
    statsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "1rem",
        marginBottom: "1.5rem",
    },
    statCard: {
        background: "white",
        padding: "1.5rem",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    statNumber: {
        margin: "0 0 0.25rem",
        fontSize: "2rem",
        fontWeight: "700",
        color: "#4f46e5",
    },
    statLabel: { margin: 0, color: "#666", fontSize: "0.9rem" },
    tabs: { display: "flex", gap: "0.5rem", marginBottom: "1rem" },
    tab: {
        padding: "0.6rem 1.2rem",
        borderRadius: "8px",
        border: "1px solid #ddd",
        background: "white",
        color: "#333",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "0.95rem",
    },
    activeTab: {
        background: "#4f46e5",
        color: "white",
        border: "1px solid #4f46e5",
    },
    tableWrapper: {
        background: "white",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {
        padding: "1rem",
        textAlign: "left",
        background: "#f8fafc",
        fontWeight: "700",
        fontSize: "0.85rem",
        color: "#444",
        borderBottom: "1px solid #e2e8f0",
    },
    tr: { borderBottom: "1px solid #f1f5f9" },
    td: { padding: "0.85rem 1rem", fontSize: "0.9rem", color: "#333" },
    badge: {
        padding: "0.2rem 0.6rem",
        borderRadius: "20px",
        fontSize: "0.75rem",
        fontWeight: "600",
        textTransform: "capitalize",
    },
    deleteBtn: {
        background: "#fff1f2",
        color: "#e11d48",
        border: "1px solid #fecdd3",
        borderRadius: "8px",
        padding: "0.3rem 0.7rem",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "0.85rem",
    },
    center: { textAlign: "center", padding: "2rem", color: "#666" },
};
