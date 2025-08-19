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

const ProductsEdit = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: product,
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

  const { data: variants } = useQuery({
    queryKey: ["variants"],
    queryFn: async () => {
      const res = await instance.get("/variants");
      return res.data;
    },
  });

  const { data: productVariants } = useQuery({
    queryKey: ["productVariants", id],
    queryFn: async () => {
      const res = await instance.get(`/productVariants?product_id=${id}`);
      return res.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (values: FieldType) => {
      const { variant_ids, ...productBody } = values;
      const productId = Number(id); // Chuyển đổi id sang số

      // Cập nhật sản phẩm
      const res = await instance.put(`/products/${id}`, productBody);
      const updatedProduct = res.data;

      // Xử lý cập nhật biến thể
      if (productVariants) {
        // Xóa các biến thể không còn trong lựa chọn mới
        await Promise.all(
          productVariants
            .filter((pv: any) => !variant_ids?.includes(pv.variant_id))
            .map((pv: any) => instance.delete(`/productVariants/${pv.id}`))
        );
      }

      // Thêm hoặc cập nhật các biến thể mới
      if (variant_ids && variant_ids.length) {
        const mapById = new Map(
          (variants as VariantsType[]).map((v) => [v.id, v])
        );

        await Promise.all(
          variant_ids.map((vid) => {
            const existingVariant = productVariants?.find(
              (pv: any) => pv.variant_id === vid
            );
            if (existingVariant) {
              return instance.put(`/productVariants/${existingVariant.id}`, {
                product_id: productId, // Sử dụng productId đã chuyển đổi sang số
                variant_id: vid,
                price: mapById.get(vid)?.price ?? null,
              });
            } else {
              return instance.post("/productVariants", {
                product_id: productId, // Sử dụng productId đã chuyển đổi sang số
                variant_id: vid,
                price: mapById.get(vid)?.price ?? null,
              });
            }
          })
        );
      }

      return updatedProduct;
    },
    onSuccess: () => {
      messageApi.success("Update product successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setTimeout(() => navigate("/admin/products"), 1000); // Đợi 1 giây để thông báo hiển thị
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

  // Đặt giá trị ban đầu cho variant_ids dựa trên productVariants
  const initialVariantIds =
    productVariants?.map((pv: any) => pv.variant_id) || [];

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
            initialValues={{ ...product, variant_ids: initialVariantIds }}
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
                      message: "Giá phải là số",
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
                    { required: true, message: "Pls input stock" },
                    {
                      type: "number",
                      transform: (v) => Number(v),
                      message: "Số lượng phải là số",
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
                    placeholder="Chọn danh mục"
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
                  rules={[{ required: true, message: "Pls select status!" }]}
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
                    placeholder="Select variants"
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
                    placeholder="Mô tả ngắn"
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

export default ProductsEdit;
