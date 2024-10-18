import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";
import { toast } from "react-toastify";
import { useAddKoi } from "../../../hooks/koi/useAddKoi";
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond";
import { manageKoiActions } from "../../../store/manageKoi/slice";
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";

const KoiAdd = () => {
  const [imgSrc, setImgSrc] = useState("");
  const [selectedPond, setSelectedPond] = useState(null);
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: lstPond } = useGetAllPond(userId);
  const addKoiMutation = useAddKoi();
  const { refetch: refetchKoiList } = useGetAllKoi(userId);

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

  const calculateAgeMonths = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const birthDate = dayjs(dateOfBirth);
    const currentDate = dayjs();
    const diffMonths = currentDate.diff(birthDate, 'month');
    return diffMonths;
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      variety: "",
      sex: true,
      purchasePrice: 0,
      weight: 0,
      length: 0,
      pondId: null,
      dateOfBirth: null,
      image: null,
    },
    onSubmit: (values) => {
      const formData = new FormData();
      const currentDate = dayjs();
      const ageMonth = calculateAgeMonths(values.dateOfBirth);

      const newKoi = {
        name: values.name || "",
        variety: values.variety || "",
        sex: values.sex === "true",
        purchasePrice: parseFloat(values.purchasePrice) || 0,
        weight: parseFloat(values.weight) || 0,
        length: parseFloat(values.length) || 0,
        pondId: parseInt(values.pondId) || null,
        dateOfBirth: values.dateOfBirth,
        userId: userId,
        date: currentDate.format('YYYY-MM-DD'),
        ageMonth: ageMonth,
      };
      formData.append("fish", JSON.stringify(newKoi));
      if (values.image) {
        formData.append("image", values.image);
      }
      addKoiMutation.mutate(formData, {
        onSuccess: (addedKoi) => {
          const newKoiWithImage = {
            ...addedKoi,
            imageUrl: imgSrc,
          };
          dispatch(manageKoiActions.addKoi(newKoiWithImage));
          toast.success("Koi added successfully");
          refetchKoiList();
          navigate('/koi-management');
        },
        onError: (error) => {
          console.error("Error adding koi:", error);
          toast.error(`Error adding koi: ${error.message}`);
        },
      });
    },
  });

  const handleReturn = () => {
    navigate('/koi-management');
  };

  return (
    <div> 
        <Button onClick={handleReturn} className="bg-gray-200 hover:bg-gray-300 m-8">
            Return
        </Button>
        <div className="flex justify-center items-center text-bold text-3xl ">
            <strong>Add a new Koi</strong>
        </div>
      
      <Form onFinish={formik.handleSubmit} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 m-8">
        <div className="flex justify-center items-start">
        <img
              src={imgSrc || "placeholder-image-url"} // You might want to add a placeholder image URL
              alt="Koi preview"
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
                <Select.Option value={true}>Female</Select.Option>
                <Select.Option value={false}>Male</Select.Option>
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
                value={formik.values.dateOfBirth ? dayjs(formik.values.dateOfBirth) : null}
                onChange={(date, dateString) => formik.setFieldValue("dateOfBirth", dateString)}
                className="w-full"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
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
        <Form.Item label="Pond" className="mb-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lstPond?.map((pond) => (
              <div
                key={pond.id}
                className={`text-center cursor-pointer rounded-xl ${
                  selectedPond === pond.id ? "border-4 border-blue-500" : ""
                }`}
                onClick={() => {
                  formik.setFieldValue("pondId", pond.id);
                  setSelectedPond(pond.id);
                }}
              >
                <img
                  src={pond.imageUrl}
                  alt={pond.name}
                  className="w-full h-32 object-cover rounded-md"
                />
                <p className="mt-2">{pond.name}</p>
              </div>
            ))}
          </div>
        </Form.Item>
        <Form.Item className="flex justify-center mt-6">
          <Button
            type="primary"
            htmlType="submit"
            className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white rounded-full font-bold mr-2 text-xl"
            loading={addKoiMutation.isPending}
          >
            Add Koi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default KoiAdd;
