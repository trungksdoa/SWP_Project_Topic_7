import React from 'react'
import { Spin } from 'antd';

const OrderCancel = ( { lstCancel, isFetching } ) => {
  if (isFetching) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }
  return (
    <div className="w-[60%] mx-auto mb-[100px]">
            {lstCancel.map((order) => (
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
              <span className="text-orange-700">${order?.totalAmount}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderCancel
