import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

// Simple Toast Component
const Toast = ({ message, type }) => (
    <div
        style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            background: type === "error" ? "#dc2626" : "#16a34a",
            color: "white",
            padding: "1rem 1.5rem",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            fontSize: "0.95rem",
            fontWeight: "600",
            maxWidth: "300px",
            animation: "slideIn 0.3s ease",
        }}
    >
        {type === "error" ? "❌ " : "✅ "}
        {message}
    </div>
);

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const showToast = (message, type = "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async () => {
        console.log("Form submitted!");
        setLoading(true);
        try {
            const res = await API.post("/auth/login", { email, password });
            login(res.data.data.user, res.data.data.token);
            showToast("Login successful!", "success");
            setTimeout(() => navigate("/dashboard"), 500);
        } catch (err) {
            showToast(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                />
            )}

            <div style={styles.card}>
                <h2 style={styles.title}>Welcome Back</h2>
                <p style={styles.subtitle}>Login to your account</p>

                <form>
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={styles.input}
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        style={styles.button}
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p style={styles.link}>
                    Don't have an account? <Link to="/register">Register</Link>
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
