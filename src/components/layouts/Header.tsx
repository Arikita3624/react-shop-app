import { Layout, Menu, Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header
      style={{
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.06)",
        height: 64,
        padding: 0,
        position: "relative",
      }}
    >
      {/* Container để giới hạn chiều rộng */}
      <div
        style={{
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Logo bên trái */}
        <div
          style={{
            position: "absolute",
            left: 24,
            top: "50%",
            transform: "translateY(-50%)",
            fontWeight: 600,
            fontSize: "1.2rem",
          }}
        >
          MyBrand
        </div>

        {/* Menu chính giữa */}
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["home"]}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontWeight: 500,
            borderBottom: "none",
          }}
          items={[
            { key: "home", label: <Link to={"/"}>Home</Link> },
            { key: "products", label: <Link to={"/products"}>Products</Link> },
            { key: "contact", label: "Contact" },
            { key: "about", label: "About" },
          ]}
        />

        {/* Actions bên phải */}
        <div
          style={{
            position: "absolute",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div>
            <Link to={"/carts"}>Carts</Link>
          </div>
          <Button type="text">Login</Button>
          <Avatar
            icon={<UserOutlined />}
            size={32}
            style={{ minWidth: 32, minHeight: 32 }}
          />
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
