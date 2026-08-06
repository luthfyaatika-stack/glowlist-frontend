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
};