import React, { useEffect, useState } from "react";
import { Button, Table, Spin } from "antd";
import { useGetPackage } from "../../../../hooks/admin/managePackages/useGetPackage";
import { PATH } from "../../../../constant";
import { useNavigate } from "react-router-dom";
import { useDeletePackage } from '../../../../hooks/admin/managePackages/useDeletePackage'
const ManagePackage = () => {
  const { data: lstPackage, refetch, isFetching } = useGetPackage();
  const navigate = useNavigate()
  const [deletingId, setDeletingId] = useState(null);
  const mutate = useDeletePackage()


  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      setDeletingId(id); 
      mutate.mutate(id, {
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
  }
  useEffect(() => {
    refetch()
  }, [])


  const columns = [
    {
        title: "Id",
        dataIndex: "id"
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "fishSlots",
      dataIndex: "fishSlots",
    },
    {
      title: "pondSlots",
      dataIndex: "pondSlots",
    },
    {
      title: "price",
      dataIndex: "price",
    },
    {
        title: "Action",
        render: (_, pkg) => (
          <div key={pkg.id}>
            <Button
              onClick={() => {
                navigate(`${PATH.EDIT_PACKAGE}/${pkg?.id}`);
              }}
              className="mr-[30px] bg-green-400 text-white hover:!bg-green-500 hover:!text-white"
            >
              Edit
            </Button>
            <Button
            className="bg-red-600 text-white hover:!bg-red-500 hover:!text-white  transition-all duration-300 ease-in-out"
              onClick={() => handleDelete(pkg?.id)}
              loading={deletingId === pkg?.id} // Kiểm tra nếu ID trùng với ID đang xóa thì hiện loading
              disabled={deletingId === pkg?.id} // Vô hiệu hóa nút nếu đang xóa
            >
              Delete
            </Button>
          </div>
        ),
        width: "15%",
      },
  ];
  const data = lstPackage
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
      <Table
        columns={columns}
        dataSource={data}
        onChange={onChange}
        showSorterTooltip={{
          target: "sorter-icon",
        }}
      />
    </div>
  );
};

export default ManagePackage;
