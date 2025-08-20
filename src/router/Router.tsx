import { Route, Routes } from "react-router-dom";
import LayoutAdmin from "@/components/admin/LayoutAdmin";
import Products from "@/components/admin/views/products/Products";
import ProductsAdd from "@/components/admin/views/products/ProductsAdd";
import ProductsEdit from "@/components/admin/views/products/ProductsEdit";
import DashBoard from "@/components/admin/views/DashBoard";
import Categories from "@/components/admin/views/categories/Categories";
import CategoriesAdd from "@/components/admin/views/categories/CategoriesAdd";
import HomePage from "@/components/clients/views/HomePage";
import LayoutClient from "@/components/clients/LayoutClient";
import ProductsList from "@/components/clients/views/products/ProductsList";

const Router = () => {
  return (
    <div>
      <Routes>
        {/* Client layout */}
        <Route path="/" element={<LayoutClient />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsList />} />
        </Route>

        {/* Admin layout */}
        <Route path="/admin" element={<LayoutAdmin />}>
          {/* Route mặc định (index) -> Dashboard */}
          <Route index element={<DashBoard />} />
          {/* Products */}
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<ProductsAdd />} />
          <Route path="products/:id/edit" element={<ProductsEdit />} />
          {/*Categories */}
          <Route path="categories" element={<Categories />} />
          <Route path="categories/add" element={<CategoriesAdd />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </div>
  );
};

export default Router;
