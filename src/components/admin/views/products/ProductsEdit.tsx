/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Row,
  Col,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/config/axios";
import { useForm, type FormProps } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";

type FieldType = {
  title?: string;
  thumbnail?: string;
  price?: number;
  stock?: number;
  status?: "available" | "unavailable";
  description?: string;
  category_id?: number;
};

const ProductsEdit = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await instance.get(`/products/${id}`);
      return res.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await instance.get("/categories");
      return res.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (product: FieldType) => {
      const payload = {
        ...product,
        createdAt: products?.createdAt,
        updatedAt: new Date().toISOString(),
      };
      const res = await instance.put(`/products/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      messageApi.success("Update product successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setTimeout(() => navigate("/admin/products"), 1000);
    },
    onError: () => {
      messageApi.error("Update product failed");
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    mutate(values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error to load data</div>;

  return (
    <div className="min-h-screen flex items-start justify-center p-4">
      {contextHolder}
      <div className="w-full max-w-4xl">
        <Card
          className="shadow-sm"
          title={<span className="text-lg font-semibold">Product Edit</span>}
          extra={
            <Link to="/admin/products">
              <Button type="primary">Back to list</Button>
            </Link>
          }
        >
          <Form
            className="compact-form"
            form={form}
            initialValues={products}
            name="basic"
            size="small"
            layout="vertical"
            style={{ maxWidth: 920, margin: "0 auto" }}
            autoComplete="off"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row gutter={[12, 8]}>
              <Col xs={24} md={12}>
                <Form.Item<FieldType>
                  label="Title"
                  name="title"
                  rules={[{ required: true, message: "Pls input title" }]}
                >
                  <Input placeholder="Eg. iPhone 15 Pro" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item<FieldType>
                  label="Thumbnail"
                  name="thumbnail"
                  rules={[{ required: true, message: "Pls input thumbnail" }]}
                >
                  <Input placeholder="https://..." />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item<FieldType>
                  label="Price"
                  name="price"
                  rules={[
                    { required: true, message: "Pls input price" },
                    {
                      type: "number",
                      transform: (v) => Number(v),
                      message: "Price must be a number",
                    },
                    {
                      validator: (_, v) =>
                        Number(v) > 0
                          ? Promise.resolve()
                          : Promise.reject(new Error("Price must be > 0")),
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="EX: 1000000"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item<FieldType>
                  label="Stock"
                  name="stock"
                  rules={[
                    { required: true, message: "Pls input stock" },
                    {
                      type: "number",
                      transform: (v) => Number(v),
                      message: "Stock must be a number",
                    },
                    {
                      validator: (_, v) =>
                        Number.isInteger(Number(v)) && Number(v) > 0
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Stock must be a positive integer")
                            ),
                    },
                  ]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    placeholder="EX: 100"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item<FieldType>
                  label="Category"
                  name="category_id"
                  rules={[{ required: true, message: "Pls select category" }]}
                >
                  <Select
                    placeholder="Select category"
                    options={categories?.map((cat: any) => ({
                      label: cat.name,
                      value: cat.id,
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item<FieldType>
                  label="Status"
                  name="status"
                  rules={[{ required: true, message: "Pls select status" }]}
                >
                  <Select
                    options={[
                      { label: "Available", value: "available" },
                      { label: "Unavailable", value: "unavailable" },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Divider />
              </Col>

              <Col span={24}>
                <Form.Item label="Description" name="description">
                  <TextArea
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    placeholder="Short description"
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Submit
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ProductsEdit;
