import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Card,
  Divider,
  Typography,
  InputNumber,
  DatePicker,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PictureOutlined,
  ArrowsAltOutlined,
  ColumnWidthOutlined,
  VerticalAlignBottomOutlined,
  AreaChartOutlined,
  UploadOutlined,
} from "@ant-design/icons";
const { Title, Text } = Typography;
import PropTypes from "prop-types";
import { manageKoiActions } from "../../../store/manageKoi/slice";
import { useUpdateKoi } from "../../../hooks/koi/useUpdateKoi";
import { useDeleteKoi } from "../../../hooks/koi/useDeleteKoi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import dayjs from "dayjs";
const FormKoiUpdate = ({
  koi,
  pond,
  refetchGrowthData,
  dispatch,
  userId,
  id,
  addKoiAge,
  onUpdated,
}) => {
  const formik = useFormik({
    initialValues: {
      name: koi?.data?.name || "",
      variety: koi?.data?.variety || "",
      sex: koi?.data?.sex ? "true" : "false",
      purchasePrice: koi?.data?.purchasePrice || 0,
      weight: koi?.data?.weight || 0,
      length: koi?.data?.length || 0,
      pondId: koi?.data?.pondId || null,
      dateOfBirth: koi?.data?.dateOfBirth ? dayjs(koi.data.dateOfBirth) : null,
      date: koi?.data?.date ? dayjs(koi.data.date) : dayjs(),
      imageUrl: koi?.data?.imageUrl || "",
    },
    onSubmit: async (values) => {
      Modal.confirm({
        title: "Update Koi",
        content: "Are you sure you want to update this koi?",
        onOk: async () => {
          const formData = new FormData();
          const updatedKoi = {
            name: values.name || "",
            variety: values.variety || "",
            sex: values.sex === "true",
            purchasePrice: parseFloat(values.purchasePrice) || 0,
            weight: parseFloat(values.weight) || 0,
            length: parseFloat(values.length) || 0,
            pondId: parseInt(values.pondId) || null,
            dateOfBirth: values.dateOfBirth
              ? values.dateOfBirth.format("YYYY-MM-DD")
              : null,
            userId: userId,
            date: values.date
              ? values.date.format("YYYY-MM-DD")
              : dayjs().format("YYYY-MM-DD"),
          };
          formData.append("fish", JSON.stringify(updatedKoi));
          formData.append("isNew", "true");
          if (values.image) {
            formData.append("image", values.image);
          }

          try {
            await updateKoiMutation.mutateAsync(
              { id: id, payload: formData },
              {
                onSuccess: (updatedKoi) => {
                  dispatch(manageKoiActions.updateKoi(updatedKoi));
                  toast.success("Koi updated successfully");
                  onUpdated(true);
                },
              }
            );
          } catch (error) {
            console.error("Error updating koi:", error);
            toast.error(`Error updating koi: ${error.message}`);
          }
        },
      });
    },
  });
  // State
  const [imgSrc, setImgSrc] = useState("");
  const [koiAge, setKoiAge] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Effect
  useEffect(() => {
    formik.setValues({
      name: koi.data.name || "",
      variety: koi.data.variety || "",
      sex: koi.data.sex ? "true" : "false",
      purchasePrice: koi.data.purchasePrice || 0,
      weight: koi.data.weight || 0,
      length: koi.data.length || 0,
      pondId: koi.data.pondId || null,
      dateOfBirth: koi.data.dateOfBirth ? dayjs(koi.data.dateOfBirth) : null,
      image: null,
      date: koi.data.date ? dayjs(koi.data.date) : dayjs(),
      imageUrl: koi.data.imageUrl || "",
    });

    setImgSrc(koi.data.imageUrl);
    calculateAge(koi.data.dateOfBirth);
  }, [koi]);

  // Hook
  const updateKoiMutation = useUpdateKoi();
  const deleteKoiMutation = useDeleteKoi();

  // Calculate age
  const calculateAge = (birthDate) => {
    if (birthDate) {
      const today = dayjs();
      const birthDyjs = dayjs(birthDate);
      const ageInMonths = today.diff(birthDyjs, "month");
      setKoiAge(ageInMonths);
      addKoiAge(ageInMonths);
    } else {
      setKoiAge(null);
    }
  };

  const formatAge = (ageInMonths) => {
    if (ageInMonths === null) return "Unknown";
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;

    const parts = [];
    if (years > 0) parts.push(`${years} year${years !== 1 ? "s" : ""}`);
    if (months > 0 || parts.length === 0)
      parts.push(`${months} month${months !== 1 ? "s" : ""}`);

    return parts.join(", ");
  };

  // Handle delete

  const handleDeleteClick = () => {
    Modal.confirm({
      title: "Delete Koi",
      content: "Are you sure you want to delete this koi?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        setIsDeleting(true);
        try {
          await deleteKoiMutation.mutateAsync(id);
          toast.success("Koi deleted successfully!");
          navigate("/koi-management");
        } catch (error) {
          toast.error(`Error deleting koi: ${error.message}`);
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  //Handle image

  const handleChangeFile = (e) => {
    const file = e.target.files?.[0];
    if (
      file &&
      [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ].includes(file.type)
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => setImgSrc(e.target?.result);
      formik.setFieldValue("image", file);
    }
  };

  console.log(updateKoiMutation.isPending);
  return (
    <Spin spinning={updateKoiMutation.isPending || isDeleting}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <div className="flex justify-center mb-6">
            <img
              src={imgSrc || koi?.imageUrl}
              alt={koi?.name || "Koi"}
              className="w-full max-w-md h-auto rounded-lg object-cover"
            />
          </div>
          {/* Upload Button */}
          <div className="w-full">
            <label
              htmlFor="koi-image"
              className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
            >
              <UploadOutlined className="text-lg" />
              <span>Click or drag image to upload</span>
              <input
                id="koi-image"
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                onChange={handleChangeFile}
                className="hidden"
              />
            </label>
            <Text className="mt-2 text-gray-500 text-sm text-center block">
              Supported formats: PNG, JPG, JPEG, GIF, WEBP
            </Text>
          </div>
        </Card>

        <Card className="shadow-lg">
          <Form layout="vertical" onFinish={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item label="Name">
                <Input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
              </Form.Item>

              <Form.Item label="Variety">
                <Input
                  name="variety"
                  value={formik.values.variety}
                  onChange={formik.handleChange}
                />
              </Form.Item>

              <Form.Item label="Sex">
                <Select
                  value={formik.values.sex}
                  onChange={(value) => formik.setFieldValue("sex", value)}
                >
                  <Select.Option value="true">Female</Select.Option>
                  <Select.Option value="false">Male</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Purchase Price (VND)">
                <InputNumber
                  name="purchasePrice"
                  min={0}
                  value={formik.values.purchasePrice}
                  onChange={(value) =>
                    formik.setFieldValue("purchasePrice", value)
                  }
                  className="w-full"
                />
              </Form.Item>

              <Form.Item label="Weight (kg)">
                <InputNumber
                  name="weight"
                  min={0}
                  value={formik.values.weight}
                  onChange={(value) => formik.setFieldValue("weight", value)}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item label="Length (cm)">
                <InputNumber
                  name="length"
                  min={0}
                  value={formik.values.length}
                  onChange={(value) => formik.setFieldValue("length", value)}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item label="Date of Birth">
                <DatePicker
                  value={formik.values.dateOfBirth}
                  onChange={(date) => {
                    formik.setFieldValue("dateOfBirth", date);
                    calculateAge(date);
                  }}
                  className="w-full"
                />
              </Form.Item>

              <Form.Item label="Age">
                <Input
                  value={formatAge(koiAge)}
                  readOnly
                  className="bg-gray-50"
                />
              </Form.Item>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                type="primary"
                htmlType="submit"
                icon={<EditOutlined />}
                loading={updateKoiMutation.isLoading}
                className="min-w-[120px]"
              >
                Update
              </Button>
              <Button
                onClick={() => {
                  Modal.confirm({
                    title: "Update without history",
                    content:
                      "Are you sure you want to update without update history?",
                    onOk: () => {
                      const formData = new FormData();
                      const updatedKoi = {
                        name: formik.values.name || "",
                        variety: formik.values.variety || "",
                        sex: formik.values.sex === "true",
                        purchasePrice:
                          parseFloat(formik.values.purchasePrice) || 0,
                        weight: parseFloat(formik.values.weight) || 0,
                        length: parseFloat(formik.values.length) || 0,
                        pondId: parseInt(formik.values.pondId) || null,
                        dateOfBirth: formik.values.dateOfBirth
                          ? formik.values.dateOfBirth.format("YYYY-MM-DD")
                          : null,
                        userId: userId,
                        date: formik.values.date
                          ? formik.values.date.format("YYYY-MM-DD")
                          : dayjs().format("YYYY-MM-DD"),
                      };
                      formData.append("fish", JSON.stringify(updatedKoi));
                      formData.append("isNew", "false");
                      if (formik.values.image) {
                        formData.append("image", formik.values.image);
                      }
                      updateKoiMutation.mutate(
                        { id: id, payload: formData },
                        {
                          onSuccess: (updatedKoi) => {
                            dispatch(manageKoiActions.updateKoi(updatedKoi));
                            toast.success("Koi updated successfully");
                            refetchGrowthData();
                          },
                        }
                      );
                    },
                  });
                }}
                icon={<EditOutlined />}
                loading={updateKoiMutation.isLoading}
                className="min-w-[120px] bg-green-500 text-white hover:bg-green-600"
              >
                Modified
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteClick}
                loading={isDeleting}
                className="min-w-[120px]"
              >
                Delete
              </Button>
            </div>

            <Divider />

            {pond && (
              <div className="mb-6">
                <Title level={4}>Current Pond</Title>
                <Card size="small" className="bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 relative">
                      {pond.imageUrl ? (
                        <img
                          src={pond.imageUrl}
                          alt={pond.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                          <PictureOutlined className="text-gray-400 text-2xl" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Title level={4} className="pond-name mb-2">
                        {pond.name}
                      </Title>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="flex items-center gap-2">
                          <ArrowsAltOutlined />
                          <Text>Length: {pond.length}m</Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <ColumnWidthOutlined />
                          <Text>Width: {pond.width}m</Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <VerticalAlignBottomOutlined />
                          <Text>Depth: {pond.depth}m</Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <AreaChartOutlined />
                          <Text>
                            Volume: {pond.length * pond.width * pond.depth}m³
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </Form>
        </Card>
      </div>
    </Spin>
  );
};

FormKoiUpdate.propTypes = {
  koi: PropTypes.object.isRequired,
  pond: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  refetchKoi: PropTypes.func.isRequired,
  refetchGrowthData: PropTypes.func.isRequired,
  onUpdated: PropTypes.func.isRequired,
  refetchPond: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  addKoiAge: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
};

export default FormKoiUpdate;
