import React from "react";
import { useGetAllOrder } from "../../../hooks/order/useGetAllOrder";
import { Table, Button } from "antd";

const ManageOrder = () => {
  const { data: lstOrder } = useGetAllOrder();
  console.log(lstOrder);

  const handleSendClick = (orderId) => {
    // Thực hiện logic khi nhấn button Send, ví dụ gửi yêu cầu API.
    console.log(`Send order with ID: ${orderId}`);
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        if (record.status === "SUCCESS") {
          return (
            <Button
              type="primary"
              onClick={() => handleSendClick(record.id)}
            >
              Send
            </Button>
          );
        }
        // Nếu không phải SUCCESS, sẽ không hiện button
        return null;
      },
    },
  ];

  const data = lstOrder;

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        onChange={onChange}
        rowKey={(record) => record.id} // Chỉ định giá trị id làm khóa cho mỗi hàng
      />
    </div>
  );
};

export default ManageOrder;
