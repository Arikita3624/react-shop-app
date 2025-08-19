import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom"; // Thêm useNavigate
import Sider from "antd/es/layout/Sider";

const { Header, Content } = Layout;

const LayoutAdmin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const navigate = useNavigate(); // Thêm useNavigate để điều hướng

  // Xác định key dựa trên đường dẫn hiện tại
  const getSelectedKey = () => {
    switch (location.pathname) {
      case "/admin/dashboard":
        return "1";
      case "/admin/products":
        return "2";
      case "/admin/categories":
        return "3";
      default:
        return "1"; // Mặc định là Dashboard nếu không khớp
    }
  };

  // Xử lý khi nhấp vào Menu item
  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case "1":
        navigate("/admin");
        break;
      case "2":
        navigate("/admin/products");
        break;
      case "3":
        navigate("/admin/categories");
        break;
      default:
        navigate("/admin/dashboard");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        {/* Logo + Title */}
        <div
          style={{
            height: 40,
            margin: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: 8,
            padding: collapsed ? 0 : "0 8px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            fontWeight: 700,
            fontSize: collapsed ? 16 : 18,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(255,255,255,0.35)",
              flex: "0 0 auto",
            }}
          />
          {!collapsed && <span>Admin Panel</span>}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]} // Sử dụng selectedKeys động
          defaultSelectedKeys={["1"]} // Giá trị mặc định khi load lần đầu
          onClick={handleMenuClick} // Thêm sự kiện click
          items={[
            { key: "1", icon: <UserOutlined />, label: "Dashboard" },
            { key: "2", icon: <VideoCameraOutlined />, label: "Products" },
            { key: "3", icon: <UploadOutlined />, label: "Categories" },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
