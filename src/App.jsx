import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Produk from "./pages/Produk";
import Kategori from "./pages/Kategori";
import Tentang from "./pages/Tentang";
import AddProduk from "./pages/AddProduk";
import EditProduk from "./pages/EditProduk";
import Login from "./pages/Login";
import Register from "./pages/Register";

// ===============================
// PROTECTED ROUTE
// ===============================
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ===============================
// APP
// ===============================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LOGIN ================= */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ================= HALAMAN UTAMA ================= */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />

          <Route path="produk" element={<Produk />} />

          <Route path="produk/tambah" element={<AddProduk />} />

          <Route path="produk/edit/:id" element={<EditProduk />} />

          <Route path="kategori" element={<Kategori />} />

          <Route path="tentang" element={<Tentang />} />
        </Route>

        {/* ================= URL TIDAK DIKENAL ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}