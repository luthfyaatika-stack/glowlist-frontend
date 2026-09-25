import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

            // Upload foto jika dipilih
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

            alert("Produk berhasil ditambahkan 👌");

            navigate("/produk");

        } catch (err) {
            console.error("ERROR TAMBAH PRODUK:", err);
            alert(err.message || "Terjadi kesalahan saat menambah produk ❌");
        }
    };

    return (
        <div className="container mt-4">

            <h2 className="mb-3">
                Tambah Produk 👀
            </h2>

            <form
                onSubmit={handleSubmit}
                className="card p-4 shadow-sm"
            >

                {/* JUDUL */}
                <div className="mb-3">
                    <label className="form-label">
                        Judul Produk
                    </label>

                    <input
                        type="text"
                        name="judul"
                        value={formData.judul}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukkan nama produk"
                        required
                    />
                </div>

                {/* DESKRIPSI */}
                <div className="mb-3">
                    <label className="form-label">
                        Deskripsi
                    </label>

                    <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukkan deskripsi produk"
                        rows="4"
                    />
                </div>

                {/* HARGA */}
                <div className="mb-3">
                    <label className="form-label">
                        Harga
                    </label>

                    <input
                        type="number"
                        name="harga"
                        value={formData.harga}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Masukkan harga"
                        required
                    />
                </div>

                {/* KATEGORI */}
                <div className="mb-3">
                    <label className="form-label">
                        Kategori
                    </label>

                    <select
                        name="id_kategori"
                        value={formData.id_kategori}
                        onChange={handleChange}
                        className="form-select"
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

                {/* FOTO */}
                <div className="mb-3">
                    <label className="form-label">
                        Foto Produk
                    </label>

                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) =>
                            setFile(e.target.files[0])
                        }
                    />
                </div>

                {/* TOMBOL */}
                <div>
                    <button
                        type="submit"
                        className="btn btn-success"
                    >
                        Simpan
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => navigate("/produk")}
                    >
                        Batal
                    </button>
                </div>

            </form>
        </div>
    );
}