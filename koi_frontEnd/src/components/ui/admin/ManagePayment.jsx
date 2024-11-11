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
      render: (_, payment) => {
        const date = new Date(payment.paymentDate);
        return (
          <div style={{ textAlign: 'center' }}>
            {date.getFullYear()}-{String(date.getMonth() + 1).padStart(2, '0')}-{String(date.getDate()).padStart(2, '0')}{' '}
            {String(date.getHours()).padStart(2, '0')}:{String(date.getMinutes()).padStart(2, '0')}:{String(date.getSeconds()).padStart(2, '0')}
          </div>
        );
      }
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ManagePayment;
