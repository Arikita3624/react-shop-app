import { Outlet } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

const LayoutClient = () => {
  return (
    <div className="container">
      <div>
        <Header />
      </div>
      <Outlet />
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default LayoutClient;
