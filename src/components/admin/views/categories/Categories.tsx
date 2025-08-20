import instance from "@/config/axios";
import { useQuery } from "@tanstack/react-query";
import { Button, Popconfirm, Table } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";

const Categories = () => {
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

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, product: any) => (
        <div className="flex gap-2">
          <Link to={`${product.id}/edit`}>
            <Button type="primary" icon={<EditOutlined />}>
              Edit
            </Button>
          </Link>
          <Popconfirm
            title="Delete"
            description="Are you sure to delete this product?"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataSource = categories?.map((category: any) => ({
    key: category.id,
    ...category,
  }));

  console.log(dataSource);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return (
    <div>
      <div className="mb-4 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
        </div>
        <div>
          <Link to={"add"}>
            <Button type="primary">Add</Button>
          </Link>
        </div>
      </div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default Categories;
