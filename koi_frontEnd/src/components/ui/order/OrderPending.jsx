import { Button, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDeleteOrder } from "../../../hooks/order/useDeleteOrder";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePostSendOrder } from "../../../hooks/order/usePostSendOrder";
import { PATH } from "../../../constant";

const OrderPending = ({ lstPending, refetch, switchToCancelledTab, isFetching }) => {
  const mutation = useDeleteOrder();
  const sendOrderMutation = usePostSendOrder();
  const [loadingId, setLoadingId] = useState(null); 
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const navigate = useNavigate();

  const handleCancel = (userId, orderId) => {
    setLoadingId(orderId);
    mutation.mutate(
      { userId, orderId }, 
      {
        onSuccess: () => {
          toast.success("Cancel Successfully!");
          setLoadingId(null);
          refetch();
          switchToCancelledTab();
        }
      }
    );
  };

 
  const handleContinueOrder = (orderId) => {
    navigate(PATH.CHECKOUT);
  }


  if (isFetching) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <div className="w-[60%] mx-auto mb-[100px]">
      {lstPending.map((order) => (
        <div key={order.id} className=" p-[15px] shadow my-[30px] order-item">
          <div className="text-right text-orange-500 font-semibold mb-[10px] border-b-gray-200 border-b-[1px]">
            {order?.status}
          </div>
          {order?.items?.map((item) => {
            return (
              <div>
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
            );
          })}
          <div className="text-right">
            <p>
              Total Price:{" "}
              <span className="text-orange-700">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order?.totalAmount)}
              </span>
            </p>
          </div>
          <div className="mt-[15px] text-right">
            <Button
              className="w-[120px] bg-red-500 border-none text-white hover:!bg-red-500 hover:!text-white mr-2"
              loading={mutation.isPending}
              onClick={() => {
               handleCancel(userLogin?.id, order?.id)
              }}
            >
              <strong>Cancel</strong>
            </Button>
            <Button
              className="w-[120px] bg-black border-black border-[1px] text-white hover:!bg-black hover:!text-white ml-2"
              onClick={() => {
                handleContinueOrder(order?.id)
              }}
            >
              <strong>Continue Order</strong>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderPending;
