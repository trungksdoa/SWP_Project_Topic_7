import React, { useState } from 'react';
import { Spin, Modal } from 'antd';
import ReceiptComponent from "../checkout/ReceiptComponent";

const OrderCompleted = ({ lstCompleted, isFetching }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleClick = (order) => {
    setSelectedOrder(order);
    showModal();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <div className="w-[60%] mx-auto mb-[100px]">
      {lstCompleted.map((order) => (
        <div key={order.id} className="p-[15px] shadow my-[30px] order-item">
          <div className="text-right text-blue-500 font-semibold mb-[10px] border-b-gray-200 border-b-[1px]">
            {order?.status}
          </div>
          {order?.items?.map((item) => (
            <div key={item?.productId?._id}>
              <div className="flex">
                <img
                  src={item?.productId?.imageUrl}
                  className="w-[80px] h-[80px] object-contain mr-[30px]"
                  alt=""
                />
                <div>
                  <h2>{item?.productId?.name}</h2>
                  <p>x {item?.quantity}</p>
                </div>
                <div className="ml-auto">
                  <p>Price: 
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item?.unitPrice)}
                  </p>
                </div>
              </div>
              <hr className="my-[10px]" />
            </div>
          ))}
          <div className="text-right">
            <p className="mb-[15px]">
              Total Price:{" "}
              <span
                onClick={() => handleClick(order)}
                className="text-blue-700 cursor-pointer"
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order?.totalAmount)}
              </span>
            </p>
            <span
              className="font-semibold cursor-pointer hover:text-blue-500 transition-all ease-in-out duration-300"
              onClick={() => handleClick(order)}
            >
              Receipt
            </span>
          </div>
          <div className="mt-[15px] text-right">
            <p className="text-green-600 font-semibold">
              Order Completed on: {new Date(order?.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
      <Modal
        title="Order Receipt"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedOrder && (
          <ReceiptComponent selectedOrder={selectedOrder} />
        )}
      </Modal>
    </div>
  );
};

export default OrderCompleted;