import { Link } from "react-router-dom";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import instance from "@/config/axios";
import { useForm, type FormProps } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";

type VariantsType = { id: number; name: string; price: number };
type FieldType = {
  title?: string;
  thumbnail?: string;
  price?: number;
  stock?: number;
  status?: "available" | "unavailable";
  description?: string;
  category_id?: number;
  variant_ids?: number[];
};

const ProductsAdd = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm();

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await instance.get("/categories");
      return res.data;
    },
  });

  const { data: variants } = useQuery({
    queryKey: ["variants"],
    queryFn: async () => {
      const res = await instance.get("/variants");
      return res.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (products: FieldType) => {
      const { variant_ids, ...productBody } = products;

      // Thêm createdAt tự động với thời gian hiện tại
      const payload = {
        ...productBody,
        createdAt: new Date().toISOString(), // 04:18 PM +07, Wednesday, August 20, 2025
      };

      const res = await instance.post("/products", payload);
      const product = res.data;

      if (variant_ids && variant_ids.length) {
        const mapById = new Map(
          (variants as VariantsType[]).map((v) => [v.id, v])
        );

        await Promise.all(
          variant_ids.map((vid) =>
            instance.post("/productVariants", {
              product_id: product.id,
              variant_id: vid,
              price: mapById.get(vid)?.price ?? null,
            })
          )
        );
      }

      return product;
    },
    onSuccess: () => {
      messageApi.success("Add product successfully");
      form.resetFields();
    },
    onError: () => {
      messageApi.error("Add product failed");
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
  if (isError) return <div>Error</div>;

  return (
    <div className="min-h-screen flex items-start justify-center p-4">
      {contextHolder}

      <div className="w-full max-w-4xl">
        <Card
          className="shadow-sm"
          title={<span className="text-lg font-semibold">Product Add</span>}
          extra={
            <Link to="/admin/products">
              <Button type="primary">Back to list</Button>
            </Link>
          }
        >
          <Form
            className="compact-form"
            form={form}
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
                  rules={[
                    { required: true, message: "Please input your title!" },
                  ]}
                >
                  <Input placeholder="Eg. iPhone 15 Pro" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item<FieldType>
                  label="Thumbnail"
                  name="thumbnail"
                  rules={[
                    { required: true, message: "Please input your thumbnail!" },
                  ]}
                >
                  <Input placeholder="https://..." />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item<FieldType>
                  label="Price"
                  name="price"
                  rules={[
                    { required: true, message: "Please input your price!" },
                    {
                      type: "number",
                      transform: (v) => Number(v),
                      message: "Price must be a number",
                    },
                    {
                      validator: (_, v) =>
                        Number(v) > 0
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("Price must be greater than 0")
                            ),
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
                    { required: true, message: "Please input your stock!" },
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
                  rules={[
                    { required: true, message: "Please select a category!" },
                  ]}
                >
                  <Select
                    placeholder="Select category"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    options={categories?.map((category: any) => ({
                      label: category.name,
                      value: category.id,
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item<FieldType>
                  label="Status"
                  name="status"
                  initialValue="available"
                  rules={[{ required: true, message: "Please select status!" }]}
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
                <Form.Item<FieldType> label="Variants" name="variant_ids">
                  <Select
                    mode="multiple"
                    placeholder="Select variant template (optional)"
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                      String(option?.label || "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    maxTagCount="responsive"
                    listHeight={220}
                    options={variants?.map((v: VariantsType) => ({
                      label: v.name,
                      value: v.id,
                    }))}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Divider style={{ margin: "6px 0 8px" }} />
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
                <Form.Item style={{ marginTop: 4, marginBottom: 0 }}>
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

export default ProductsAdd;
