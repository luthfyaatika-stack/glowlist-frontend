import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduk() {
    const [fromData, setFromData] = useNavigate({
        judul: "",
        deskripsi: "",
        harga: "",
        id_kategori: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFromData({ ...fromData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3001/produk", {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify(FormData),
            });
            if (res.ok) {
                alert("Produk berhasil ditambahkan 👌");
                navigate("/produk");
            }  else {
                const data = await res.json();
                alert(data.message || "Gagal menambah produk ❌");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Terjadi kesalahan saat menambah produk❌");
        }
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Tambah Produk👀</h2>
            <from onSubmit={handleSumbit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="from-label">Judul Produk</label>
                    <input
                    type="text"
                    name="judul"
                    value={FormData.judul}
                    onChange={handleChange}
                    placeholder="Masukkan nama produk"
                    required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea
                    name="deskripsi"
                    value={fromData.deskripsi}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Masukkan deskripsi produk"
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Harga</label>
                    <input 
                    type="number"
                    name="harga"
                    value={FormData.harga}
                    onChange={handleChange}
                    className="from-control"
                    placeholder="Masukkan harga"
                    required
                />
                </div>

                <div className="mb-3">
                    <label className="form-label">ID kategori</label>
                    <input
                       type="number"
                       name="id_kategori"
                       value={FormData.id_kategori}
                       onCanPlay={handleChange}
                       className="from-control"
                       placeholder="Masukkan ID kategori"
                       />
                </div>

                <button type="submit" className="btn btn-success">
                    Simpan
                </button>
            </from>
        </div>
    )
};
