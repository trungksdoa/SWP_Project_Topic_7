import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button, Form, Input, InputNumber, Radio, Modal, message } from "antd";
import { usePutPackage } from "../../../../hooks/admin/managePackages/usePutPackage";
import { managePackageServiceH } from "../../../../services/admin/managePackageServiceH";

const EditPackages = ({ visible, onCancel, packageId, onSuccess }) => {
  const [packages, setPackages] = useState(null);
  const mutation = usePutPackage();

  useEffect(() => {
    if (packageId) {
      managePackageServiceH
        .getPackageById(packageId)
        .then((res) => {
          setPackages(res?.data?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [packageId]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: packageId,
      name: packages?.name || "",
      fishSlots: packages?.fishSlots || "",
      pondSlots: packages?.pondSlots || "",
      price: packages?.price || "",
      isDefault: packages?.isDefault || false,
    },
    onSubmit: (values) => {
      mutation.mutate(
        { id: packageId, payload: values },
        {
          onSuccess: () => {
            message.success("Update Package Successfully!");
            onSuccess();
            onCancel();
          },
        }
      );
    },
  });

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
    >
      <h1 className="text-xl font-bold mb-4">Edit Package</h1>
      <Form
        layout="horizonta"
        onFinish={formik.handleSubmit}
        labelCol={{ span: 10 }} // Adjust label column span for layout
        wrapperCol={{ span: 10 }} // Adjust wrapper column span for layout
        labelAlign="left" // Align labels to the right
        
      >
        <Form.Item label="Name">
          <Input
            onChange={formik.handleChange}
            name="name"
            value={formik.values.name}
            style={{ width: '100%' }} // Ensure full width
          />
        </Form.Item>
        <Form.Item label="Fish Slots">
          <InputNumber
            onChange={(value) => formik.setFieldValue("fishSlots", value)}
            value={formik.values.fishSlots}
            style={{ width: '100%' }} // Ensure full width
          />
        </Form.Item>
        <Form.Item label="Pond Slots">
          <InputNumber
            onChange={(value) => formik.setFieldValue("pondSlots", value)}
            value={formik.values.pondSlots}
            style={{ width: '100%' }} // Ensure full width
          />
        </Form.Item>
        <Form.Item label="Price">
          <InputNumber
            onChange={(value) => formik.setFieldValue("price", value)}
            value={formik.values.price}
            style={{ width: '100%' }} // Ensure full width
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

        <Form.Item wrapperCol={{ offset: 8, span: 10 }}>
          <Button
            loading={mutation.isPending}
            type="primary"
            htmlType="submit"
          >
            Update Package
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPackages;