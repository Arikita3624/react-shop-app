import { Navigate, Route, Routes } from "react-router-dom";
import LayoutAdmin from "@/components/admin/LayoutAdmin";
import Products from "@/components/admin/views/products/Products";

const Router = () => {
  return (
    <div>
      <Routes>
        {/* Redirect root về /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Admin layout */}
        <Route path="/admin" element={<LayoutAdmin />}>
          {/* Route mặc định (index) -> Dashboard */}
          <Route index element={<h2>Dashboard</h2>} />

          {/* Các trang con */}
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<h2>Categories</h2>} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </div>
  );
};

export default Router;
