import React from "react";
import { Button, Form, Input, DatePicker, message } from "antd";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { usePostWaterParameter } from "../../../hooks/koi/ usePostWaterParameter";

const calculateDaysBetween = (date1) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const firstDate = new Date(date1);
  const secondDate = new Date();
  firstDate.setHours(0, 0, 0, 0);
  secondDate.setHours(0, 0, 0, 0);
  return Math.round((secondDate - firstDate) / oneDay);
};

const AddWaterPara = ({ selectedPond, onSuccess }) => {
  const mutation = usePostWaterParameter();
  const handleChangeDatePicker = (date) => {
    if (date) {
      const formattedDate = date.format("YYYY-MM-DD");
      const dayCount = calculateDaysBetween(formattedDate);
      formik.setFieldValue("lastCleanedAt", formattedDate);
      formik.setFieldValue("cleanedDayCount", dayCount);
    } else {
      const currentDate = dayjs().format("YYYY-MM-DD");
      formik.setFieldValue("lastCleanedAt", currentDate);
      formik.setFieldValue("cleanedDayCount", 0);
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
        "ph",
      ];
      numericFields.forEach((field) => {
        if (isNaN(values[field])) {
          // Check if the field is not a number
          errors[field] = "Must be a number";
        }
      });
      return errors;
    },
    onSubmit: (values) => {
      // Convert all string values to numbers
      const numericPayload = {
        nitriteNO2: Number(values.nitriteNO2),
        nitrateNO3: Number(values.nitrateNO3),
        ammoniumNH4: Number(values.ammoniumNH4),
        hardnessGH: Number(values.hardnessGH),
        salt: Number(values.salt),
        temperature: Number(values.temperature),
        carbonateHardnessKH: Number(values.carbonateHardnessKH),
        co2: Number(values.co2),
        totalChlorines: Number(values.totalChlorines),
        ph: Number(values.ph),
        amountFed: 0,
        pondId: selectedPond?.id
      };

      mutation.mutate(
        { id: selectedPond?.id, payload: numericPayload },
        {
          onSuccess: () => {
            message.success("Add Water Parameter Successfully!");
            onSuccess();
          },
          onError: (error) => {
            message.error(error.message || "Failed to add water parameter");
          },
        }
      );
    },
  });

  return (
    <div className="mt-[8px] w-full z-50 justify-center items-center">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedPond?.name || "Selected Pond"}
        </h2>
      </div>

      <Form
        layout="vertical"
        style={{ width: "100%" }}
        onFinish={formik.handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <Form.Item 
              label="Nitrite NO2 (mg/L)" 
              className="mb-2"
              validateStatus={formik.errors.nitriteNO2 ? "error" : ""}
              help={formik.errors.nitriteNO2}
            >
              <Input
                name="nitriteNO2"
                value={formik.values.nitriteNO2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
            <Form.Item 
              label="Nitrate NO3 (mg/L)" 
              className="mb-2"
              validateStatus={formik.errors.nitrateNO3 ? "error" : ""}
              help={formik.errors.nitrateNO3}
            >
              <Input
                name="nitrateNO3"
                value={formik.values.nitrateNO3}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
            <Form.Item 
              label="Ammonium NH4 (mg/L)" 
              className="mb-2"
              validateStatus={formik.errors.ammoniumNH4 ? "error" : ""}
              help={formik.errors.ammoniumNH4}
            >
              <Input
                name="ammoniumNH4"
                value={formik.values.ammoniumNH4}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
            <Form.Item 
              label="Hardness GH (ppm)" 
              className="mb-2"
              validateStatus={formik.errors.hardnessGH ? "error" : ""}
              help={formik.errors.hardnessGH}
            >
              <Input
                name="hardnessGH"
                value={formik.values.hardnessGH}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
            <Form.Item 
              label="Salt (ppm)" 
              className="mb-2"
              validateStatus={formik.errors.salt ? "error" : ""}
              help={formik.errors.salt}
            >
              <Input
                name="salt"
                value={formik.values.salt}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
            {/* <Form.Item 
              label="Temperature (°C)" 
              className="mb-2"
              validateStatus={formik.errors.temperature ? "error" : ""}
              help={formik.errors.temperature}
            >
              <Input
                name="temperature"
                value={formik.values.temperature}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item> */}
          </div>
          <div>
            <Form.Item 
              label="Carbonate Hardness KH (ppm)" 
              className="mb-2"
              validateStatus={formik.errors.carbonateHardnessKH ? "error" : ""}
              help={formik.errors.carbonateHardnessKH}
            >
              <Input
                name="carbonateHardnessKH"
                value={formik.values.carbonateHardnessKH}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
            <Form.Item 
              label="CO2 (ppm)" 
              className="mb-2"
              validateStatus={formik.errors.co2 ? "error" : ""}
              help={formik.errors.co2}
            >
              <Input
                name="co2"
                value={formik.values.co2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
            <Form.Item 
              label="Total Chlorines (ppm)" 
              className="mb-2"
              validateStatus={formik.errors.totalChlorines ? "error" : ""}
              help={formik.errors.totalChlorines}
            >
              <Input
                name="totalChlorines"
                value={formik.values.totalChlorines}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
            <Form.Item 
              label="Temperature (°C)" 
              className="mb-2"
              validateStatus={formik.errors.temperature ? "error" : ""}
              help={formik.errors.temperature}
            >
              <Input
                name="temperature"
                value={formik.values.temperature}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
            <Form.Item 
              label="pH" 
              className="mb-2"
              validateStatus={formik.errors.ph ? "error" : ""}
              help={formik.errors.ph}
            >
              <Input
                name="ph"
                value={formik.values.ph}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Form.Item>
            <Button
              className="bg-black text-white font-bold text-lg hover:!text-white hover:!bg-black"
              htmlType="submit"
              loading={mutation.isPending}
              disabled={Object.keys(formik.errors).length > 0}
            >
              Add New
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default AddWaterPara;
