import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { manageOrderServices } from "../../../services/manageOderServices";

const ReceiptComponent = ({ selectedOrder }) => {
  console.log(selectedOrder);
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  useEffect(() => {
    manageOrderServices.getOrderById(selectedOrder?.id);
  });

  return (
    <div>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold text-center mb-4">Receipt</h2>

          {/* Customer Information */}
          <div className="mb-4 pb-4">
            <h3 className="font-semibold mb-2">Customer Information:</h3>
            <p className="text-sm">{selectedOrder?.fullName}</p>
            <p className="text-sm">{selectedOrder?.address}</p>
            <p className="text-sm">{selectedOrder?.phoneNumber}</p>
          </div>

          <div className="border-t border-gray-300 pt-4">
            <div className="flex justify-between font-bold mb-2">
              <span>Item</span>
              <span>Price</span>
            </div>
            {selectedOrder?.items?.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>{item?.productId?.name}</span>
                <span>${item?.productId?.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-300 mt-4 pt-4">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${selectedOrder?.totalAmount}</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 px-6 py-4">
          <p className="text-xs text-center text-gray-600">
            Thank you for your purchase!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptComponent;
