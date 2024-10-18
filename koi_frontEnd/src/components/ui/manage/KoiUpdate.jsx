import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import { Button, Form, Input, InputNumber, Select, DatePicker, Modal  } from "antd";
import { toast } from "react-toastify";
import { useUpdateKoi } from "../../../hooks/koi/useUpdateKoi";
import { useDeleteKoi } from "../../../hooks/koi/useDeleteKoi";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond";
import { manageKoiActions } from "../../../store/manageKoi/slice";
import dayjs from "dayjs";
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [koiAge, setKoiAge] = useState(null);
  const [showPondInfo, setShowPondInfo] = useState(false);
  const [selectedPondInfo, setSelectedPondInfo] = useState(null);

  const koi = location.state?.koi;

  const { refetch } = useGetAllKoi(userId);

  useEffect(() => {
    if (koi) {
      setImgSrc(koi.imageUrl);
      setSelectedPond(koi.pondId);
      calculateAge(koi.dateOfBirth);
    }
    refetch();
  }, [koi, refetch]);

  const calculateAge = (birthDate) => {
    if (birthDate) {
      const today = dayjs();
      const birthDayjs = dayjs(birthDate);
      const ageInDays = today.diff(birthDayjs, 'day');
      setKoiAge(ageInDays);
    } else {
      setKoiAge(null);
    }
  };

  const formatAge = (ageInDays) => {
    if (ageInDays === null) return 'Unknown';
    const years = Math.floor(ageInDays / 365);
    const months = Math.floor((ageInDays % 365) / 30);
    const days = ageInDays % 30;

    const parts = [];
    if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
    if (days > 0 || parts.length === 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);

    return parts.join(', ');
  };

  const handleChangeFile = (e) => {
    let file = e.target.files?.[0];
    if (
      file &&
      ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"].includes(file.type)
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
    },
    onSubmit: (values) => {
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
      };
      formData.append("fish", JSON.stringify(updatedKoi));
      if (values.image) {
        formData.append("image", values.image);
      }
      updateKoiMutation.mutate(
        { id: id, payload: formData },
        {
          onSuccess: (updatedKoi) => {
            dispatch(manageKoiActions.updateKoi(updatedKoi));
            toast.success("Koi updated successfully");
            refetch();
          },
          onError: (error) => {
            console.error("Error updating koi:", error);
            toast.error(`Error updating koi: ${error.message}`);
          },
        }
      );
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

  return (
    <div>
      <Button onClick={handleReturn} className="bg-gray-200 hover:bg-gray-300 m-8">
        Return
      </Button>
      <div className="flex justify-center items-center text-bold text-3xl">
        <strong>Koi Information</strong>
      </div>
      
      <Form onFinish={formik.handleSubmit} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-8">
          <div className="flex justify-center items-start">
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
            <Form.Item label="Weight (grams)" className="mb-2">
              <InputNumber
                name="weight"
                min={0}
                value={formik.values.weight}
                onChange={(value) => formik.setFieldValue("weight", value)}
                className="w-full"
              />
            </Form.Item>
            <Form.Item label="Length (centimeters)" className="mb-2">
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
            <div className="mb-2">
              Age: {formatAge(koiAge)}
            </div>
            <Form.Item label="Image">
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                onChange={handleChangeFile}
              />
            </Form.Item>
          </div>
        </div>
        <Form.Item className="flex justify-center">
          <Button
            type="primary"
            htmlType="submit"
            className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white rounded-full font-bold mr-2 text-xl"
            loading={updateKoiMutation.isPending}
          >
            Update Koi
          </Button>
          <Button
            onClick={() => handleDeleteClick(id)}
            className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-red-500 text-white rounded-full font-bold ml-2 text-xl"
            loading={isDeleting}
          >
            Delete Koi
          </Button>
        </Form.Item>
        <div className="items-center space-x-4 mb-4 ml-8">
          <div className="flex items-center space-x-4 mb-4 ml-8 font-bold text-xl">
            Pond
          </div>
          <div className="flex items-center space-x-4 mb-4 ml-8 overflow-x-auto">
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
    </div>
  );
};

export default KoiUpdate;