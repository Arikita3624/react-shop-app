import { Link } from "react-router-dom";
import { Button, Form, Input, InputNumber, message, Select } from "antd";
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

  // 👇 cập nhật mutationFn
  const { mutate } = useMutation({
    mutationFn: async (products: FieldType) => {
      const { variant_ids, ...productBody } = products;

      // 1) Tạo product
      const res = await instance.post("/products", productBody);
      const product = res.data;

      // 2) Liên kết variant qua bảng nối productVariants
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
    <div className="p-4">
      {contextHolder}
      <div className="mb-4 flex justify-between">
        <h1 className="text-2xl font-bold">Product Add</h1>
        <Link to={"/admin/products"}>
          <Button type="primary">Back to list</Button>
        </Link>
      </div>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item<FieldType>
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input your title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Thumbnail"
          name="thumbnail"
          rules={[{ required: true, message: "Please input your thumbnail!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Price"
          name="price"
          rules={[
            { required: true, message: "Please input your price!" },
            {
              type: "number",
              transform: (value) => Number(value),
              message: "Price must be a number",
            },
            {
              validator: (_, value) =>
                Number(value) > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("Price must be greater than 0")),
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
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
          <InputNumber />
        </Form.Item>
        <Form.Item<FieldType>
          label="Category"
          name="category_id"
          rules={[{ required: true, message: "Please input your category!" }]}
        >
          <Select
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            options={categories?.map((category: any) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </Form.Item>
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
        <Form.Item<FieldType> label="Variants" name="variant_ids">
          <Select
            mode="multiple"
            options={variants?.map((variant: VariantsType) => ({
              label: variant.name,
              value: variant.id,
            }))}
            placeholder="Chọn variant template (tuỳ chọn)"
          />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductsAdd;
