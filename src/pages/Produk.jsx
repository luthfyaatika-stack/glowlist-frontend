// Produk.jsx
import { useEffect, useState } from "react";

export default function Produk () {
    const [produk, setProduk] = useState([]);
    const [loading, setLoading] = useState(true);

    const getProduk = async () => {
        try {
            const res = await fetch("http://localhost:5000/produk");
            const data = await res.json();
            setProduk(data);
        } catch (err) {
            console.error("Gagal fetch data:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProduk();
    }, []);
}