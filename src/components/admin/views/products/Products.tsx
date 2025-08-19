import { useQuery } from "@tanstack/react-query";
import instance from "@/config/axios";
import { Button, Pagination, Popconfirm, Table } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { useState } from "react"; // 👈 thêm

const Products = () => {
  // fetch Api Products
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

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await instance.get("/categories");
      return res.data;
    },
  });

  // 👇 thêm rất nhẹ
  const [page, setPage] = useState(1);
  const pageSize = 5;

  //columns (giữ nguyên)
  const colums = [
    { title: "STT", dataIndex: "id", key: "id" },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail: string) => (
        <img src={thumbnail} alt="" width={50} height={50} />
      ),
    },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category_id",
      render: (category_id: number) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        categories?.find((category: any) => category.id === category_id)?.name,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={`${
            status === "available" ? "text-green-500" : "text-red-500"
          }`}
        >
          {status}
        </span>
      ),
    },
    { title: "Description", dataIndex: "description", key: "description" },
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

  //data Source (giữ nguyên mapping)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataSource = products?.map((product: any) => ({
    key: product.id,
    ...product,
  }));

  // 👇 cắt trang 5 item
  const pagedData = dataSource?.slice((page - 1) * pageSize, page * pageSize);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products List</h1>
        </div>
        <div>
          <Link to={`add`}>
            <Button type="primary">Create</Button>
          </Link>
        </div>
      </div>

      <div>
        <Table columns={colums} dataSource={pagedData} pagination={false} />

        <Pagination
          align="center"
          current={page}
          pageSize={pageSize}
          total={dataSource?.length || 0}
          showSizeChanger={false}
          showQuickJumper
          onChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
};

export default Products;
