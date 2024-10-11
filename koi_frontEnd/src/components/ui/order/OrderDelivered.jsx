import React from 'react';
import { Spin, Button, message } from 'antd';
import { manageOrderServices } from '../../../services/manageOderServices';

const OrderDelivered = ({ lstDelivered, isFetching, fetchOrders }) => {
  if (isFetching) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  const handleConfirmDelivery =  (orderId) => {
    try {
      manageOrderServices.receiveOrder(orderId);
      message.success('Order marked as completed');
      refetch();
    } catch (error) {
      console.error('Error completing order:', error);
      message.error('Failed to complete order');
    }
  }

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
                    <p>Price: ${item?.productId?.price} </p>
                  </div>
                </div>
                <hr className="my-[10px]" />
              </div>
            );
          })}
          <div className="text-right">
            <p>
              Total Price:{" "}
              <span className="text-green-700">${order?.totalAmount}</span>
            </p>
          </div>
          <div className="mt-[15px] text-right">
            <Button
              className="w-[150px] bg-black border-black border-[1px] text-white hover:!bg-black hover:!text-white ml-2"
              onClick={() => handleConfirmDelivery(order?.id)}
            >
              <strong>Confirm Delivery</strong>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderDelivered;