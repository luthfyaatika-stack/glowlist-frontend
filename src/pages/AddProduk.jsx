import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduk.css";

export default function AddProduk() {
    const [kategori, setKategori] = useState([]);

    const [formData, setFormData] = useState({
        judul: "",
        deskripsi: "",
        harga: "",
        id_kategori: "",
    });

    const [file, setFile] = useState(null);

    const navigate = useNavigate();

    // =========================
    // HANDLE CHANGE
    // =========================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // =========================
    // AMBIL DATA KATEGORI
    // =========================
    useEffect(() => {
        const getKategori = async () => {
            try {
                const res = await fetch("http://localhost:3001/kategori");

                if (!res.ok) {
                    throw new Error("Gagal mengambil kategori");
                }

                const data = await res.json();
                setKategori(data);
            } catch (err) {
                console.error("Error mengambil kategori:", err);
            }
        };

        getKategori();
    }, []);

    // =========================
    // HANDLE SUBMIT
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();

            data.append("judul", formData.judul);
            data.append("deskripsi", formData.deskripsi);
            data.append("harga", formData.harga);
            data.append("id_kategori", formData.id_kategori);

            if (file) {
                data.append("file", file);
            }

            const res = await fetch("http://localhost:3001/produk", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: data,
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(
                    result.message || "Gagal menambahkan produk"
                );
            }

            alert("Produk berhasil ditambahkan 💗");

            navigate("/produk");

        } catch (err) {
            console.error("ERROR TAMBAH PRODUK:", err);
            alert(err.message || "Terjadi kesalahan saat menambah produk ❌");
        }
    };

    return (
        <div className="add-product-page">

            {/* HEADER */}
            <div className="add-product-header">
                <div>
                    <span className="small-title">
                        GlowList ✨
                    </span>

                    <h1>
                        Tambah Produk
                    </h1>

                    <p>
                        Yuk tambahkan produk kecantikan baru 💕
                    </p>
                </div>

                <div className="header-decoration">
                    ♡
                </div>
            </div>

            {/* FORM CARD */}
            <div className="add-product-card">

                <div className="form-title">
                    <div className="title-icon">
                        ✿
                    </div>

                    <div>
                        <h2>Informasi Produk</h2>
                        <p>Isi data produk dengan lengkap ya!</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* JUDUL */}
                    <div className="form-group">
                        <label>
                            Nama Produk
                        </label>

                        <input
                            type="text"
                            name="judul"
                            value={formData.judul}
                            onChange={handleChange}
                            placeholder="Contoh: G2 Hydrating Toner"
                            required
                        />
                    </div>

                    {/* DESKRIPSI */}
                    <div className="form-group">
                        <label>
                            Deskripsi
                        </label>

                        <textarea
                            name="deskripsi"
                            value={formData.deskripsi}
                            onChange={handleChange}
                            placeholder="Ceritakan sedikit tentang produk ini..."
                            rows="5"
                        />
                    </div>

                    {/* HARGA + KATEGORI */}
                    <div className="form-row">

                        <div className="form-group">
                            <label>
                                Harga
                            </label>

                            <div className="price-input">
                                <span>Rp</span>

                                <input
                                    type="number"
                                    name="harga"
                                    value={formData.harga}
                                    onChange={handleChange}
                                    placeholder="50000"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>
                                Kategori
                            </label>

                            <select
                                name="id_kategori"
                                value={formData.id_kategori}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Pilih Kategori
                                </option>

                                {kategori.map((item) => (
                                    <option
                                        key={item.id_kategori}
                                        value={item.id_kategori}
                                    >
                                        {item.kategori}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* FOTO */}
                    <div className="form-group">
                        <label>
                            Foto Produk
                        </label>

                        <div className="upload-box">

                            <div className="upload-icon">
                                📷
                            </div>

                            <div className="upload-text">
                                <strong>
                                    Pilih foto produk
                                </strong>

                                <span>
                                    Format JPG, PNG atau JPEG
                                </span>
                            </div>

                            <input
                                type="file"
                                name="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setFile(e.target.files[0])
                                }
                            />

                        </div>

                        {file && (
                            <div className="selected-file">
                                ♡ {file.name}
                            </div>
                        )}
                    </div>

                    {/* BUTTON */}
                    <div className="form-actions">

                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={() => navigate("/produk")}
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            className="btn-save"
                        >
                            Simpan Produk ✨
                        </button>

                    </div>

                </form>

            </div>

            {/* FOOTER */}
            <p className="cute-footer">
                Made with love by GlowList ♡
            </p>

        </div>
    );
}