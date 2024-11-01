import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Radio,
  Modal,
  Slider,
  Typography,
  Spin,
} from "antd";
import { toast } from "react-toastify";
import { usePutPackage } from "../../../../hooks/admin/managePackages/usePutPackage";
import { managePackageServiceH } from "../../../../services/admin/managePackageServiceH";
import { PropTypes } from "prop-types";

const { Text } = Typography;
const EditPackages = ({ visible, onCancel, packageId, onSuccess }) => {
  const [packages, setPackages] = useState(null);
  const mutation = usePutPackage();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (packageId) {
      setIsLoading(true);
      managePackageServiceH
        .getPackageById(packageId)
        .then((res) => {
          setPackages(res?.data?.data);
          setIsLoading(false);
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
    <Modal visible={visible} onCancel={onCancel} footer={null} width={500}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Spin size="large" />
          <span className="mt-4 text-gray-500">Updating package...</span>
        </div>
      ) : (
        <>
          <h1 className="text-xl font-bold mb-4">Edit Package</h1>
          <Form
            layout="horizonta"
            onFinish={formik.handleSubmit}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 10 }}
            labelAlign="left"
          >
            <Form.Item label="Name">
              <Input
                onChange={formik.handleChange}
                name="name"
                value={formik.values.name}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item label="Fish Slots">
              <div className="flex items-center gap-4">
                <Slider
                  onChange={(value) => formik.setFieldValue("fishSlots", value)}
                  value={formik.values.fishSlots}
                  min={1}
                  max={100}
                  style={{ flex: 1 }}
                />
                <Text className="min-w-[30px] text-right">
                  {formik.values.fishSlots}
                </Text>
              </div>
            </Form.Item>
            <Form.Item label="Pond Slots">
              <div className="flex items-center gap-4">
                <Slider
                  onChange={(value) => formik.setFieldValue("pondSlots", value)}
                  value={formik.values.pondSlots}
                  min={1}
                  max={100}
                  style={{ flex: 1 }}
                />
                <Text className="min-w-[30px] text-right">
                  {formik.values.pondSlots}
                </Text>
              </div>
            </Form.Item>
            <Form.Item label="Price">
              <InputNumber
                onChange={(value) => formik.setFieldValue("price", value)}
                value={formik.values.price}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item label="Is Default">
              <Radio.Group
                name="isDefault"
                onChange={(e) =>
                  formik.setFieldValue("isDefault", e.target.value)
                }
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
        </>
      )}
    </Modal>
  );
};

EditPackages.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  packageId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default EditPackages;
