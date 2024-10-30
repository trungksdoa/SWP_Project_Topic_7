import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Modal,
  Spin,
} from "antd";
import { toast } from "react-toastify";
import { useUpdateKoi } from "../../../hooks/koi/useUpdateKoi";
import { useDeleteKoi } from "../../../hooks/koi/useDeleteKoi";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond";
import { manageKoiActions } from "../../../store/manageKoi/slice";
import dayjs from "dayjs";
import { useGetKoiByKoiId } from "../../../hooks/koi/useGetKoiByKoiId";
import { useGetGrowth } from "../../../hooks/koi/useGetGrowth";

import KoiGrowthChart from "./Chart";
import AddGrowthModal from "./AddGrowthModal";
import GrowthListModal from "./GrowthListModal";

import {
  DeleteOutlined,
  LineChartOutlined,
  HistoryOutlined,
  EditOutlined,
} from "@ant-design/icons";

const KoiUpdate = () => {
  // Router hooks
  const { id } = useParams();
  const navigate = useNavigate();

  // Redux hooks
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;


  // API Query hooks
  const {
    data: koi,
    isLoading: isLoadingKoi,
    refetch: refetchKoi,
  } = useGetKoiByKoiId(id);

  const { data: lstPond } = useGetAllPond(userId);
  const {
    data: growthData,
    refetch: refetchGrowthData,
    isLoading,
    isError,
    error,
  } = useGetGrowth(id);

  // Mutation hooks
  const updateKoiMutation = useUpdateKoi();
  const deleteKoiMutation = useDeleteKoi();


  // UI State
  const [imgSrc, setImgSrc] = useState("");
  const [selectedPond, setSelectedPond] = useState(null);
  const [koiAge, setKoiAge] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddGrowthModalVisible, setIsAddGrowthModalVisible] = useState(false);
  const [isGrowthListVisible, setIsGrowthListVisible] = useState(false);

  // Pond related state
  const [showPondInfo, setShowPondInfo] = useState(false);
  const [selectedPondInfo, setSelectedPondInfo] = useState(null);

  // // Loading states
  const [isDeleting, setIsDeleting] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: koi?.name || "",
      variety: koi?.variety || "",
      sex: koi?.sex ? "true" : "false",
      purchasePrice: koi?.purchasePrice || 0,
      weight: koi?.weight || 0,
      length: koi?.length || 0,
      pondId: koi?.pondId || null,
      dateOfBirth: koi?.dateOfBirth ? dayjs(koi.dateOfBirth) : null,
      image: null,
      date: koi?.date ? dayjs(koi.date) : dayjs(),
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
                  refetchGrowthData();
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

  useEffect(() => {
    if (koi) {
      setImgSrc(koi.imageUrl);
      setSelectedPond(koi.pondId);
      calculateAge(koi.dateOfBirth);
      refetchGrowthData();
    }
  }, [koi, refetchKoi, refetchGrowthData]);

  if (isLoadingKoi) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const handleAddGrowth = (status) => {
    setIsAddGrowthModalVisible(status);
  };
  const calculateAge = (birthDate) => {
    if (birthDate) {
      const today = dayjs();
      const birthDyjs = dayjs(birthDate);
      const ageInMonths = today.diff(birthDyjs, "month");
      setKoiAge(ageInMonths);
    } else {
      setKoiAge(null);
    }
  };

  const handleViewChart = () => setIsModalVisible(true);

  const handleModalClose = () => setIsModalVisible(false);

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

  const handleReturn = () => navigate("/koi-management");

  const handleDeleteClick = (koiId) => {
    Modal.confirm({
      title: "Delete Koi",
      content: "Are you sure you want to delete this koi?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteKoi(koiId);
      },
    });
  };

  const deleteKoi = async (koiId) => {
    setIsDeleting(true);
    try {
      await deleteKoiMutation.mutateAsync(koiId);
      toast.success("Koi deleted successfully!");
      navigate("/koi-management");
    } catch (error) {
      toast.error(`Error deleting koi: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePondClick = (pond) => {
    if (pond.id === selectedPond) {
      setSelectedPondInfo(pond);
      setShowPondInfo(true);
    } else {
      formik.setFieldValue("pondId", pond.id);
      setSelectedPond(pond.id);
    }
  };

  const showGrowthList = async () => {
    if (!growthData || growthData.length === 0) {
      toast.info("No growth data available. Please add growth history first.");
    } else {
      setIsGrowthListVisible(true);
    }
  };

  const hideGrowthList = () => setIsGrowthListVisible(false);

  return (
    <div>
      <div className="flex justify-between items-center">
        <Button
          onClick={handleReturn}
          className="bg-gray-200 hover:bg-gray-300 m-4"
        >
          Return
        </Button>
        <div className="flex gap-2">
          <Button
            className="m-4 flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleViewChart}
            icon={<LineChartOutlined />}
          >
            View Chart
          </Button>
          <Button
            className="m-4 flex items-center gap-2 bg-green-500 text-white hover:bg-green-600"
            onClick={showGrowthList}
            icon={<HistoryOutlined />}
          >
            Growth List
          </Button>
        </div>
      </div>
      <div className="flex justify-center items-center text-bold text-3xl">
        <strong>Koi Information</strong>
      </div>

      <Form onFinish={formik.handleSubmit} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 m-8">
          <div className="flex justify-center items-center">
            <img
              src={imgSrc || koi?.imageUrl}
              alt={koi?.name || "Koi preview"}
              className="w-80 h-80 object-cover rounded-xl mb-4 mr-4"
            />
          </div>
          <div>
            <Form.Item label="Name" className="mb-2">
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="w-full"
              />
            </Form.Item>
            <Form.Item label="Variety" className="mb-2">
              <Input
                name="variety"
                value={formik.values.variety}
                onChange={formik.handleChange}
                className="w-full"
              />
            </Form.Item>
            <Form.Item label="Sex" className="mb-2">
              <Select
                name="sex"
                value={formik.values.sex}
                onChange={(value) => formik.setFieldValue("sex", value)}
                className="w-full"
              >
                <Select.Option value="true">Female</Select.Option>
                <Select.Option value="false">Male</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Purchase Price (VND)" className="mb-2">
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
            <Form.Item label="Weight (kg)" className="mb-2">
              <InputNumber
                name="weight"
                min={0}
                value={formik.values.weight}
                onChange={(value) => formik.setFieldValue("weight", value)}
                className="w-full"
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item label="Length (cm)" className="mb-2">
              <InputNumber
                name="length"
                min={0}
                value={formik.values.length}
                onChange={(value) => formik.setFieldValue("length", value)}
                className="w-full"
              />
            </Form.Item>
            <Form.Item label="Date of Birth" className="mb-2">
              <DatePicker
                name="dateOfBirth"
                value={formik.values.dateOfBirth}
                onChange={(date) => {
                  formik.setFieldValue("dateOfBirth", date);
                  calculateAge(date);
                }}
                className="w-full"
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Form.Item>
            <Form.Item label="Date" className="mb-2">
              <DatePicker
                name="date"
                value={formik.values.date}
                onChange={(date) => {
                  formik.setFieldValue("date", date || dayjs());
                }}
                className="w-full"
                disabledDate={(current) =>
                  current && current > dayjs().endOf("day")
                }
              />
            </Form.Item>
            <Form.Item label="Age" className="mb-2">
              <Input
                value={formatAge(koiAge)}
                readOnly
                className="w-full bg-gray-100"
              />
            </Form.Item>
            <Form.Item label="Image">
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                onChange={handleChangeFile}
              />
            </Form.Item>
          </div>
        </div>
        <div className="flex justify-center items-center mx-4 my-6">
          <Form.Item className="flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              className="w-auto h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white rounded-full font-bold mr-2 text-xl"
              loading={updateKoiMutation.isLoading}
            >
              <EditOutlined /> Update
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
              className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-green-500 text-white rounded-full font-bold text-xl mx-2"
            >
              <EditOutlined /> Modified
            </Button>
            <Button
              onClick={() => handleDeleteClick(id)}
              className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-red-500 text-white rounded-full font-bold text-xl mx-2"
              loading={isDeleting}
            >
              <DeleteOutlined /> Delete
            </Button>
          </Form.Item>
        </div>
        <div className="items-center space-x-4 mb-4 ml-8">
          <div className="flex items-center space-x-4 mb-4 ml-8 font-bold text-xl">
            Pond
          </div>
          <div className="flex items-center gap-8 mb-8 ml-8 overflow-x-auto">
            {lstPond?.map((pond) => (
              <div
                key={pond.id}
                className={`flex-shrink-0 w-48 text-center cursor-pointer rounded-xl transition-all duration-300 ${
                  pond.id === selectedPond
                    ? "order-first bg-blue-100 border-2 border-blue-500"
                    : "filter grayscale hover:grayscale-0"
                }`}
                onClick={() => handlePondClick(pond)}
              >
                <img
                  src={pond.imageUrl}
                  alt={pond.name}
                  className="w-full h-28 object-cover rounded-t-xl"
                />
                <p className="mt-1 text-sm p-2">{pond.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Form>

      <KoiGrowthChart
        isVisible={isModalVisible}
        onClose={handleModalClose}
        growthData={growthData}
        isLoading={isLoading}
        isError={isError}
        error={error}
        koiAge={koiAge}
      />

      <Modal
        title="Pond Information"
        visible={showPondInfo}
        onCancel={() => setShowPondInfo(false)}
        footer={null}
      >
        {selectedPondInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
            <div className="flex justify-center items-center">
              <img
                src={selectedPondInfo.imageUrl}
                alt={selectedPondInfo.name}
                className="w-full h-auto object-cover rounded mb-4"
              />
            </div>
            <div className="grid grid-cols-2 mb-2 items-center">
              <p className="font-bold text-left">Name:</p>
              <p className="text-right">{selectedPondInfo.name}</p>

              <p className="font-bold text-left">Length:</p>
              <p className="text-right">{selectedPondInfo.length} meters</p>

              <p className="font-bold text-left">Width:</p>
              <p className="text-right">{selectedPondInfo.width} meters</p>

              <p className="font-bold text-left">Depth:</p>
              <p className="text-right">{selectedPondInfo.depth} meters</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Growth List Modal */}
      <GrowthListModal
        growthData={growthData}
        isGrowthListVisible={isGrowthListVisible}
        hideGrowthList={hideGrowthList}
        isOpenAddGrowthModal={handleAddGrowth}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetchGrowthData={refetchGrowthData}
      />

      {/* Add Growth Modal */}

      <AddGrowthModal
        isVisible={isAddGrowthModalVisible}
        onClose={() => setIsAddGrowthModalVisible(false)}
        selectedPond={selectedPond}
        lstPond={lstPond}
        refetchGrowthData={refetchGrowthData}
        fishId={id}
      />
    </div>
  );
};

export default KoiUpdate;
