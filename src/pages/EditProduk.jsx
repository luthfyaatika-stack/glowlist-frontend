import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduk() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        judul: "",
        deskripsi: "",
        harga: "",
        id_kategori: "",
    });
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3001/produk/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setFormData(data[0]); // ambil data pertama hasil query
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, [id]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const yakin = window.confirm("Yakin mau menyimpan perubahan ini");

        if (!yakin) {
            return;
        }

        await fetch(`http://localhost:3001/produk/${id}`, {
            method: "PUT",
            headers: { "content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        alert("Produk berhasil diperbarui1");
        navigate("/produk");
    };

    if (loading) {
        return <div className="container mt-4">Loading...😐</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Edit Produk</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Judul</label>
                    <input
                        type="text"
                        name="judul"
                        value={formData.judul}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    className="form-control"
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">Harga</label>
                    <input 
                    type="number"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    className="form-control"
                />
                </div>

                <div className="mb-3">
                    <label className="form-label"> ID Kategori</label>
                    <select
                    name="id_kategori"
                    value={formData.id_kategori}
                    onChange={handleChange}
                    className="form-control"
                    required>
                        
                        <option value="">Pilih Kategori</option>
                        <option value="1">skincare</option>
                        <option value="4">makeup</option>
                    </select>
                </div>
                
                <button type="submit" className="btn btn-success me-2">
                    Simpan Perubahan
                </button>
            </form>
        </div>
    );
}