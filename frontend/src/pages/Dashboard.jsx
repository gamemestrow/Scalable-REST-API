/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form state
    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Fetch tasks on load
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await API.get("/tasks");
            setTasks(res.data.data);
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            if (editingId) {
                await API.put(`/tasks/${editingId}`, form);
                setSuccess("Task updated!");
            } else {
                await API.post("/tasks", form);
                setSuccess("Task created!");
            }
            setForm({
                title: "",
                description: "",
                priority: "medium",
                due_date: "",
            });
            setEditingId(null);
            setShowForm(false);
            fetchTasks();
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleEdit = (task) => {
        setForm({
            title: task.title,
            description: task.description || "",
            priority: task.priority,
            due_date: task.due_date?.split("T")[0] || "",
        });
        setEditingId(task.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await API.delete(`/tasks/${id}`);
            setSuccess("Task deleted!");
            fetchTasks();
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Failed to delete task");
        }
    };

    const handleStatusChange = async (task, newStatus) => {
        try {
            await API.put(`/tasks/${task.id}`, { status: newStatus });
            fetchTasks();
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError("Failed to update status");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

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
                <h2 style={styles.logo}>📋 TaskAPI</h2>
                <div style={styles.navRight}>
                    <span style={styles.welcome}>👋 {user?.name}</span>
                    {user?.role === "admin" && (
                        <span style={styles.adminBadge}>Admin</span>
                    )}
                    {user?.role === "admin" && (
                        <button
                            style={styles.adminBtn}
                            onClick={() => navigate("/admin")}
                        >
                            ⚙️ Admin Panel
                        </button>
                    )}
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

                {/* Header row */}
                <div style={styles.headerRow}>
                    <h3 style={styles.heading}>My Tasks ({tasks.length})</h3>
                    <button
                        style={styles.addBtn}
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditingId(null);
                            setForm({
                                title: "",
                                description: "",
                                priority: "medium",
                                due_date: "",
                            });
                        }}
                    >
                        {showForm ? "✕ Cancel" : "+ New Task"}
                    </button>
                </div>

                {/* Task Form */}
                {showForm && (
                    <div style={styles.formCard}>
                        <h4 style={{ margin: "0 0 1rem" }}>
                            {editingId ? "Edit Task" : "Create New Task"}
                        </h4>
                        <form onSubmit={handleSubmit}>
                            <input
                                style={styles.input}
                                placeholder="Task title *"
                                value={form.title}
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                                required
                            />
                            <textarea
                                style={{
                                    ...styles.input,
                                    height: "80px",
                                    resize: "vertical",
                                }}
                                placeholder="Description (optional)"
                                value={form.description}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        description: e.target.value,
                                    })
                                }
                            />
                            <div style={styles.formRow}>
                                <select
                                    style={styles.select}
                                    value={form.priority}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            priority: e.target.value,
                                        })
                                    }
                                >
                                    <option value="low">🟢 Low</option>
                                    <option value="medium">🟡 Medium</option>
                                    <option value="high">🔴 High</option>
                                </select>
                                <input
                                    style={styles.select}
                                    type="date"
                                    value={form.due_date}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            due_date: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <button
                                style={styles.addBtn}
                                type="submit"
                            >
                                {editingId ? "Update Task" : "Create Task"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Tasks List */}
                {loading ? (
                    <p style={{ textAlign: "center", color: "#666" }}>
                        Loading tasks...
                    </p>
                ) : tasks.length === 0 ? (
                    <div style={styles.emptyState}>
                        <p>
                            No tasks yet. Click <strong>+ New Task</strong> to
                            get started!
                        </p>
                    </div>
                ) : (
                    <div style={styles.taskList}>
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                style={styles.taskCard}
                            >
                                <div style={styles.taskHeader}>
                                    <span
                                        style={{
                                            ...styles.priorityBadge,
                                            background:
                                                priorityColor[task.priority],
                                        }}
                                    >
                                        {task.priority}
                                    </span>
                                    <span
                                        style={{
                                            ...styles.statusBadge,
                                            background:
                                                statusColor[task.status],
                                        }}
                                    >
                                        {task.status.replace("_", " ")}
                                    </span>
                                </div>

                                <h4 style={styles.taskTitle}>{task.title}</h4>
                                {task.description && (
                                    <p style={styles.taskDesc}>
                                        {task.description}
                                    </p>
                                )}
                                {task.due_date && (
                                    <p style={styles.taskDue}>
                                        📅 Due: {task.due_date.split("T")[0]}
                                    </p>
                                )}

                                {/* Status changer */}
                                <select
                                    style={styles.statusSelect}
                                    value={task.status}
                                    onChange={(e) =>
                                        handleStatusChange(task, e.target.value)
                                    }
                                >
                                    <option value="todo">Todo</option>
                                    <option value="in_progress">
                                        In Progress
                                    </option>
                                    <option value="done">Done</option>
                                </select>

                                <div style={styles.taskActions}>
                                    <button
                                        style={styles.editBtn}
                                        onClick={() => handleEdit(task)}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        style={styles.deleteBtn}
                                        onClick={() => handleDelete(task.id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
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
    logo: { margin: 0, fontSize: "1.4rem", color: "#4f46e5" },
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
    logoutBtn: {
        background: "#ef4444",
        color: "white",
        border: "none",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },
    content: { maxWidth: "900px", margin: "2rem auto", padding: "0 1rem" },
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
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
    },
    heading: { margin: 0, fontSize: "1.3rem" },
    addBtn: {
        background: "#4f46e5",
        color: "white",
        border: "none",
        padding: "0.6rem 1.2rem",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },
    formCard: {
        background: "white",
        padding: "1.5rem",
        borderRadius: "12px",
        marginBottom: "1.5rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    input: {
        width: "100%",
        padding: "0.75rem",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "1rem",
        marginBottom: "0.75rem",
        boxSizing: "border-box",
    },
    formRow: { display: "flex", gap: "1rem", marginBottom: "0.75rem" },
    select: {
        flex: 1,
        padding: "0.75rem",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "0.95rem",
    },
    emptyState: {
        textAlign: "center",
        padding: "3rem",
        background: "white",
        borderRadius: "12px",
        color: "#666",
    },
    taskList: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "1rem",
    },
    taskCard: {
        background: "white",
        padding: "1.2rem",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },
    taskHeader: { display: "flex", gap: "0.5rem", marginBottom: "0.75rem" },
    priorityBadge: {
        padding: "0.2rem 0.6rem",
        borderRadius: "20px",
        fontSize: "0.75rem",
        fontWeight: "600",
        textTransform: "capitalize",
    },
    statusBadge: {
        padding: "0.2rem 0.6rem",
        borderRadius: "20px",
        fontSize: "0.75rem",
        fontWeight: "600",
        textTransform: "capitalize",
    },
    taskTitle: { margin: "0 0 0.5rem", fontSize: "1rem", fontWeight: "700" },
    taskDesc: { margin: "0 0 0.5rem", color: "#666", fontSize: "0.9rem" },
    taskDue: { margin: "0 0 0.75rem", color: "#888", fontSize: "0.85rem" },
    statusSelect: {
        width: "100%",
        padding: "0.5rem",
        borderRadius: "8px",
        border: "1px solid #ddd",
        marginBottom: "0.75rem",
        fontSize: "0.9rem",
    },
    taskActions: { display: "flex", gap: "0.5rem" },
    editBtn: {
        flex: 1,
        padding: "0.5rem",
        background: "#f0f9ff",
        color: "#0369a1",
        border: "1px solid #bae6fd",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },
    deleteBtn: {
        flex: 1,
        padding: "0.5rem",
        background: "#fff1f2",
        color: "#e11d48",
        border: "1px solid #fecdd3",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },

    adminBtn: {
        background: "#d97706",
        color: "white",
        border: "none",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },
};
