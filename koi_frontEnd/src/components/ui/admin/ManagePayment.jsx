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
          return (
            <div>
              <Tag color={color} style={{ width: '150px', textAlign: 'center' }}>
                PAY FOR ORDER
              </Tag>
            </div>
          );
        } else {
          color = "volcano";
          return (
            <div>
              <Tag color={color} style={{ width: '150px', textAlign: 'center' }}>
                PAY FOR UPGRADE
              </Tag>
            </div>
          );
        }
      },
    },
    {
      title: <div style={{ textAlign: 'center' }}>Payment Method</div>,
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (_, payment) => (
        <div style={{ textAlign: 'center' }}>
          <Tag color="green" style={{ width: '120px', textAlign: 'center' }}>
            {payment.paymentMethod}
          </Tag>
        </div>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Payment Date</div>,
      dataIndex: "paymentDate",
      key: "paymentDate",
    },
    {
      title: <div style={{ textAlign: 'center' }}>Payment Status</div>,
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
          <div style={{ textAlign: 'center' }}>
            <Tag color={color} style={{ width: '80px', textAlign: 'center' }}>
              {payment.paymentStatus}
            </Tag>
          </div>
        );
      },
    },
  ];
  
  const data = lstStatus?.sort((a, b) => 
    new Date(b.paymentDate) - new Date(a.paymentDate)
  );


  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ManagePayment;
