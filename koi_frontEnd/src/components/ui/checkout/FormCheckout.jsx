import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { usePostOrder } from "../../../hooks/order/usePostOrder";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constant";

const FormCheckout = ({ totalItems, totalPrice }) => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const mutation = usePostOrder();
  const navigate = useNavigate();
  const [phoneError, setPhoneError] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: "",
      phoneNumber: userLogin?.phoneNumber || "",
      address: "",
    },
    onSubmit: (values) => {
      mutation.mutate(values, {
        onSuccess: (res) => {
          window.location.href = res?.data?.data?.shortLink;
        },
      });
    },
  });

  // Handle phone number input
  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setPhoneError("");
      formik.handleChange(e);
    } else {
      setPhoneError("Please enter numbers only");
    }
  };

  React.useEffect(() => {
    const handlePopState = () => {
      // Kiểm tra nếu đang ở trang thanh toán của MoMo
      if (window.location.href.includes("payment")) {
        navigate(PATH.HISTORY_ORDER); // Điều hướng đến trang History
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  return (
    <div className="bg-gray-200">
      <h2 className="text-lg font-bold mb-[30px]">Delivery Address</h2>
      <Form
        layout="vertical"
        className="mb-4 bg-gray-250 p-4 border rounded-lg shadow-md"
        onSubmitCapture={formik.handleSubmit}
      >
        <div className="flex justify-between">
          <Form.Item label="Full Name" className="w-[48%]">
            <Input
              name="fullName"
              placeholder="Enter your full name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              className="border rounded"
            />
          </Form.Item>
          <Form.Item 
            label="Phone Number" 
            className="w-[48%]"
            validateStatus={phoneError ? "error" : ""}
            help={phoneError}
          >
            <Input
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formik.values.phoneNumber}
              onChange={handlePhoneNumberChange}
              maxLength={11}
              className="border rounded"
            />
          </Form.Item>
        </div>
        <Form.Item label="Full Address">
          <Input
            name="address"
            placeholder="Enter your full address"
            value={formik.values.address}
            onChange={formik.handleChange}
            className="border rounded"
          />
        </Form.Item>
        <div className="flex justify-between items-center mt-4">
          <span className="font-semibold">Total: <span className="text-orange-500">{totalItems}</span> items</span>
          <span className="font-semibold">Total Price: <span className="text-orange-500">{totalPrice} VND</span></span>
        </div>
        <div className="text-right mt-[15px]">
          <Button
            className="!bg-black text-white hover:!bg-black hover:!text-white p-4 rounded"
            loading={mutation.isPending}
            htmlType="submit"
          >
            PLACE ORDER
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormCheckout;
