import React from "react";
import { Button, Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { usePostWaterParameter } from "../../../hooks/koi/ usePostWaterParameter";
import { toast } from "react-toastify";

const AddWaterPara = ({ selectedPond, onSuccess }) => {
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
      const payload = {
        ...values,
        amountFed: 0, // Always set amountFed to 0
      };
      mutation.mutate(
        { id: selectedPond?.id, payload },
        {
          onSuccess: () => {
            toast.success("Add Water Parameter Successfully !");
            onSuccess(); // Call the onSuccess callback
          },
        }
      );
    },
  });

  return (
    <div className="mt-[8px] w-full">
      <Form
        layout="vertical"
        style={{ width: "100%" }}
        onFinish={formik.handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Form.Item label="Nitrite NO2 (mg/L)">
              <Input
                name="nitriteNO2"
                value={formik.values.nitriteNO2}
                onChange={formik.handleChange}
              />
            </Form.Item>
            <Form.Item label="Nitrate NO3 (mg/L)">
              <Input
                name="nitrateNO3"
                value={formik.values.nitrateNO3}
                onChange={formik.handleChange}
              />
            </Form.Item>
            <Form.Item label="Ammonium NH4 (mg/L)">
              <Input
                name="ammoniumNH4"
                value={formik.values.ammoniumNH4}
                onChange={formik.handleChange}
              />
            </Form.Item>
            <Form.Item label="Hardness GH (ppm)">
              <Input
                name="hardnessGH"
                value={formik.values.hardnessGH}
                onChange={formik.handleChange}
              />
            </Form.Item>
            <Form.Item label="Salt (ppm)">
              <Input
                name="salt"
                value={formik.values.salt}
                onChange={formik.handleChange}
              />
            </Form.Item>
            <Form.Item label="Temperature (°C)">
              <Input
                name="temperature"
                value={formik.values.temperature}
                onChange={formik.handleChange}
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item label="Carbonate Hardness KH (ppm)">
              <Input
                name="carbonateHardnessKH"
                value={formik.values.carbonateHardnessKH}
                onChange={formik.handleChange}
              />
            </Form.Item>
            <Form.Item label="CO2 (ppm)">
              <Input
                name="co2"
                value={formik.values.co2}
                onChange={formik.handleChange}
              />
            </Form.Item>
            <Form.Item label="Total Chlorines (ppm)">
              <Input
                name="totalChlorines"
                value={formik.values.totalChlorines}
                onChange={formik.handleChange}
              />
            </Form.Item>
            <Form.Item label="Last Cleaned At">
              <DatePicker
                name="lastCleanedAt"
                value={formik.values.lastCleanedAt ? dayjs(formik.values.lastCleanedAt) : null}
                onChange={handleChangeDatePicker}
              />
            </Form.Item>
            <Form.Item label="Cleaned Day Count">
              <Input
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
          </div>
        </div>
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
