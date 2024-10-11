import React, { useState } from "react";
import { Spin } from "antd";
import { Button, Modal } from "antd";
import ReceiptComponent from "../checkout/ReceiptComponent";

const OrderPaid = ({ lstPaid, isFetching }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleClick = (order) => {
    setSelectedOrder(order);
    showModal(); // Mở modal ngay khi chọn order
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
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <div className="w-[60%] mx-auto mb-[100px]">
      {lstPaid.map((order) => (
        <div key={order.id} className="p-[15px] shadow my-[30px] order-item">
          <div className="text-right text-orange-500 font-semibold mb-[10px] border-b-gray-200 border-b-[1px]">
            {order?.status}
          </div>
          {order?.items?.map((item) => (
            <div key={item?.productId?._id}>
              <div className="flex">
                <img
                  src={item?.productId?.imageUrl}
                  className="w-[80px] h-[80px] object-contain mr-[30px]"
                  alt={item?.productId?.name}
                />
                <div>
                  <h2>{item?.productId?.name}</h2>
                  <p>x {item?.quantity}</p>
                </div>
                <div className="ml-auto">
                  <p>Price: ${item?.productId?.price}</p>
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
                className="text-orange-700 cursor-pointer"
              >
                ${order?.totalAmount}
              </span>
            </p>
            <span
              className="font-semibold cursor-pointer hover:text-orange-500 transition-all ease-in-out duration-300"
              onClick={() => handleClick(order)} // Gọi khi click vào Receipt
            >
              Receipt
            </span>
          </div>
        </div>
      ))}
      <Modal
        title="Order Receipt"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {/* Truyền selectedOrder vào ReceiptComponent */}
        {selectedOrder && (
          <ReceiptComponent selectedOrder={selectedOrder} />
        )}
      </Modal>
    </div>
  );
};

export default OrderPaid;
