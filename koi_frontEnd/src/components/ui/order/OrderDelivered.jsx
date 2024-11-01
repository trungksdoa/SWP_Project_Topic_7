import React, { useEffect } from "react";
import { Spin, Button, message, Modal } from "antd";
import { manageOrderServices } from "../../../services/manageOderServices";

const OrderDelivered = ({
  lstDelivered,
  isFetching,
  refetch,
  switchToCompleteTab,
}) => {
  if (isFetching) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  const handleConfirmClick = (orderId) => {
    Modal.confirm({
      title: "Confirm Delivery",
      content: "Are you sure you want to confirm this delivery?",
      okText: "Yes",
      okType: "primary",
      cancelText: "No",
      centered: true,
      okButtonProps: {
        className: "bg-black border-black text-white hover:!bg-gray-800 hover:!border-gray-800"
      },
      onOk: async () => {
        try {
          const payload = { orderId };
          await manageOrderServices.receiveOrder(payload);
          
          await Promise.all([
            refetch(),
            new Promise(resolve => setTimeout(resolve, 500))
          ]);
          
          message.success("Order marked as completed");
          switchToCompleteTab();
        } catch (error) {
          console.error('Error completing order:', error);
          message.error('Failed to complete order. Please try again.');
        }
      },
    });
  };

  return (
    <div className="w-[60%] mx-auto mb-[100px]">
      {lstDelivered.map((order) => (
        <div key={order.id} className="p-[15px] shadow my-[30px] order-item">
          <div className="text-right text-green-500 font-semibold mb-[10px] border-b-gray-200 border-b-[1px]">
            {order?.status}
          </div>
          {order?.items?.map((item) => {
            return (
              <div key={item?.productId?._id}>
                <div className="flex ">
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
                    <p>
                      Price:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item?.unitPrice)}
                    </p>
                  </div>
                </div>
                <hr className="my-[10px]" />
              </div>
            );
          })}
          <div className="text-right">
            <p>
              Total Price:{" "}
              <span className="text-green-700">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order?.totalAmount)}
              </span>
            </p>
          </div>
          <div className="mt-[15px] text-right">
            <Button
              className="w-[150px] bg-black border-black border-[1px] text-white hover:!bg-black hover:!text-white ml-2"
              onClick={() => handleConfirmClick(order?.id)}
            >
              <strong>Confirm Delivery</strong>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderDelivered;
