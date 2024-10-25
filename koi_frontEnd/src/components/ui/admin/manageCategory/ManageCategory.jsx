import React, { useEffect, useState } from "react";
import { useGetCategory } from "../../../../hooks/admin/manageCategory/useGetCategory";
import { Button, Table, Spin } from "antd";
import { PATH } from "../../../../constant";
import { useNavigate } from "react-router-dom";
import { useDeleteCategory } from "../../../../hooks/admin/manageCategory/useDeleteCategory";
import { toast } from "react-toastify";
const ManageCategory = () => {
  const { data: lstCategory, refetch, isFetching } = useGetCategory();
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const mutation = useDeleteCategory();
  useEffect(() => {
    refetch();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      setDeletingId(id);
      mutation.mutate(id, {
        onSuccess: () => {
          toast.success("Delete Product Successfully!");
          refetch();
          setDeletingId(null);
        },
        onError: () => {
          toast.error("Delete Product Failed!");
          setDeletingId(null);
        },
      });
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Action",
      render: (_, category) => (
        <div key={category?.id}>
          <Button
            onClick={() => {
              navigate(`${PATH.EDIT_CATEGORY}/${category?.id}`);
            }}
            className="w-[70px] mr-[30px] bg-green-400 text-white hover:!bg-green-500 hover:!text-white mb-2"
          >
            Edit
          </Button>
          <Button
            className="w-[70px] bg-red-600 text-white hover:!bg-red-500 hover:!text-white  transition-all duration-300 ease-in-out"
            onClick={() => handleDelete(category?.id)}
            loading={deletingId === category?.id} // Kiểm tra nếu ID trùng với ID đang xóa thì hiện loading
            disabled={deletingId === category?.id} // Vô hiệu hóa nút nếu đang xóa
          >
            Delete
          </Button>
        </div>
      ),
      width: "15%",
    },
  ];
  const data = lstCategory;
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  if (isFetching) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <div>
      <Table columns={columns} dataSource={data} onChange={onChange} />
    </div>
  );
};

export default ManageCategory;
