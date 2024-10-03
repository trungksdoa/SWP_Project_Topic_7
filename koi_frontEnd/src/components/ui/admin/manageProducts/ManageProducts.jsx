import React, { useEffect, useState } from "react";
import { Table, Input, Button, Spin } from "antd";
import { useGetAllProducts } from "../../../../hooks/admin/manageProducts/UseGetAllProducts";
import { EditOutlined } from "@ant-design/icons";
import { useDeleteProduct } from "../../../../hooks/admin/manageProducts/UseDeleteProduct";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../constant";
import { toast } from "react-toastify";

const ManageProducts = () => {
  const { data: lstProducts, refetch, isFetching } = useGetAllProducts();
  const mutate = useDeleteProduct();
  const navigate = useNavigate();
  const [filteredName, setFilteredName] = useState([]);

  useEffect(() => {
    refetch();
  }, []);

  // State để lưu trữ ID sản phẩm đang được xóa
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeletingId(id); // Set ID sản phẩm đang được xóa
      mutate.mutate(id, {
        onSuccess: () => {
          toast.success("Delete Product Successfully!");
          refetch();
          setDeletingId(null); // Xóa thành công, reset ID xóa
        },
        onError: () => {
          toast.error("Delete Product Failed!");
          setDeletingId(null); // Nếu lỗi, reset ID xóa
        },
      });
    }
  };

  // Cột bảng
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["ascend", "descend"],
      width: "5%",
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "15%",
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      width: "5%",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (imageUrl) => (
        <img className="w-[100px]" src={imageUrl} alt="product" />
      ),
      width: "10%",
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a, b) => a.stock - b.stock,
      width: "30%",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      sorter: (a, b) => a.stock - b.stock,
      width: "5%",
    },
    {
      title: "categoryId",
      dataIndex: "categoryId",
      render: (categoryId) => {
        if (categoryId === 1) return "Water management";
        if (categoryId === 2) return "Koi management";
        return "Unknown"; // Hoặc có thể trả về giá trị khác nếu cần
      },
      sorter: (a, b) => a.categoryId - b.categoryId,
      width: "10%",
    },
    {
      title: "Action",
      render: (_, prd) => (
        <div key={prd.id}>
          <Button
            onClick={() => {
              navigate(`${PATH.EDIT_PRODUCT}/${prd?.id}`);
            }}
            className="mr-[30px] bg-green-400 text-white hover:!bg-green-500 hover:!text-white"
          >
            Edit
          </Button>
          <Button
            className="bg-red-600 text-white hover:!bg-red-500 hover:!text-white  transition-all duration-300 ease-in-out"
            onClick={() => handleDelete(prd?.id)}
            loading={deletingId === prd?.id} // Kiểm tra nếu ID trùng với ID đang xóa thì hiện loading
            disabled={deletingId === prd?.id} // Vô hiệu hóa nút nếu đang xóa
          >
            Delete
          </Button>
        </div>
      ),
      width: "15%",
    },
  ];

  // Tìm kiếm theo tên sản phẩm
  const { Search } = Input;
  const onKeyUp = (e) => {
    const input = e?.target.value.toLowerCase();
    const filtered = lstProducts?.filter((product) =>
      product.name.toLowerCase().includes(input)
    );
    setFilteredName(filtered || []);
  };

  const data = filteredName.length > 0 ? filteredName : lstProducts;

  if (isFetching) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <div>
      <Search
        style={{ marginBottom: "20px" }}
        placeholder="input search text"
        allowClear
        size="large"
        onKeyUp={onKeyUp}
      />
      <button
        className="bg-orange-500 mb-[20px] text-white px-4 py-2 rounded-md"
        onClick={() => navigate(PATH.ADD_PRODUCT)}
      >
        Add new product
      </button>
      <Table
        columns={columns}
        dataSource={data}
        showSorterTooltip={{ target: "sorter-icon" }}
      />
    </div>
  );
};

export default ManageProducts;
