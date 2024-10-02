import React from "react";
import { Form, Input, Button, Table } from "antd";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { usePostOrder } from "../../../hooks/order/usePostOrder";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FormCheckout = ({ totalItems }) => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  console.log(totalItems);
  const mutation = usePostOrder();
  const navigate = useNavigate()
  console.log(window.location.href)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: "",
      phoneNumber: userLogin?.phoneNumber || "",
      address: "",
    },
    onSubmit: (values) => {
      console.log(values);
      mutation.mutate(values, {
        onSuccess: (res) => {
          
          console.log(res?.data?.data)
            window.location.href = res?.data?.data?.shortLink   
        }
      })
    },
  });
  return (
    <div>
      <h2 className="text-lg font-bold">Delivery Address</h2>
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
          <Button className="!bg-black text-white hover:!bg-black hover:!text-white p-4" loading={mutation.isPending} htmlType="submit">
            PLACE ORDER
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormCheckout;
