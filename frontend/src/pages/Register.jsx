import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        console.log("Sending:", form);
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const res = await API.post("/auth/register", form);
            // eslint-disable-next-line no-undef
            login(res.data.data.user, res.data.data.token);
            setSuccess("Account created! Redirecting...");
            setTimeout(() => navigate("/dashboard"), 500);
        } catch (err) {
            console.log("Full error:", err.response?.data);
            const data = err.response?.data;
            if (data?.errors && data.errors.length > 0) {
                setError(data.errors.map((e) => e.message).join(", "));
            } else {
                setError(data?.message || "Registration failed");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Get started for free</p>

                {error && <div style={styles.error}>{error}</div>}
                {success && <div style={styles.success}>{success}</div>}

                <form>
                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            style={styles.input}
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={styles.input}
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            name="password"
                            placeholder="Min 6 characters"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        style={styles.button}
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p style={styles.link}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
    },
    card: {
        background: "white",
        padding: "2rem",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
    title: {
        margin: "0 0 0.5rem",
        fontSize: "1.8rem",
        fontWeight: "700",
        color: "#333",
    },
    subtitle: { margin: "0 0 1.5rem", color: "#666" },
    error: {
        background: "#fee2e2",
        color: "#dc2626",
        padding: "0.75rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        fontSize: "0.9rem",
    },
    success: {
        background: "#dcfce7",
        color: "#16a34a",
        padding: "0.75rem",
        borderRadius: "8px",
        marginBottom: "1rem",
        fontSize: "0.9rem",
    },
    field: { marginBottom: "1rem" },
    label: {
        display: "block",
        marginBottom: "0.4rem",
        fontWeight: "600",
        fontSize: "0.9rem",
    },
    input: {
        width: "100%",
        padding: "0.75rem",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "1rem",
        boxSizing: "border-box",
    },
    button: {
        width: "100%",
        padding: "0.85rem",
        background: "#4f46e5",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "0.5rem",
    },
    link: { textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" },
};
