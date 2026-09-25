import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Email atau password salah");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("idPengguna", data.id_pengguna);
            localStorage.setItem("nama", data.nama);

            navigate("/produk");

        } catch (error) {
            console.error("LOGIN ERROR:", error);
            alert("Tidak dapat terhubung ke server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                {/* BAGIAN GAMBAR */}
                <div className="login-logo">

                    <div className="login-image">
                        <img
                            src="/images/c:\Users\USER\Downloads\0adcce9d36b5a5527078525d1f00f973.jpg"
                            alt="GlowList"
                        />
                    </div>

                    <h1>GlowList</h1>

                    <p>
                        Temukan kecantikanmu
                        <br />
                        bersama kami
                    </p>

                </div>

                {/* FORM LOGIN */}
                <form onSubmit={handleSubmit}>

                    <div className="input-group">
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

                    <div className="input-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Masukkan password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Memproses..." : "Login"}
                    </button>

                </form>

                {/* BELUM PUNYA AKUN */}
                <div className="register-link">
                    <span>Belum mempunyai akun?</span>

                    <Link to="/register">
                        Daftar sekarang
                    </Link>
                </div>

                <div className="login-footer">
                    <p> kantong anda tetep aman kok</p>
                </div>

            </div>

        </div>
    );
}

