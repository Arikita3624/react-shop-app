import { Link } from "react-router-dom";
import { Button, Card, Form, Input, message, Row, Col } from "antd";
import { useMutation } from "@tanstack/react-query";
import instance from "@/config/axios";
import { useForm, type FormProps } from "antd/es/form/Form";

type FieldType = {
  name?: string;
  description?: string;
};

const CategoriesAdd = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = useForm();

  const { mutate } = useMutation({
    mutationFn: async (category: FieldType) => {
      const payload = {
        ...category,
        createdAt: new Date().toISOString(),
      };

      const res = await instance.post("/categories", payload);
      return res.data;
    },
    onSuccess: () => {
      messageApi.success("Add category successfully");
      form.resetFields();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) =>
      messageApi.error(
        `Add category failed: ${error.message || "Unknown error"}`
      ),
  });

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    mutate(values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-4">
      {contextHolder}

      <div className="w-full max-w-4xl">
        <Card
          className="shadow-sm"
          title={<span className="text-lg font-semibold">Category Add</span>}
          extra={
            <Link to="/admin/categories">
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
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please input category name!" },
                  ]}
                >
                  <Input placeholder="Eg. Category A" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item<FieldType> label="Description" name="description">
                  <Input.TextArea
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

export default CategoriesAdd;
