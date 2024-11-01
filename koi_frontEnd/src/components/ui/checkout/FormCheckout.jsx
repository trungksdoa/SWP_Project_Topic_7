import React from "react";
import { Form, Input, Button, Table } from "antd";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { usePostOrder } from "../../../hooks/order/usePostOrder";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constant";

const FormCheckout = ({ totalItems, totalPrice }) => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const mutation = usePostOrder();
  const navigate = useNavigate();

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
    <div>
      <h2 className="text-lg font-bold mb-[30px]">Delivery Address</h2>
      <Form
        layout="vertical"
        className="mb-4"
        onSubmitCapture={formik.handleSubmit}
      >
        <div className="flex justify-between">
          <Form.Item label="Full Name" className="w-[48%]">
            <Input
              name="fullName"
              placeholder="Enter your full name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item label="Phone Number" className="w-[48%]">
            <Input
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
            />
          </Form.Item>
        </div>
        <Form.Item label="Full Address">
          <Input
            name="address"
            placeholder="Enter your full address"
            value={formik.values.address}
            onChange={formik.handleChange}
          />
        </Form.Item>
        <div className="flex justify-between items-center mt-4">
          <span>
            Total:{" "}
            <span className="text-orange-500 font-bold">{totalItems}</span>{" "}
            items
          </span>
          <span>
            Total Price:{" "}
            <span className="text-orange-500 font-bold">{totalPrice} VND</span>{" "}
          </span>
        </div>
       <div className="text-right mt-[15px]">
       <Button
          className="!bg-black text-white hover:!bg-black hover:!text-white p-4"
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
