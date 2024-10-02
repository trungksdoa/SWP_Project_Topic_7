import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPackageById } from "../../../../hooks/admin/managePackages/useGetPackageById";
import { useFormik } from "formik";
import { Button, Form, Input, InputNumber, Radio } from "antd";
import { toast } from "react-toastify";
import { usePutPackage } from "../../../../hooks/admin/managePackages/usePutPackage";
import { PATH } from "../../../../constant";
import { managePackageServiceH } from "../../../../services/admin/managePackageServiceH";

const EditPackages = () => {
  const { id: packageId } = useParams();
  const parseId = parseInt(packageId);
  console.log(parseId);
  // const { data: packages } = useGetPackageById(parseId);
  const [packages, setPackages] = useState(null);
  const mutation = usePutPackage();
  const navigate = useNavigate();

  useEffect(() => {
    managePackageServiceH
      .getPackageById(parseId)
      .then((res) => {
        setPackages(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [parseId]);

  console.log(packages);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: parseId,
      name: packages?.name || "",
      fishSlots: packages?.fishSlots || "",
      pondSlots: packages?.pondSlots || "",
      price: packages?.price || "",
      isDefault: true,
    },
    onSubmit: (values) => {
      console.log(values);
      mutation.mutate(
        { id: parseId, payload: values },
        {
          onSuccess: () => {
            navigate(PATH.MANAGE_PACKAGE);
            toast.success("Update Package Successfully !");
            formik.resetForm();
          },
        }
      );
    },
  });

  return (
    <div>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        onSubmitCapture={formik.handleSubmit}
      >
        <Form.Item label="Name">
          <Input
            onChange={formik.handleChange}
            name="name"
            value={formik.values.name}
          />
        </Form.Item>
        <Form.Item label="fishSlots">
          <InputNumber
            onChange={(value) => formik.setFieldValue("fishSlots", value)}
            value={formik.values.fishSlots}
          />
        </Form.Item>
        <Form.Item label="pondSlots">
          <InputNumber
            onChange={(value) => formik.setFieldValue("pondSlots", value)}
            value={formik.values.pondSlots}
          />
        </Form.Item>
        <Form.Item label="price">
          <InputNumber
            onChange={(value) => formik.setFieldValue("price", value)}
            value={formik.values.price}
          />
        </Form.Item>
        <Form.Item label="isDefault">
          <Radio.Group
            name="isDefault"
            onChange={(e) => formik.setFieldValue("isDefault", e.target.value)}
            value={formik.values.isDefault}
          >
            <Radio value={true}>True</Radio>
            <Radio value={false}>False</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Action">
          <Button
            loading={mutation.isPending}
            style={{
              backgroundColor: "#90c63f",
              padding: "10px 0",
              width: 140,
            }}
            htmlType="submit"
          >
            Update Package
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditPackages;
