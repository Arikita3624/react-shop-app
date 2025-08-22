import { Outlet } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

const LayoutClient = () => {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-42">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default LayoutClient;
