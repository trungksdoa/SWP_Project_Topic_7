import React from "react";
import { Space, Table, Tag } from "antd";
import { useGetPaymentStatus } from "../../../hooks/admin/managePaymentStatus/useGetPaymentStatus";

const ManagePayment = () => {
  const { data: lstStatus } = useGetPaymentStatus();
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Payment Type",
      key: "referenceType",
      dataIndex: "referenceType",
      render: (_, payment) => {
        let color; // Declare the color variable
        if (payment.referenceType === "product") {
          color = "green";
          return <Tag color={color}>PAY FOR ORDER</Tag>;
        } else {
          color = "volcano";
          return <Tag color={color}>PAY FOR UPGRADE</Tag>;
        }
      },
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (_, payment) => {
        const color = "green";
        return (
          <Tag color={color} key={payment.paymentMethod}>
            {payment.paymentMethod}
          </Tag>
        );
      },
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (_, payment) => {
        let color;
        if (payment.paymentStatus === "PAID") {
          color = "green";
        } else if (payment.paymentStatus === "PENDING") {
          color = "orange";
        } else color = "red";
        return (
          <Tag color={color} key={payment.paymentStatus}>
            {payment.paymentStatus}
          </Tag>
        );
      },
    },
  ];
  const data = lstStatus;
  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ManagePayment;
