import { Layout, Menu, Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header
      style={{
        backgroundColor: "#fff",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.06)",
        height: 64,
      }}
    >
      {/* Logo */}
      <div style={{ fontWeight: 600, fontSize: "1.2rem" }}>MyBrand</div>

      {/* Menu */}
      <Menu
        mode="horizontal"
        defaultSelectedKeys={["home"]}
        style={{ borderBottom: "none", fontWeight: 500 }}
        items={[
          { key: "home", label: "Trang chủ" },
          { key: "products", label: "Sản phẩm" },
          { key: "contact", label: "Liên hệ" },
        ]}
      />

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Button type="text">Đăng nhập</Button>
        <Avatar icon={<UserOutlined />} />
      </div>
    </Header>
  );
};

export default AppHeader;
