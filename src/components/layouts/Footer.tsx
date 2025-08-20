import { Layout, Row, Col } from "antd";

const { Footer } = Layout;

const AppFooter = () => {
  return (
    <Footer
      style={{
        backgroundColor: "#fff",
        padding: "40px 24px",
        borderTop: "1px solid #f0f0f0",
        color: "#000",
      }}
    >
      <Row gutter={[32, 24]}>
        <Col xs={24} md={8}>
          <h3 style={{ fontWeight: 600 }}>MyBrand</h3>
          <p>Trang web demo sản phẩm bán hàng cực cháy 🔥</p>
        </Col>

        <Col xs={24} md={8}>
          <h4 style={{ fontWeight: 500 }}>Liên kết</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <a href="#">Trang chủ</a>
            </li>
            <li>
              <a href="#">Sản phẩm</a>
            </li>
            <li>
              <a href="#">Liên hệ</a>
            </li>
          </ul>
        </Col>

        <Col xs={24} md={8}>
          <h4 style={{ fontWeight: 500 }}>Liên hệ</h4>
          <p>Email: support@mybrand.vn</p>
          <p>Hotline: 0123 456 789</p>
        </Col>
      </Row>

      <div style={{ marginTop: 32, textAlign: "center", color: "#888" }}>
        © {new Date().getFullYear()} MyBrand. All rights reserved.
      </div>
    </Footer>
  );
};

export default AppFooter;
