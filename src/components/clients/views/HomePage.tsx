/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Button, Row, Col } from "antd";
import banner from "@/uploads/6084255.jpg";
import { useQuery } from "@tanstack/react-query";
import instance from "@/config/axios";

const HomePage = () => {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await instance.get("/products");
      return res.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return (
    <div className="space-y-12 px-6 max-w-screen-xl mx-auto">
      {/* Banner */}
      <div className="mt-4 rounded overflow-hidden">
        <img
          src={banner}
          alt="banner"
          className="w-full h-auto rounded-md shadow-md"
        />
      </div>

      {/* Support Section */}
      <section className="text-center mb-25">
        <h1 className="text-3xl font-mono mb-6">Why Choose Us !?</h1>
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={8}>
            <Card hoverable>🚚 Free Shipping</Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable>💰 100% Money Back</Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card hoverable>📞 24/7 Support</Card>
          </Col>
        </Row>
      </section>

      {/* New Arrive Section */}
      <section className="pt-12 border-t border-slate-400">
        <h2 className="text-3xl font-mono mb-6 text-left underline">
          New Arrive
        </h2>
        <Row gutter={[16, 16]}>
          {products?.map((product: any, index: number) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.title}
                    src={product.thumbnail}
                    className="h-48 object-cover w-full"
                  />
                }
                actions={[<Button type="primary">Add to Cart</Button>]}
              >
                <Card.Meta
                  title={product.title}
                  description={`Price: ${product.price}`}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button type="default" size="large">
            Load More ...
          </Button>
        </div>
      </section>

      {/* Views Section */}
      <section className="pt-12 border-t border-slate-300">
        <h2 className="text-3xl font-mono mb-6 text-left underline">
          By Views
        </h2>
        <Row gutter={[16, 16]}>
          {products?.map((product: any, index: number) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.title}
                    src={product.thumbnail}
                    className="h-48 object-cover w-full"
                  />
                }
                actions={[<Button type="primary">Add to Cart</Button>]}
              >
                <Card.Meta
                  title={product.title}
                  description={`Price: ${product.price}`}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Button type="default" size="large">
            Load More ...
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
