import React, { useEffect } from "react";
import { useGetAllOrder } from "../../../hooks/order/useGetAllOrder";
import { Table, Button, Tag, Modal,List, Typography, Divider,Space } from "antd";
import { usePostSendOrder } from "../../../hooks/order/usePostSendOrder";

import { toast } from "react-toastify";
const { Title, Text } = Typography;

const ManageOrder = () => {
  const { data: lstOrder, refetch, isFetching } = useGetAllOrder();

  const mutation = usePostSendOrder();
  
  useEffect(() => {
    refetch();
  }, []);


  const handleSendClick = (orderId) => {
    // Thực hiện logic khi nhấn button Send, ví dụ gửi yêu cầu API.
    mutation.mutate(orderId, {
      onSuccess: () => {
        toast.success("Sent Order !");
        refetch();
      },
      onError: (error) => {
        toast.error("Error: " + error.message);
      }
    });
  };

  const handleViewClick = (orderId) => {
    let order = lstOrder.find(obj => {
      return obj.id === orderId
    })
    Modal.info({
      title: 'Order Details',
      content: (
        <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
          <Title level={4}>Order #{order.id}</Title>
          <Divider />
          <Text strong>Customer: </Text>
          <Text>{order.fullName}</Text>
          <br />
          <Text strong>Total Amount: </Text>
          <Text>{order.totalAmount} VNĐ</Text>
          <Divider orientation="left">Items</Divider>
          <List
            itemLayout="horizontal"
            dataSource={order.items}
            renderItem={(item, index) => {
              const {name,imageUrl} = item.productId;
              return (
                <List.Item>
                  <List.Item.Meta
                    title={name}
                    description={
                      <div>
                        <Tag color="blue" className="!bg-blue-500 !text-white">Quantity: <Text className="!text-white">{item.quantity}</Text></Tag>
                        <Tag color="blue" className="!bg-blue-500 !text-white">Price: <Text className="!text-white">{item.unitPrice}</Text></Tag>
                      </div>
                    }
                    avatar={<img src={imageUrl} alt={name} style={{ width: '50px', height: '50px' }} />}
                    key={index}
                   
                  />
                  <div>
                    <Text strong>${(item.quantity * item.unitPrice).toFixed(2)}</Text>
                  </div>
                </List.Item>
              )
            }}
          />
        </div>
      ),
    });
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
    },
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
      render: (_, record) => {
        //{PENDING,CANCELLED, SUCCESS, SHIPPING, DELIVERED, COMPLETED}
        if (record.status === "PENDING") {
          return <Tag color="gray" className="!bg-gray-500 !text-white">PENDING</Tag>;
        }
        if (record.status === "CANCELLED") {
          return <Tag color="red" className="!bg-red-500 !text-white">CANCELLED</Tag>;
        }
        if (record.status === "SUCCESS") {
          return <Tag color="green" className="!bg-green-500 !text-white">WAIT FOR SHIPPING</Tag>;
        }
        if (record.status === "SHIPPING") {
          return <Tag color="blue" className="!bg-blue-500 !text-white">ON DELIVERY</Tag>;
        }
        if (record.status === "DELIVERED") {
          return <Tag color="purple" className="!bg-purple-500 !text-white">DELIVERED</Tag>;
        }
        //COMPLETED
        if (record.status === "COMPLETED") {
          return <Tag color="orange" className="!bg-orange-500 !text-white">COMPLETED</Tag>;
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        if (record.status === "SUCCESS") {
          return (
            <Button
              className="bg-blue-500 text-white hover:!bg-blue-600 hover:!text-white border-none"
              loading={mutation.isPending}
              onClick={() => handleSendClick(record?.id)}
            >
              Send order
            </Button>
          );
        }

        if (record.status === "SHIPPING" || record.status === "DELIVERED" || record.status === "COMPLETED") {
          return <Button onClick={() => handleViewClick(record?.id)}>View</Button>;
        }

        if(record.status === "PENDING") {
          return <Button>Cancel</Button>
        }

        
        return null;
        // Nếu không phải SUCCESS, sẽ không hiện button

      },
    },
  ];

  const data = lstOrder;

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <Button className="bg-blue-600 text-white hover:!bg-blue-500 hover:!text-white transition-all duration-300 ease-in-out" onClick={() => refetch()}>Refresh Data</Button>
      <Table
        loading={isFetching}
        columns={columns}
        dataSource={data}
        onChange={onChange}
        rowKey={(record) => record.id} // Chỉ định giá trị id làm khóa cho mỗi hàng
      />
    </div>
  );
};

export default ManageOrder;
