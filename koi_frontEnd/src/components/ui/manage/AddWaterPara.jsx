import React, { useState } from "react";
import { Button, Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { usePostWaterParameter } from "../../../hooks/koi/ usePostWaterParameter";
import { toast } from "react-toastify";

const AddWaterPara = ({ selectedPond }) => {
  const [isOpenModal, setIsOpenModal] = useState(true);
  const mutation = usePostWaterParameter()
  const handleChangeDatePicker = (date) => {
    if (date) {
      formik.setFieldValue("lastCleanedAt", date.format("YYYY-MM-DD"));
    } else {
      formik.setFieldValue("lastCleanedAt", null);
    }
  };
  const formik = useFormik({
    initialValues: {
      nitriteNO2: 0,
      nitrateNO3: 0,
      ammoniumNH4: 0,
      hardnessGH: 0,
      salt: 0,
      temperature: 0,
      carbonateHardnessKH: 0,
      co2: 0,
      totalChlorines: 0,
      amountFed: 0,
      pondId: selectedPond?.id || 0,
      lastCleanedAt: "2024-10-03",
      cleanedDayCount: 0,
      ph: 0,
    },
    onSubmit: (values) => {
      mutation.mutate({id: selectedPond?.id, payload: values},{
        onSuccess: () => {
            toast.success("Add Water Parameter Successfully !")
        }
      }
      )
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
            name="nitriteNO2"
            value={formik.values.nitriteNO2}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Nitrate NO3">
          <Input
            name="nitrateNO3"
            value={formik.values.nitrateNO3}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Ammonium NH4">
          <Input
            name="ammoniumNH4"
            value={formik.values.ammoniumNH4}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Hardness GH">
          <Input
            name="hardnessGH"
            value={formik.values.hardnessGH}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Salt">
          <Input
            name="salt"
            value={formik.values.salt}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Temperature">
          <Input
            name="temperature"
            value={formik.values.temperature}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Carbonate Hardness KH">
          <Input
            name="carbonateHardnessKH"
            value={formik.values.carbonateHardnessKH}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="CO2">
          <Input
            name="co2"
            value={formik.values.co2}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Total Chlorines">
          <Input
            name="totalChlorines"
            value={formik.values.totalChlorines}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Amount Fed">
          <Input
            name="amountFed"
            value={formik.values.amountFed}
            onChange={formik.handleChange}
          />
        </Form.Item>

        <Form.Item label="Pond ID">
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
          <Button type="primary" htmlType="submit">
            Add New
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddWaterPara;
