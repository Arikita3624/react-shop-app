import { Navigate, Route, Routes } from "react-router-dom";
import LayoutAdmin from "@/components/admin/LayoutAdmin";
import Products from "@/components/admin/views/products/Products";
import ProductsAdd from "@/components/admin/views/products/ProductsAdd";
import ProductsEdit from "@/components/admin/views/products/ProductsEdit";
import DashBoard from "@/components/admin/views/DashBoard";

const Router = () => {
  return (
    <div>
      <Routes>
        {/* Redirect root về /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />

        {/* Admin layout */}
        <Route path="/admin" element={<LayoutAdmin />}>
          {/* Route mặc định (index) -> Dashboard */}
          <Route index element={<DashBoard />} />

          {/* Products */}
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<ProductsAdd />} />
          <Route path="products/:id/edit" element={<ProductsEdit />} />
          {/*Categories */}
          <Route path="categories" element={<h2>Categories</h2>} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </div>
  );
};

export default Router;
