import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { usePostOrder } from "../../../hooks/order/usePostOrder";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constant";
import * as Yup from 'yup';

const FormCheckout = ({ totalItems, totalPrice }) => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const mutation = usePostOrder();
  const navigate = useNavigate();
  const [phoneError, setPhoneError] = useState("");

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required('Full name is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
    address: Yup.string()
      .required('Address is required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: "",
      phoneNumber: userLogin?.phoneNumber || "",
      address: "",
    },
    validationSchema,
    onSubmit: (values) => {
      mutation.mutate(values, {
        onSuccess: (res) => {
          window.location.href = res?.data?.data?.shortLink;
        },
      });
    },
  });

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
      if (window.location.href.includes("payment")) {
        navigate(PATH.HISTORY_ORDER);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  return (
    <div className="bg-white p-[20px] rounded-lg shadow-sm">
      <h2 className="text-lg font-bold mb-[10px]">Delivery Address</h2>
      <Form
        layout="vertical"
        className="bg-gray-250 p-4"
        onSubmitCapture={formik.handleSubmit}
      >
        <div className="flex justify-between">
          <Form.Item 
            label="Full Name" 
            className="w-[48%]"
            validateStatus={formik.touched.fullName && formik.errors.fullName ? "error" : ""}
            help={formik.touched.fullName && formik.errors.fullName}
          >
            <Input
              name="fullName"
              placeholder="Enter your full name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded"
            />
          </Form.Item>
          <Form.Item 
            label="Phone Number" 
            className="w-[48%]"
            validateStatus={(formik.touched.phoneNumber && formik.errors.phoneNumber) || phoneError ? "error" : ""}
            help={formik.touched.phoneNumber && (formik.errors.phoneNumber || phoneError)}
          >
            <Input
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formik.values.phoneNumber}
              onChange={handlePhoneNumberChange}
              onBlur={formik.handleBlur}
              maxLength={10}
              className="border rounded"
            />
          </Form.Item>
        </div>
        <Form.Item 
          label="Full Address"
          validateStatus={formik.touched.address && formik.errors.address ? "error" : ""}
          help={formik.touched.address && formik.errors.address}
        >
          <Input
            name="address"
            placeholder="Enter your full address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="border rounded"
          />
        </Form.Item>
        <div className="flex justify-between items-center mt-4">
          <span className="font-semibold">
            Total: <span className="text-orange-500">{totalItems}</span> items
          </span>
          <span className="font-semibold">
            Total Price:{" "}
            <span className="text-orange-500">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalPrice)}
            </span>
          </span>
        </div>
        <div className="text-right mt-[15px]">
          <Button
            className={`w-40 h-auto min-h-[2.5rem] py-1 px-4 rounded-lg font-bold text-md transition-all duration-300 ${
              mutation.isPending || !formik.isValid || formik.isSubmitting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
            loading={mutation.isPending}
            htmlType="submit"
            onClick={() => {
              if (!formik.isValid) {
                // Touch all fields to show validation errors
                Object.keys(formik.values).forEach(field => {
                  formik.setFieldTouched(field, true);
                });
              }
            }}
          >
            {mutation.isPending ? "Processing..." : "PLACE ORDER"}
          </Button>
        </div>
      </Form>
    </div>
  );
};
  
export default FormCheckout;
