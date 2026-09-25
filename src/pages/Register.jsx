import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

export default function Register() {

    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        password: "",
        no_hp: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:3001/pengguna",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Gagal membuat akun"
                );
            }

            setSuccess("Akun berhasil dibuat!");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            console.error("ERROR REGISTER:", error);

            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="register-card">

                <div className="register-header">
                    <h1>GlowList</h1>
                    <p>Buat akun baru kamu ✨</p>
                </div>

                <form onSubmit={handleSubmit}>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Nama</label>

                        <input
                            type="text"
                            name="nama"
                            placeholder="Masukkan nama"
                            value={formData.nama}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Masukkan email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>No. HP</label>

                        <input
                            type="text"
                            name="no_hp"
                            placeholder="Masukkan nomor HP"
                            value={formData.no_hp}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Buat password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? "Membuat akun..." : "Daftar"}
                    </button>

                </form>

                <div className="login-link">
                    <span>Sudah mempunyai akun?</span>

                    <Link to="/login">
                        Login
                    </Link>
                </div>

            </div>

        </div>
    );
}