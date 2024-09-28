import React from "react";
import { Button, Table } from "antd";
import { useGetPackage } from "../../../../hooks/admin/managePackages/useGetPackage";
import { PATH } from "../../../../constant";

const ManagePackage = () => {
  const { data: lstPackage } = useGetPackage();

  const handleDelete = () => {

  }
  console.log(lstPackage);
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
            //   loading={deletingId === pkg?.id} // Kiểm tra nếu ID trùng với ID đang xóa thì hiện loading
            //   disabled={deletingId === pkg?.id} // Vô hiệu hóa nút nếu đang xóa
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
