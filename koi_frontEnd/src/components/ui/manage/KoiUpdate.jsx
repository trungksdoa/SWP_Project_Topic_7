import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import { Button, Form, Input, InputNumber, Select, DatePicker, Modal, Checkbox, Spin } from "antd";
import { toast } from "react-toastify";
import { useUpdateKoi } from "../../../hooks/koi/useUpdateKoi";
import { useDeleteKoi } from "../../../hooks/koi/useDeleteKoi";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond";
import { manageKoiActions } from "../../../store/manageKoi/slice";
import dayjs from "dayjs";
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi";
import { useGetGrowth } from "../../../hooks/koi/useGetGrowth";
import { useAddGrowth } from "../../../hooks/koi/useAddGrowth";
import { useQueryClient } from '@tanstack/react-query';
import KoiGrowthChart from './Chart';
import { useDeleteGrowth } from "../../../hooks/koi/useDeleteGrowth";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { LoadingOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal as AntModal } from 'antd';

const KoiUpdate = () => {
  const { id } = useParams();
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imgSrc, setImgSrc] = useState("");
  const [selectedPond, setSelectedPond] = useState(null);
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const { data: lstPond } = useGetAllPond(userId);
  const updateKoiMutation = useUpdateKoi();
  const deleteKoiMutation = useDeleteKoi();
  const addGrowthMutation = useAddGrowth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [koiAge, setKoiAge] = useState(null);
  const [showPondInfo, setShowPondInfo] = useState(false);
  const [selectedPondInfo, setSelectedPondInfo] = useState(null);
  const [currentDay, setCurrentDay] = useState(dayjs());
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { data: growthData, refetch: refetchGrowthData, isLoading, isError, error } = useGetGrowth(id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddingGrowth, setIsAddingGrowth] = useState(false);
  const [isGrowthListVisible, setIsGrowthListVisible] = useState(false);
  const [selectedGrowths, setSelectedGrowths] = useState([]);
  const deleteGrowthMutation = useDeleteGrowth();
  const [allGrowthSelected, setAllGrowthSelected] = useState(false);
  const [isLoadingGrowthList, setIsLoadingGrowthList] = useState(false);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);

  const koi = location.state?.koi;

  const { refetch: refetchAllKoi } = useGetAllKoi(userId);

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Slow Growth";
      case 2:
        return "Fast Growth";
      case 3:
        return "Normal Growth";
      case 4:
        return "Initial Measurement";
      case 5:
        return "Single Measurement";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    if (koi) {
      setImgSrc(koi.imageUrl);
      setSelectedPond(koi.pondId);
      calculateAge(koi.dateOfBirth);
      setCurrentDay(koi.date ? dayjs(koi.date) : dayjs());
      refetchAllKoi();
      refetchGrowthData();
    }
  }, [koi, refetchAllKoi, refetchGrowthData]);


  const calculateAge = (birthDate) => {
    if (birthDate) {
      const today = dayjs();
      const birthDayjs = dayjs(birthDate);
      const ageInMonths = today.diff(birthDayjs, 'month');
      setKoiAge(ageInMonths);
    } else {
      setKoiAge(null);
    }
  };

  const handleViewChart = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const formatAge = (ageInMonths) => {
    if (ageInMonths === null) return 'Unknown';
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;

    const parts = [];
    if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    if (months > 0 || parts.length === 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);

    return parts.join(', ');
  };

  const handleChangeFile = (e) => {
    let file = e.target.files?.[0];
    if (
      file &&
      ["image/jpeg", "image/jpg", "image/pn g", "image/gif", "image/webp"].includes(file.type)
    ) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setImgSrc(e.target?.result);
      };
      formik.setFieldValue("image", file);
    }
  };

  const formik = useFormik({
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
      const formData = new FormData();
      const updatedKoi = {
        name: values.name || "",
        variety: values.variety || "",
        sex: values.sex === "true",
        purchasePrice: parseFloat(values.purchasePrice) || 0,
        weight: parseFloat(values.weight) || 0,
        length: parseFloat(values.length) || 0,
        pondId: parseInt(values.pondId) || null,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
        userId: userId,
        date: values.date ? values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      };
      formData.append("fish", JSON.stringify(updatedKoi));
      if (values.image) {
        formData.append("image", values.image);
      }

      try {
        await updateKoiMutation.mutateAsync(
          { id: id, payload: formData, isNew: false },
          {
            onSuccess: (updatedKoi) => {
              dispatch(manageKoiActions.updateKoi(updatedKoi));
              toast.success("Koi updated successfully");
              refetchAllKoi();
            },
          }
        );
      } catch (error) {
        console.error("Error updating koi:", error);
        toast.error(`Error updating koi: ${error.message}`);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        }
      }
    },
  });

  const handleReturn = () => {
    navigate('/koi-management');
  };

  const handleDeleteClick = (koiId) => {
    Modal.confirm({
      title: 'Delete Koi',
      content: 'Are you sure you want to delete this koi?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
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
      navigate('/koi-management');
    } catch (error) {
      toast.error(`Error deleting koi: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const currentPond = lstPond?.find(pond => pond.id === selectedPond);

  const handlePondClick = (pond) => {
    if (pond.id === selectedPond) {
      setSelectedPondInfo(pond);
      setShowPondInfo(true);
    } else {
      formik.setFieldValue("pondId", pond.id);
      setSelectedPond(pond.id);
    }
  };

  const handleAddGrowth = async () => {
    setIsAddingGrowth(true);

    const formData = new FormData();
    const updatedKoi = {
      name: formik.values.name || "",
      variety: formik.values.variety || "",
      sex: formik.values.sex === "true",
      purchasePrice: parseFloat(formik.values.purchasePrice) || 0,
      weight: parseFloat(formik.values.weight) || 0,
      length: parseFloat(formik.values.length) || 0,
      pondId: parseInt(formik.values.pondId) || null,
      dateOfBirth: formik.values.dateOfBirth ? formik.values.dateOfBirth.format('YYYY-MM-DD') : null,
      userId: userId,
      date: formik.values.date ? formik.values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
    };

    formData.append("fish", JSON.stringify(updatedKoi));
    if (formik.values.image) {
      formData.append("image", formik.values.image);
    }

    try {
      await updateKoiMutation.mutateAsync(
        { id: id, payload: formData, isNew: true },
        {
          onSuccess: () => {
            toast.success("Growth data added successfully");
            queryClient.invalidateQueries(['growth', id]);
            queryClient.invalidateQueries(['allKoi', userId]);
          },
          onError: (error) => {
            console.error("Error adding growth data:", error);
            toast.error(`Error adding growth data: ${error.message}`);
          },
          onSettled: () => {
            setIsAddingGrowth(false);
          }
        }
      );
    } catch (error) {
      console.error("Error adding growth data:", error);
      toast.error(`Error adding growth data: ${error.message}`);
      setIsAddingGrowth(false);
    }
  };

  const showGrowthList = () => {
    setIsLoadingGrowthList(true);
    if (!growthData || growthData.length === 0) {
      toast.info("No growth data available. Please add growth history first.");
    } else {
      setIsGrowthListVisible(true);
    }
    setIsLoadingGrowthList(false);
  };

  const hideGrowthList = () => {
    setIsGrowthListVisible(false);
  };

  const handleSelectAllGrowth = (checked) => {
    setAllGrowthSelected(checked);
    if (checked) {
      setSelectedGrowths(growthData.map(growth => growth.id));
    } else {
      setSelectedGrowths([]);
    }
  };

  const handleCancelSelectGrowth = () => {
    setSelectedGrowths([]);
    setAllGrowthSelected(false);
  };

  const handleGrowthCheckboxChange = (growthId) => {
    setSelectedGrowths(prev => {
      const newSelection = prev.includes(growthId)
        ? prev.filter(id => id !== growthId)
        : [...prev, growthId];
      setAllGrowthSelected(newSelection.length === growthData.length);
      return newSelection;
    });
  };

  const handleDeleteSelectedGrowths = async () => {
    AntModal.confirm({
      title: 'Delete Growth History',
      content: `Are you sure you want to delete these growth history? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setIsDeletingMultiple(true);
        try {
          await deleteSelectedGrowths();
          hideGrowthList();
        } finally {
          setIsDeletingMultiple(false);
        }
      },
    });
  };

  const deleteSelectedGrowths = async () => {
    setIsDeletingMultiple(true);
    try {
      for (const growthId of selectedGrowths) {
        await deleteGrowthMutation.mutateAsync(growthId);
      }
      await refetchGrowthData();
      toast.success(`Successfully deleted ${selectedGrowths.length} growth history!`);
      setSelectedGrowths([]);
    } catch (error) {
      toast.error(`Error deleting growth entries: ${error.message}`);
    } finally {
      setIsDeletingMultiple(false);
    }
  };

  return (
    <div>
      <Button onClick={handleReturn} className="bg-gray-200 hover:bg-gray-300 m-4">
        Return
      </Button>
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
                onChange={(value) => formik.setFieldValue("purchasePrice", value)}
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
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </Form.Item>
            <Form.Item label="Date" className="mb-2">
              <DatePicker
                name="date"
                value={formik.values.date}
                onChange={(date) => {
                  formik.setFieldValue("date", date || dayjs());
                  setCurrentDay(date || dayjs());
                }}
                className="w-full"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
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
        <div className="flex justify-between items-center mx-4 my-6">
          <div className="flex">
            {/* You can add something here if needed, or leave it empty */}
          </div>
          <div className="flex justify-center items-center">
            <Form.Item className="flex justify-center">
              <Button
                type="primary"
                htmlType="submit"
                className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white rounded-full font-bold mr-2 text-xl"
                loading={updateKoiMutation.isLoading}
              >
                Update Koi
              </Button>
              <Button
                onClick={() => handleDeleteClick(id)}
                className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-red-500 text-white rounded-full font-bold text-xl mx-2"
                loading={isDeleting}
              >
                Delete Koi
              </Button>
              <Button
                className="w-40 h-auto min-h-[2.5rem] py-2 px-4 border-2 border-black rounded-full font-bold text-xl mx-2"
                onClick={handleViewChart}
              >
                View Chart
              </Button>
              <Button
                className="w-50 h-auto min-h-[2.5rem] py-2 px-4 border-2 border-black rounded-full font-bold text-xl ml-2"
                onClick={handleAddGrowth}
                loading={isAddingGrowth}
              >
                Add Growth History
              </Button>
            </Form.Item>
          </div>
          <div className="flex justify-end">
            <span 
              className="text-blue-500 underline cursor-pointer"
              onClick={showGrowthList}
            >
              Growth List
            </span>
          </div>
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
                    ? 'order-first bg-blue-100 border-2 border-blue-500' 
                    : 'filter grayscale hover:grayscale-0'
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
        koiAge={koiAge} // Add this line
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
      <Modal
        visible={isGrowthListVisible}
        onCancel={hideGrowthList}
        footer={[
          <Button key="close" onClick={hideGrowthList}>
            Close
          </Button>
        ]}
        width={700}
      >
        <div className="flex justify-between items-center mb-4 mr-6">
          <h2 className="text-2xl font-bold">Growth List</h2>
          <div className="flex items-center">
            <Checkbox
              onChange={(e) => handleSelectAllGrowth(e.target.checked)}
              checked={allGrowthSelected}
              className="mr-2"
            >
              Select All
            </Checkbox>
            <Button
              onClick={handleCancelSelectGrowth}
              disabled={selectedGrowths.length === 0 || isDeletingMultiple}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              danger
              onClick={handleDeleteSelectedGrowths}
              disabled={selectedGrowths.length === 0 || isDeletingMultiple}
              icon={isDeletingMultiple ? <LoadingOutlined /> : <DeleteOutlined />}
            >
              {isDeletingMultiple 
                ? `Deleting ${selectedGrowths.length} entries...` 
                : `Delete History (${selectedGrowths.length})`
              }
            </Button>
          </div>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {isLoadingGrowthList ? (
            <div className="flex justify-center items-center h-40">
              <Spin size="large" />
              <span className="ml-2">Loading growth data...</span>
            </div>
          ) : growthData && growthData.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {growthData.map((entry, index) => (
                <div key={index} className="border p-2 rounded-lg shadow text-sm relative">
                  <Checkbox
                    className="absolute top-2 right-2"
                    checked={selectedGrowths.includes(entry.id)}
                    onChange={() => handleGrowthCheckboxChange(entry.id)}
                  />
                  <p><strong>Date:</strong> {entry.date}</p>
                  <p><strong>Age:</strong> {entry.ageMonthHis} months</p>
                  <p><strong>Weight:</strong> {entry.weight} kg</p>
                  <p><strong>Length:</strong> {entry.length} cm</p>
                  <p><strong>Status:</strong> {getStatusText(entry.status)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No growth data available for this koi.</p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default KoiUpdate;
