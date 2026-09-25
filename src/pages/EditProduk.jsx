import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduk() {
    const { id } = useParams();
    const navigate = useNavigate();

    // ==========================================
    // STATE KATEGORI
    // ==========================================
    const [kategori, setKategori] = useState([]);

    // ==========================================
    // STATE FORM
    // ==========================================
    const [formData, setFormData] = useState({
        judul: "",
        deskripsi: "",
        harga: "",
        id_kategori: "",
        nama_file: "",
    });

    const [fileBaru, setFileBaru] = useState(null);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // HANDLE CHANGE
    // ==========================================
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ==========================================
    // AMBIL DATA KATEGORI
    // ==========================================
    useEffect(() => {
        const getKategori = async () => {
            try {
                const res = await fetch(
                    "http://localhost:3001/kategori"
                );

                const data = await res.json();

                console.log("DATA KATEGORI:", data);

                if (!res.ok) {
                    throw new Error(
                        data.message ||
                        "Gagal mengambil kategori"
                    );
                }

                setKategori(data);
            } catch (error) {
                console.error(
                    "ERROR AMBIL KATEGORI:",
                    error
                );
            }
        };

        getKategori();
    }, []);

    // ==========================================
    // AMBIL DATA PRODUK
    // ==========================================
    useEffect(() => {
        const getData = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                if (!token) {
                    alert(
                        "Token tidak ditemukan. Silakan login kembali."
                    );

                    navigate("/login");
                    return;
                }

                const res = await fetch(
                    `http://localhost:3001/produk/${id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                console.log(
                    "DATA PRODUK:",
                    data
                );

                // ==================================
                // TOKEN TIDAK VALID
                // ==================================
                if (res.status === 401) {
                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "idPengguna"
                    );

                    localStorage.removeItem(
                        "nama"
                    );

                    alert(
                        "Sesi login sudah tidak valid. Silakan login kembali."
                    );

                    navigate("/login");
                    return;
                }

                // ==================================
                // ERROR
                // ==================================
                if (!res.ok) {
                    throw new Error(
                        data.message ||
                        data.error ||
                        "Gagal mengambil data produk"
                    );
                }

                // ==================================
                // DATA PRODUK
                // ==================================
                const produk = Array.isArray(data)
                    ? data[0]
                    : data;

                if (!produk) {
                    throw new Error(
                        "Data produk tidak ditemukan"
                    );
                }

                // ==================================
                // MASUKKAN DATA KE FORM
                // ==================================
                setFormData({
                    judul: produk.judul || "",

                    deskripsi:
                        produk.deskripsi || "",

                    harga:
                        produk.harga ?? "",

                    id_kategori:
                        produk.id_kategori ?? "",

                    nama_file:
                        produk.nama_file || "",
                });

            } catch (error) {
                console.error(
                    "ERROR AMBIL PRODUK:",
                    error
                );

                alert(
                    "Gagal mengambil produk:\n" +
                    error.message
                );

                navigate("/produk");

            } finally {
                setLoading(false);
            }
        };

        getData();

    }, [id, navigate]);

    // ==========================================
    // PILIH FOTO BARU
    // ==========================================
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setFileBaru(file);
        } else {
            setFileBaru(null);
        }
    };

    // ==========================================
    // SIMPAN PERUBAHAN
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const yakin = window.confirm(
            "Yakin mau menyimpan perubahan ini?"
        );

        if (!yakin) {
            return;
        }
        if(fileBaru && fileBaru.size > 2 * 1024 * 1024) {
            alert("ukuran file terlalu besar, maksimal 2 MB")
            return;
        }

        try {
            const token =
                localStorage.getItem("token");

            if (!token) {
                alert(
                    "Token tidak ditemukan. Silakan login kembali."
                );

                navigate("/login");
                return;
            }

            // ==================================
            // FORMDATA
            // ==================================
            const dataForm = new FormData();

            dataForm.append(
                "judul",
                formData.judul
            );

            dataForm.append(
                "deskripsi",
                formData.deskripsi
            );

            dataForm.append(
                "harga",
                formData.harga
            );

            dataForm.append(
                "id_kategori",
                formData.id_kategori
            );

            // ==================================
            // FOTO BARU
            // ==================================
            if (fileBaru) {
                dataForm.append(
                    "file",
                    fileBaru
                );
            }

            // ==================================
            // CEK DATA FORMDATA
            // ==================================
            console.log(
                "DATA YANG DIKIRIM:"
            );

            for (const pair of dataForm.entries()) {
                console.log(
                    pair[0],
                    pair[1]
                );
            }

            // ==================================
            // UPDATE PRODUK
            // ==================================
            const res = await fetch(
                `http://localhost:3001/produk/${id}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: dataForm,
                }
            );

            const data = await res.json();

            console.log(
                "STATUS:",
                res.status
            );

            console.log(
                "RESPONSE:",
                data
            );

            // ==================================
            // TOKEN TIDAK VALID
            // ==================================
            if (res.status === 401) {
                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "idPengguna"
                );

                localStorage.removeItem(
                    "nama"
                );

                alert(
                    "Sesi login sudah tidak valid. Silakan login kembali."
                );

                navigate("/login");
                return;
            }

            // ==================================
            // ERROR BACKEND
            // ==================================
            if (!res.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Gagal memperbarui produk"
                );
            }

            // ==================================
            // BERHASIL
            // ==================================
            alert(
                "Produk berhasil diperbarui! 👌"
            );

            navigate("/produk", {
                replace: true,
            });

        } catch (error) {
            console.error(
                "ERROR UPDATE PRODUK:",
                error
            );

            alert(
                "Gagal memperbarui produk:\n" +
                error.message
            );
        }
    };

    // ==========================================
    // LOADING
    // ==========================================
    if (loading) {
        return (
            <div className="container mt-4">
                <h4>
                    Sedang memuat data...
                </h4>
            </div>
        );
    }

    // ==========================================
    // TAMPILAN
    // ==========================================
    return (
        <div className="container mt-4">

            <h2 className="mb-3">
                Edit Produk
            </h2>

            <form
                onSubmit={handleSubmit}
                className="card p-4 shadow-sm"
            >

                {/* ==============================
                    JUDUL
                ============================== */}
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
                        placeholder="Masukkan judul produk"
                        required
                    />
                </div>

                {/* ==============================
                    DESKRIPSI
                ============================== */}
                <div className="mb-3">
                    <label className="form-label">
                        Deskripsi
                    </label>

                    <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleChange}
                        className="form-control"
                        rows="4"
                        placeholder="Masukkan deskripsi produk"
                        required
                    />
                </div>

                {/* ==============================
                    HARGA
                ============================== */}
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

                {/* ==============================
                    KATEGORI
                ============================== */}
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
                                key={
                                    item.id_kategori
                                }
                                value={
                                    item.id_kategori
                                }
                            >
                                {item.kategori}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ==============================
                    FOTO LAMA
                ============================== */}
                <div className="mb-3">
                    <label className="form-label">
                        Foto Saat Ini
                    </label>

                    <div>
                        {formData.nama_file ? (
                            <img
                                src={
                                    `http://localhost:3001/uploads/${formData.nama_file}`
                                }
                                alt="Foto produk"
                                style={{
                                    width: "120px",
                                    height: "120px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border:
                                        "1px solid #ddd",
                                }}
                            />
                        ) : (
                            <p className="text-muted">
                                Tidak ada foto
                            </p>
                        )}
                    </div>
                </div>

                {/* ==============================
                    FOTO BARU
                ============================== */}
                <div className="mb-3">
                    <label className="form-label">
                        Ganti Foto (opsional)
                    </label>

                    <input
                        type="file"
                        name="file"
                        accept="image/*"
                        className="form-control"
                        onChange={
                            handleFileChange
                        }
                    />

                    {fileBaru && (
                        <div className="mt-2">
                            <small className="text-muted">
                                Foto baru dipilih:
                            </small>

                            <br />

                            <strong>
                                {fileBaru.name}
                            </strong>
                        </div>
                    )}
                </div>

                {/* ==============================
                    TOMBOL
                ============================== */}
                <div className="mt-3">

                    <button
                        type="submit"
                        className="btn btn-success me-2"
                    >
                        Simpan Perubahan
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate("/produk")
                        }
                    >
                        Batal
                    </button>

                </div>

            </form>
        </div>
    );
}