import React from "react";
import { useFormik } from "formik";
import { Button, Form, Input, InputNumber, Radio, Modal } from "antd";
import { toast } from "react-toastify";
import { useAddPackage } from "../../../../hooks/admin/managePackages/useAddPackage";

const AddPackage = ({ visible, onCancel, onSuccess, nextId }) => {
  const mutation = useAddPackage();

  const formik = useFormik({
    initialValues: {
      name: "",
      fishSlots: 0,
      pondSlots: 0,
      price: 0,
      isDefault: false,
    },
    onSubmit: (values) => {
      const packageData = {
        id: nextId,
        ...values,
      };

      mutation.mutate(packageData, {
        onSuccess: () => {
          toast.success("Package added successfully!");
          onSuccess();
          formik.resetForm();
        },
        onError: (error) => {
          toast.error(`Error adding package: ${error.message}`);
        },
      });
    },
  });

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
    >
      <h1 className="text-xl font-bold mb-4">Add New Package</h1>
      <Form
        layout="horizontal"
        onFinish={formik.handleSubmit}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        labelAlign="left"
      >
        <Form.Item label="Name">
          <Input
            onChange={formik.handleChange}
            name="name"
            value={formik.values.name}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Fish Slots">
          <InputNumber
            onChange={(value) => formik.setFieldValue("fishSlots", value)}
            value={formik.values.fishSlots}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Pond Slots">
          <InputNumber
            onChange={(value) => formik.setFieldValue("pondSlots", value)}
            value={formik.values.pondSlots}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Price">
          <InputNumber
            onChange={(value) => formik.setFieldValue("price", value)}
            value={formik.values.price}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Is Default">
          <Radio.Group
            name="isDefault"
            onChange={(e) => formik.setFieldValue("isDefault", e.target.value)}
            value={formik.values.isDefault}
          >
            <Radio value={true}>True</Radio>
            <Radio value={false}>False</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            loading={mutation.isPending}
            type="primary"
            htmlType="submit"
          >
            Add Package
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPackage;
