import React, { useEffect, useRef, useState } from "react";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond.js";
import { useSelector } from "react-redux";
import {
  Button,
  Form,
  Input,
  DatePicker,
  Spin,
  Modal,
  Checkbox,
  message,
  Select,
} from "antd";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { manageWaterServices } from "../../../services/koifish/manageWaterServices.js";
import BreadcrumbComponent from "../BreadcrumbCoponent.jsx";
import AddWaterPara from "./AddWaterPara.jsx";
import Draggable from "react-draggable";
import { NavLink, useNavigate } from "react-router-dom";
import { PATH } from "../../../constant/config.js";
import StoreTemplate from "../../template/StoreTemplate.jsx";
import { useMutation } from "@tanstack/react-query";
import { useUpdateWaterParameter } from "../../../hooks/koi/useUpdateWaterParameter.js";
import { toast } from "react-toastify";
import { useGetWaterStandard } from "../../../hooks/koi/useGetWaterStandard.js";
import { useTranslation } from "react-i18next";
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi.js";

const WaterParameter = () => {
  const { t } = useTranslation();
  const [selectedPond, setSelectedPond] = useState(null); // Hồ được chọn
  const [showStore, setShowStore] = useState(false);
  const [waterParameters, setWaterParameters] = useState(null); // Thông số nước của hồ
  const [waterStandard, setWaterStandard] = useState(null); // Tiêu chuẩn nước của hồ
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [validationErrors, setValidationErrors] = useState([]); // Lưu lỗi validation
  const [isModalVisible, setIsModalVisible] = useState(false); // Hiển thị Modal
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const mutation = useUpdateWaterParameter();
  const draggleRef = useRef(null);
  const { data: lstKoi } = useGetAllKoi(userLogin?.id);
  const { data: waterStandards, refetchStandard } = useGetWaterStandard(
    selectedPond?.id
  );
  const [saltMessage, setSaltMessage] = useState(""); // Thêm state để lưu thông báo muối
  const handleGoToStore = () => {
    setShowStore(true);
  };

  const handleClickSalt = (value) => {
    let newError = "";
    if (value === "salt03") {
      newError = "Salt: must be equal to 5.18";
    } else if (value === "salt05") {
      newError = "Salt: must be equal to 8.64";
    } else if (value === "salt07") {
      newError = "Salt: must be equal to 12.1";
    }
    setError(newError);
  };

  const { data: lstPond, refetch } = useGetAllPond(userId); // Lấy danh sách hồ
  const handleChangeDatePicker = (date) => {
    if (date) {
      formik.setFieldValue("birthday", date.format("DD/MM/YYYY"));
    } else {
      formik.setFieldValue("birthday", null);
    }
  };
  const handleEditToggle = (e) => {
    setIsEditEnabled(e.target.checked);
  };
  // Fetch dữ liệu thông số nước và tiêu chuẩn nước khi chọn hồ

  useEffect(() => {
    const fetchWaterData = async () => {
      if (selectedPond) {
        try {
          setLoading(true);
          const waterParamsRes = await manageWaterServices.getWaterByPondId(
            selectedPond.id
          );
          const waterStandardRes = await manageWaterServices.getWaterStandard(
            selectedPond.id
          );

          setWaterParameters(waterParamsRes?.data?.data || null);
          setWaterStandard(waterStandardRes?.data?.data || null);
        } catch (error) {
          console.error("Error fetching water data:", error);
          setWaterParameters(null);
          setWaterStandard(null);
        } finally {
          setLoading(false);
        }
      } else {
        setWaterParameters(null);
        setWaterStandard(null);
        setLoading(false);
      }
    };

    fetchWaterData();
  }, [selectedPond, refetch, refetchStandard]);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancelModal = () => {
    setVisible(false);
  };

  // Hàm xử lý khi click vào hồ để hiển thị Modal
  const handleClick = (pond) => {
    setSelectedPond(pond);
    setIsModalVisible(true);
  };

  // Add this function to check if koi exists in the selected pond
  const checkKoiExistence = () => {
    if (!lstKoi || lstKoi.length === 0) {
      return (
        <div>
          <p className="mb-[10px]">
            Let add Koi in pond to calculate food and salt for this pond,
            <span className="text-orange-500">
              <NavLink to={PATH.KOI_MANAGEMENT}>Add Koi</NavLink>
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Modify the modal button click handler to show parameters that do not meet standards
  const handleShowParameters = () => {
    if (validationErrors.length > 0) {
      showModal();
    } else {
      message.info("All parameters meet the standards.");
    }
  };

  // Đóng Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Formik để xử lý form nhập liệu water parameters
  const formik = useFormik({
    initialValues: {
      nitriteNO2: 0,
      nitrateNO3: 0,
      ammoniumNH4: 0,
      hardnessGH: 0,
      salt: 0,
      temperature: 0,
      carbonateHardnessKH: 0,
      co2: 0,
      totalChlorines: 0,
      amountFed: 0,
      pondId: 0,
      lastCleanedAt: "2024-10-03",
      cleanedDayCount: 0,
      ph: 0,
      lastCleaned: false,
    },
    onSubmit: (values) => {
      console.log(values);
      mutation.mutate(
        { id: waterParameters?.pondId, payload: values },
        {
          onSuccess: () => {
            toast.success("Update Water Parameter Success !");
            refetch();
            refetchStandard();
          },
        }
      );
    },
  });

  // Cập nhật formik với dữ liệu waterParameters từ server
  useEffect(() => {
    if (waterParameters) {
      formik.setValues({
        nitriteNO2: waterParameters.nitriteNO2 || 0,
        nitrateNO3: waterParameters.nitrateNO3 || 0,
        ammoniumNH4: waterParameters.ammoniumNH4 || 0,
        hardnessGH: waterParameters.hardnessGH || 0,
        salt: waterParameters.salt || 0,
        temperature: waterParameters.temperature || 0,
        carbonateHardnessKH: waterParameters.carbonateHardnessKH || 0,
        co2: waterParameters.co2 || 0,
        totalChlorines: waterParameters.totalChlorines || 0,
        amountFed: waterParameters.amountFed || 0,
        pondId: waterParameters.pondId || 0,
        lastCleanedAt: waterParameters.lastCleanedAt || "2024-10-03",
        cleanedDayCount: waterParameters.cleanedDayCount || 0,
        ph: waterParameters.ph || 0,
      });
    }
  }, [waterParameters]);

  // Xử lý validation khi waterParameters vượt quá tiêu chuẩn
  useEffect(() => {
    if (waterParameters && waterStandard) {
      const errors = [];
      if (waterParameters.nitriteNO2 > waterStandard.no2Standard) {
        errors.push(
          `Nitrite NO2: must be less than or equal to ${waterStandard.no2Standard} mg/L`
        );
      }
      if (waterParameters.nitrateNO3 > waterStandard.no3Standard) {
        errors.push(
          `Nitrate NO3: must be less than or equal to ${waterStandard.no3Standard} mg/L`
        );
      }
      if (
        waterParameters.ammoniumNH4 < waterStandard.nh4StandardMin ||
        waterParameters.ammoniumNH4 > waterStandard.nh4Standard
      ) {
        errors.push(
          `Ammonium NH4: must be in the range from ${waterStandard.nh4StandardMin}mg/L to ${waterStandard.nh4Standard} mg/L`
        );
      }
      if (
        waterParameters.ph < waterStandard.phMin ||
        waterParameters.ph > waterStandard.phMax
      ) {
        errors.push(
          `pH: must be in the range from ${waterStandard.phMin} to ${waterStandard.phMax}`
        );
      }
      if (
        waterParameters.temperature < waterStandard.temperatureMin ||
        waterParameters.temperature > waterStandard.temperatureMax
      ) {
        errors.push(
          `Temperature: must be in the range from ${waterStandard.temperatureMin} C to ${waterStandard.temperatureMax} C `
        );
      }
      if (
        waterParameters.hardnessGH < waterStandard.generalHardnessGhMin ||
        waterParameters.hardnessGH > waterStandard.generalHardnessGhMax
      ) {
        errors.push(
          `Hardness GH: must be in the range from ${waterStandard.generalHardnessGhMin}ppm to ${waterStandard.generalHardnessGhMax}ppm`
        );
      }
      if (
        waterParameters.carbonateHardnessKH <
          waterStandard.carbonateHardnessKhMin ||
        waterParameters.carbonateHardnessKH >
          waterStandard.carbonateHardnessKhMax
      ) {
        errors.push(
          `Carbonate Hardness KH: must be in the range from ${waterStandard.carbonateHardnessKhMin}ppm to ${waterStandard.carbonateHardnessKhMax}ppm`
        );
      }
      if (
        waterParameters.co2 < waterStandard.oxygenMin ||
        waterParameters.co2 > waterStandard.oxygenMax
      ) {
        errors.push(
          `CO2: must be in the range from ${waterStandard.oxygenMin}mg/L to ${waterStandard.oxygenMax}mg/L`
        );
      }
      if (
        waterParameters.totalChlorines < waterStandard.chlorineMin ||
        waterParameters.totalChlorines > waterStandard.chlorineMax
      ) {
        errors.push(
          `Total Chlorines: must be in the range from ${waterStandard.chlorineMin}g to ${waterStandard.chlorineMax}g`
        );
      }
      if (waterParameters.amountFed != waterStandard.amountFedStandard) {
        errors.push(
          `Amount: Fed must be equal to ${waterStandard.amountFedStandard}g`
        );
      }
      setValidationErrors(errors);
    }
  }, [waterParameters, waterStandard]);

  // Render danh sách hồ
  if (!lstPond) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, { name: "Calculator" }]}
      />
      <div className="flex justify-center items-center text-bold text-3xl h-full m-8">
        <strong>Water Parameter</strong>
      </div>

      <div className="container grid grid-cols-4 gap-6 my-16">
        {lstPond.map((pond, index) => (
          <div key={index} className="text-center">
            <img
              onClick={() => handleClick(pond)}
              src={pond.imageUrl}
              alt={pond.name}
              className="w-[100%] max-h-[200px] mx-auto object-cover cursor-pointer"
            />
            <h3
              className="text-lg mt-2 cursor-pointer"
              onClick={() => handleClick(pond)}
            >
              {pond.name}
            </h3>
          </div>
        ))}
      </div>

      {/* Modal hiển thị thông tin water parameters */}
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="80%" // Increased width for better layout
        className="custom-modal" // Added custom class for styling
      >
        {loading ? (
          <Spin />
        ) : !waterParameters ||
          waterParameters === null ||
          Object.keys(waterParameters).length === 0 ? (
          <div className="flex justify-between">
            <div className="mr-6 basis-1/3">
              <img
                src={selectedPond?.imageUrl}
                alt={selectedPond?.name}
                className="w-full rounded-[8px] h-70 object-cover shadow-lg" // Added shadow for depth
              />
            </div>
            <div className="basis-2/3">
              <div className="font-bold text-[24px] text-center">
                No water parameters available
              </div>
              <AddWaterPara selectedPond={selectedPond} />
            </div>
          </div>
        ) : (
          <div className="">
            <div className="flex justify-around">
              <div className="mr-6">
                <img
                  src={selectedPond.imageUrl}
                  alt={selectedPond.name}
                  className="w-full rounded-[8px] h-70 object-cover shadow-lg" // Added shadow for depth
                />
              </div>
              <Form
                layout="vertical" // Changed layout to vertical for better readability
                style={{ width: "100%" }}
                onFinish={formik.handleSubmit}
              >
                <Form.Item className="text-bold" label="Edit Parameter">
                  <Checkbox onChange={handleEditToggle}></Checkbox>
                </Form.Item>

                {/* Form Items */}
                <Form.Item
                  label="Nitrite NO2"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <div className="flex items-center">
                    <Input
                      name="nitriteNO2"
                      value={formik.values.nitriteNO2 || ""} // Đảm bảo giá trị là chuỗi
                      onChange={formik.handleChange}
                      disabled={!isEditEnabled}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder={formik.values.nitriteNO2 ? "mg/L" : "mg/L"} // Hiển thị placeholder nếu không có giá trị
                    />
                    <span className="ml-2 text-gray-500">
                      {formik.values.nitriteNO2 ? "mg/L" : "mg/L"}
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="Nitrite NO2"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <div className="flex items-center">
                    <Input
                      name="nitriteNO2"
                      value={formik.values.nitriteNO2 || ""} // Đảm bảo giá trị là chuỗi
                      onChange={formik.handleChange}
                      disabled={!isEditEnabled}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder={formik.values.nitriteNO2 ? "mg/L" : "mg/L"} // Hiển thị placeholder nếu không có giá trị
                    />
                    <span className="ml-2 text-gray-500">
                      {formik.values.nitriteNO2 ? "mg/L" : "mg/L"}
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="Nitrate NO3"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <div className="flex items-center">
                    <Input
                      name="nitrateNO3"
                      value={formik.values.nitrateNO3 || ""} // Đảm bảo giá trị là chuỗi
                      onChange={formik.handleChange}
                      disabled={!isEditEnabled}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder={formik.values.nitrateNO3 ? "mg/L" : "mg/L"} // Hiển thị placeholder nếu không có giá trị
                    />
                    <span className="ml-2 text-gray-500">
                      {formik.values.nitrateNO3 ? "mg/L" : "mg/L"}
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="Ammonium NH4"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <div className="flex items-center">
                    <Input
                      name="ammoniumNH4"
                      value={formik.values.ammoniumNH4 || ""} // Đảm bảo giá trị là chuỗi
                      onChange={formik.handleChange}
                      disabled={!isEditEnabled}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder={formik.values.ammoniumNH4 ? "mg/L" : "mg/L"} // Hiển thị placeholder nếu không có giá trị
                    />
                    <span className="ml-2 text-gray-500">
                      {formik.values.ammoniumNH4 ? "mg/L" : "mg/L"}
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="Hardness GH"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <div className="flex items-center">
                    <Input
                      name="hardnessGH"
                      value={formik.values.hardnessGH || ""} // Đảm bảo giá trị là chuỗi
                      onChange={formik.handleChange}
                      disabled={!isEditEnabled}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder={formik.values.hardnessGH ? "ppm" : "ppm"} // Hiển thị placeholder nếu không có giá trị
                    />
                    <span className="ml-2 text-gray-500">
                      {formik.values.hardnessGH ? "ppm" : "ppm"}
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="Salt"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <div className="flex items-center">
                    <Input
                      name="salt"
                      value={formik.values.salt || ""} // Đảm bảo giá trị là chuỗi
                      onChange={formik.handleChange}
                      disabled={!isEditEnabled}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder={formik.values.salt ? "ppm" : "ppm"} // Hiển thị placeholder nếu không có giá trị
                    />
                    <span className="ml-2 text-gray-500">
                      {formik.values.salt ? "ppm" : "ppm"}
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="Temperature"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <div className="flex items-center">
                    <Input
                      name="temperature"
                      value={formik.values.temperature || ""} // Đảm bảo giá trị là chuỗi
                      onChange={formik.handleChange}
                      disabled={!isEditEnabled}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder={formik.values.temperature ? "°C" : "°C"} // Hiển thị placeholder nếu không có giá trị
                    />
                    <span className="ml-2 text-gray-500">
                      {formik.values.temperature ? "°C" : "°C"}
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="Carbonate Hardness KH"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <div className="flex items-center">
                    <Input
                      name="carbonateHardnessKH"
                      value={formik.values.carbonateHardnessKH || ""} // Đảm bảo giá trị là chuỗi
                      onChange={formik.handleChange}
                      disabled={!isEditEnabled}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder={
                        formik.values.carbonateHardnessKH ? "ppm" : "ppm"
                      } // Hiển thị placeholder nếu không có giá trị
                    />
                    <span className="ml-2 text-gray-500">
                      {formik.values.carbonateHardnessKH ? "ppm" : "ppm"}
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="CO2"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <div className="flex items-center">
                    <Input
                      name="co2"
                      value={formik.values.co2 || ""} // Đảm bảo giá trị là chuỗi
                      onChange={formik.handleChange}
                      disabled={!isEditEnabled}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder={formik.values.co2 ? "ppm" : "ppm"} // Hiển thị placeholder nếu không có giá trị
                    />
                    <span className="ml-2 text-gray-500">
                      {formik.values.co2 ? "ppm" : "ppm"}
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="Total Chlorines"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <div className="flex items-center">
                    <Input
                      name="totalChlorines"
                      value={formik.values.totalChlorines || ""} // Đảm bảo giá trị là chuỗi
                      onChange={formik.handleChange}
                      disabled={!isEditEnabled}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder={formik.values.totalChlorines ? "ppm" : "ppm"} // Hiển thị placeholder nếu không có giá trị
                    />
                    <span className="ml-2 text-gray-500">
                      {formik.values.totalChlorines ? "ppm" : "ppm"}
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="Amount Fed"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <div className="flex items-center">
                    <Input
                      name="amountFed"
                      value={formik.values.amountFed || ""} // Đảm bảo giá trị là chuỗi
                      onChange={formik.handleChange}
                      disabled={!isEditEnabled}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder={formik.values.amountFed ? "kg" : "kg"} // Hiển thị placeholder nếu không có giá trị
                    />
                    <span className="ml-2 text-gray-500">
                      {formik.values.amountFed ? "g" : "g"}
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="Last Cleaned At"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <Input
                    name="lastCleanedAt"
                    value={formik.values.lastCleanedAt}
                    onChange={formik.handleChange}
                    disabled={!isEditEnabled}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </Form.Item>
                <Form.Item
                  label="Cleaned Day Count"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <div className="flex items-center">
                    <Input
                      name="cleanedDayCount"
                      value={formik.values.cleanedDayCount || 0} // Đảm bảo giá trị là chuỗi
                      onChange={formik.handleChange}
                      disabled={!isEditEnabled}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder={
                        formik.values.cleanedDayCount ? "days" : "days"
                      } // Hiển thị placeholder nếu không có giá trị
                    />
                    <span className="ml-2 text-gray-500">
                      {formik.values.cleanedDayCount ? "days" : "days"}
                    </span>
                  </div>
                </Form.Item>
                <Form.Item
                  label="pH"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <Input
                    name="ph"
                    value={formik.values.ph}
                    onChange={formik.handleChange}
                    disabled={!isEditEnabled}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </Form.Item>
                <Form.Item
                  label="Last Cleaned"
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <Checkbox
                    name="lastCleaned"
                    checked={formik.values.lastCleaned}
                    onChange={(e) =>
                      formik.setFieldValue("lastCleaned", e.target.checked)
                    }
                    disabled={!isEditEnabled}
                  >
                    Mark as last cleaned
                  </Checkbox>
                </Form.Item>
                <Form.Item
                  style={{ display: isEditEnabled ? "block" : "none" }}
                >
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700 transition duration-200" // Updated button styling
                    type="primary"
                    disabled={!isEditEnabled}
                    htmlType="submit"
                    loading={mutation.isPending}
                  >
                    Update
                  </Button>
                </Form.Item>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700 transition duration-200" // Updated button styling
                  onClick={handleShowParameters}
                >
                  Show Parameters do not meet the standards.
                </Button>
                <Modal
                  title={
                    <div
                      style={{
                        width: "100%",
                        cursor: "move",
                      }}
                      onMouseOver={() => {
                        if (disabled) {
                          setDisabled(false);
                        }
                      }}
                      onMouseOut={() => {
                        setDisabled(true);
                      }}
                    >
                      Parameters do not meet the standards.
                    </div>
                  }
                  visible={visible}
                  onOk={handleOk}
                  onCancel={handleCancelModal}
                  modalRender={(modal) => (
                    <Draggable disabled={disabled} bounds={draggleRef.current}>
                      <div ref={draggleRef}>{modal}</div>
                    </Draggable>
                  )}
                >
                  <div
                    className="note-container"
                    style={{
                      padding: "20px",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      marginBottom: "20px",
                    }}
                  >
                    <h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>
                      Note: Choose the appropriate salt concentration for your
                      pond to calculate:
                    </h3>
                    <ul style={{ listStyleType: "none", padding: "0" }}>
                      <li
                        onClick={() => handleClickSalt("salt03")}
                        style={{
                          marginBottom: "10px",
                          padding: "10px",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <strong>Salt 03:</strong> The ideal salt concentration
                        for fish to thrive. If koi fish go through a high-stress
                        period, this salt concentration helps stabilize them.
                      </li>
                      <li
                        onClick={() => handleClickSalt("salt05")}
                        style={{
                          marginBottom: "10px",
                          padding: "10px",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <strong>Salt 05:</strong> The salt concentration helps
                        balance pressure when transferring fish from muddy river
                        ponds to clean water ponds and eliminates harmful
                        bacteria.
                      </li>
                      <li
                        onClick={() => handleClickSalt("salt07")}
                        style={{
                          marginBottom: "10px",
                          padding: "10px",
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <strong>Salt 07:</strong> The salt concentration will
                        help eliminate bacteria, fungi, and parasites, removing
                        pathogens that can harm the fish.
                      </li>
                    </ul>
                  </div>
                  {/* Add Select for salt options */}
                  <Form.Item label="Select Salt Standard">
                    <Select
                      defaultValue="salt" // Set default value
                      onChange={(value) => {
                        // Cập nhật thông báo tương ứng với giá trị muối
                        let newError = "";
                        if (value === "salt03") {
                          newError = "Salt: must be equal to 5.18g";
                        } else if (value === "salt05") {
                          newError = "Salt: must be equal to 8.64g";
                        } else if (value === "salt07") {
                          newError = "Salt: must be equal to 12.1g";
                        }

                        // Cập nhật lỗi validation
                        setValidationErrors((prevErrors) => {
                          // Lọc ra các lỗi không liên quan đến muối
                          const filteredErrors = prevErrors.filter(
                            (error) => !error.startsWith("Salt:")
                          );
                          return [...filteredErrors, newError]; // Thêm lỗi mới vào danh sách
                        });
                      }}
                    >
                      <Select.Option value="salt03">salt 03</Select.Option>
                      <Select.Option value="salt05">salt 05</Select.Option>
                      <Select.Option value="salt07">salt 07</Select.Option>
                    </Select>
                  </Form.Item>
                  {validationErrors.length > 0 && (
                    <div
                      style={{
                        padding: "10px",
                        background: "#fff6f6",
                        borderRadius: "8px",
                        border: "1px solid #ffa39e",
                        marginBottom: "16px",
                      }}
                    >
                      <ul
                        style={{
                          listStyleType: "none",
                          padding: "0",
                          margin: "0",
                        }}
                      >
                        {validationErrors.map((error, index) => (
                          <li
                            key={index}
                            style={{
                              color: "#ff4d4f",
                              fontSize: "14px",
                              marginBottom: "8px",
                              lineHeight: "1.5",
                              fontWeight: "bold",
                            }}
                          >
                            <span
                              style={{ fontWeight: "700", marginRight: "5px" }}
                            >
                              •
                            </span>{" "}
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {checkKoiExistence() && <div>{checkKoiExistence()}</div>}
                  <div>
                    <p>
                      Let to the store to check out products that can improve
                      your pond.{" "}
                    </p>
                    <Button
                      onClick={() => {
                        window.open(PATH.STORE, "_blank"); // Mở tab mới
                      }}
                      className="mt-[15px] bg-black text-white hover:!bg-black hover:!text-white hover:!border-none border-none"
                    >
                      Go To Store
                    </Button>
                  </div>
                </Modal>
              </Form>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WaterParameter;
