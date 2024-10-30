import { useState, useEffect } from "react";
import { Modal, Form, DatePicker, InputNumber, Select, Button } from "antd";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useAddGrowth } from "../../../../hooks/koi/useAddGrowth";
const AddGrowthModal = ({
  fishId,
  isVisible,
  onClose,
  selectedPond,
  lstPond,
  refetchGrowthData,
}) => {
  const [form] = Form.useForm();
  const [isAddingGrowth, setIsAddingGrowth] = useState(false);

  const addGrowthMutation = useAddGrowth();
  useEffect(() => {
    if (form) {
      form.setFieldsValue({
        date: dayjs(),
        pondId: selectedPond,
        weight: 0,
        length: 0,
      });
    }
  }, [form, selectedPond]);

  const handleSubmit = async (values) => {
    if (!values) return;

    Modal.confirm({
      title: "Add Growth History",
      content: "Are you sure you want to add this growth history?",
      onOk: async () => {
        setIsAddingGrowth(true);
        try {
          const growthData = {
            date: values.date?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
            pondId: values.pondId || selectedPond,
            weight: values.weight || 0,
            length: values.length || 0,
          };

          const payload = {
            fishgrow: growthData
          };

          await addGrowthMutation.mutateAsync({ id: fishId, payload }, {
            onSuccess: () => {
              toast.success("Growth data added successfully");
              if (refetchGrowthData) refetchGrowthData();
              if (onClose) onClose();
              if (form) form.resetFields();
            },
          });
        } catch (error) {
          toast.error(`Error adding growth data: ${error?.message || 'Unknown error occurred'}`);
        } finally {
          setIsAddingGrowth(false);
        }
      },
    });
  };

  return (
    <Modal
      title="Add Growth History"
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          date: dayjs(),
          pondId: selectedPond,
          weight: 0,
          length: 0,
        }}
      >
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: "Please select a date" }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item
          name="pondId"
          label="Pond"
          rules={[{ required: true, message: "Please select a pond" }]}
        >
          <Select>
            {lstPond?.map((pond) => (
              <Select.Option key={pond.id} value={pond.id}>
                {pond.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="weight"
          label="Weight (kg)"
          rules={[{ required: true, message: "Please enter weight" }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item
          name="length"
          label="Length (cm)"
          rules={[{ required: true, message: "Please enter length" }]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isAddingGrowth}>
            Add Growth
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

AddGrowthModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedPond: PropTypes.number,
  lstPond: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  refetchGrowthData: PropTypes.func.isRequired,
  fishId: PropTypes.string.isRequired,
};

export default AddGrowthModal;