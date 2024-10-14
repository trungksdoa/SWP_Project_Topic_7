import React, { useState } from "react";
import { Button, Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { usePostWaterParameter } from "../../../hooks/koi/ usePostWaterParameter";
import { toast } from "react-toastify";

const AddWaterPara = ({ selectedPond }) => {
  const [isOpenModal, setIsOpenModal] = useState(true);
  const mutation = usePostWaterParameter();
  const handleChangeDatePicker = (date) => {
    if (date) {
      formik.setFieldValue("lastCleanedAt", date.format("YYYY-MM-DD"));
    } else {
      formik.setFieldValue("lastCleanedAt", null);
    }
  };
  const formik = useFormik({
    initialValues: {
      nitriteNO2: "",
      nitrateNO3: "",
      ammoniumNH4: "",
      hardnessGH: "",
      salt: "",
      temperature: "",
      carbonateHardnessKH: "",
      co2: "",
      totalChlorines: "",
      amountFed: "",
      pondId: selectedPond?.id || 0,
      lastCleanedAt: "2024-10-03",
      cleanedDayCount: "",
      ph: "",
    },
    validate: (values) => {
      const errors = {};
      // Validate numeric fields
      const numericFields = [
        "nitriteNO2",
        "nitrateNO3",
        "ammoniumNH4",
        "hardnessGH",
        "salt",
        "temperature",
        "carbonateHardnessKH",
        "co2",
        "totalChlorines",
        "amountFed",
        "cleanedDayCount",
        "ph",
      ];
      numericFields.forEach((field) => {
        if (!values[field]) {
          // Check if the field is empty
          errors[field] = "Field cannot be empty"; // Error message for empty fields
        } else if (isNaN(values[field])) {
          // Check if the field is not a number
          errors[field] = "Must be a number"; // Error message for non-numeric values
        }
      });
      return errors;
    },
    onSubmit: (values) => {
      mutation.mutate(
        { id: selectedPond?.id, payload: values },
        {
          onSuccess: () => {
            toast.success("Add Water Parameter Successfully !");
          },
        }
      );
    },
  });
  return (
    <div className="mt-[8px] w-full">
      <Button
        onClick={() => {
          setIsOpenModal(false);
        }}
        className="bg-black text-white hover:!bg-black hover:!text-white hover:!border-none border-none"
      >
        Add Water Parameter
      </Button>
      <Form
        className={`${isOpenModal ? "hidden" : ""} mt-[30px]`} // Thay đổi: Thêm lớp 'hidden' nếu isOpenModal là true
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        style={{ width: "100%" }}
        onFinish={formik.handleSubmit}
      >
        <Form.Item label="Nitrite NO2">
          <Input
            placeholder="mg/L"
            name="nitriteNO2"
            value={formik.values.nitriteNO2}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Nitrate NO3">
          <Input
            placeholder="mg/L"
            name="nitrateNO3"
            value={formik.values.nitrateNO3}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Ammonium NH4">
          <Input
            placeholder="mg/L"
            name="ammoniumNH4"
            value={formik.values.ammoniumNH4}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Hardness GH">
          <Input
            placeholder="ppm"
            name="hardnessGH"
            value={formik.values.hardnessGH}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Salt">
          <Input
            placeholder="g"
            name="salt"
            value={formik.values.salt}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Temperature">
          <Input
            placeholder="C"
            name="temperature"
            value={formik.values.temperature}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Carbonate Hardness KH">
          <Input
            placeholder="ppm"
            name="carbonateHardnessKH"
            value={formik.values.carbonateHardnessKH}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="O2">
          <Input
            placeholder="mg/L"
            name="co2"
            value={formik.values.co2}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Total Chlorines">
          <Input
            placeholder="g"
            name="totalChlorines"
            value={formik.values.totalChlorines}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Amount Fed">
          <Input
            placeholder="g"
            name="amountFed"
            value={formik.values.amountFed}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item className="hidden" label="Pond ID">
          <Input
            disabled
            name="pondId"
            value={formik.values.pondId}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Last Cleaned At">
          <DatePicker
            value={
              formik.values.lastCleanedAt
                ? dayjs(formik.values.lastCleanedAt, "YYYY-MM-DD")
                : null
            }
            format="YYYY-MM-DD"
            onChange={handleChangeDatePicker}
          />
        </Form.Item>

        <Form.Item label="Cleaned Day Count">
          <Input
            placeholder="day"
            name="cleanedDayCount"
            value={formik.values.cleanedDayCount}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="pH">
          <Input
            name="ph"
            value={formik.values.ph}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item>
          <Button
            className="bg-black text-white hover:!text-white hover:!bg-black"
            htmlType="submit"
            loading={mutation.isPending}
          >
            Add New
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddWaterPara;
