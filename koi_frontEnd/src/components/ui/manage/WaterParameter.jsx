  
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
import { NavLink, useNavigate } from "react-router-dom";
import { PATH } from "../../../constant/config.js";
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
  const [warningMessages, setWarningMessages] = useState([]); // Thêm state cho cảnh báo
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
  const { data: lstPond, refetch } = useGetAllPond(userId); // Lấy danh sách hồ
  const [saltMessage, setSaltMessage] = useState(""); // Thêm state để lưu thông báo muối
  const [isAddWaterParaModalVisible, setIsAddWaterParaModalVisible] =
    useState(false);
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
    if (validationErrors.length > 0 || warningMessages.length > 0) {
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

  // Xử lý validation và cảnh báo khi waterParameters vượt quá tiêu chuẩn
  useEffect(() => {
    if (waterParameters && waterStandard) {
      const errors = [];
      const warnings = [];

      // Nitrite NO2
      if (waterParameters.nitriteNO2 > waterStandard.no2Standard) {
        errors.push(`Nitrite NO2 is too high (${waterParameters.nitriteNO2} mg/L). Must be less than ${waterStandard.no2Standard} mg/L. This can be toxic to fish!`);
      } else if (waterParameters.nitriteNO2 > waterStandard.no2Standard * 0.8) {
        warnings.push(`Nitrite NO2 (${waterParameters.nitriteNO2} mg/L) is approaching dangerous levels. Consider water change.`);
      }

      // Nitrate NO3
      if (waterParameters.nitrateNO3 > waterStandard.no3Standard) {
        errors.push(`Nitrate NO3 is too high (${waterParameters.nitrateNO3} mg/L). Must be less than ${waterStandard.no3Standard} mg/L. High nitrates indicate poor water quality.`);
      } else if (waterParameters.nitrateNO3 > waterStandard.no3Standard * 0.8) {
        warnings.push(`Nitrate NO3 (${waterParameters.nitrateNO3} mg/L) is getting high. Plan a water change soon.`);
      }

      // Ammonium NH4
      if (waterParameters.ammoniumNH4 < waterStandard.nh4StandardMin || waterParameters.ammoniumNH4 > waterStandard.nh4Standard) {
        errors.push(`Ammonium NH4 (${waterParameters.ammoniumNH4} mg/L) is outside safe range (${waterStandard.nh4StandardMin} - ${waterStandard.nh4Standard} mg/L). This is highly toxic to fish!`);
      } else if (waterParameters.ammoniumNH4 > waterStandard.nh4Standard * 0.8) {
        warnings.push(`Ammonium NH4 levels (${waterParameters.ammoniumNH4} mg/L) are rising. Monitor closely.`);
      }

      // pH
      if (waterParameters.ph < waterStandard.phMin || waterParameters.ph > waterStandard.phMax) {
        errors.push(`pH (${waterParameters.ph}) is outside safe range (${waterStandard.phMin} - ${waterStandard.phMax}). This can stress fish!`);
      } else if (Math.abs(waterParameters.ph - 7) > 1) {
        warnings.push(`pH (${waterParameters.ph}) is deviating from neutral. Monitor for changes.`);
      }

      // Temperature
      if (waterParameters.temperature < waterStandard.temperatureMin || waterParameters.temperature > waterStandard.temperatureMax) {
        errors.push(`Temperature (${waterParameters.temperature}°C) is outside optimal range (${waterStandard.temperatureMin}°C - ${waterStandard.temperatureMax}°C). This affects fish metabolism!`);
      } else if (Math.abs(waterParameters.temperature - ((waterStandard.temperatureMax + waterStandard.temperatureMin)/2)) > 2) {
        warnings.push(`Temperature (${waterParameters.temperature}°C) is not ideal. Consider adjusting.`);
      }

      // Hardness GH
      if (waterParameters.hardnessGH < waterStandard.generalHardnessGhMin || waterParameters.hardnessGH > waterStandard.generalHardnessGhMax) {
        errors.push(`Hardness GH (${waterParameters.hardnessGH} ppm) is outside safe range (${waterStandard.generalHardnessGhMin} - ${waterStandard.generalHardnessGhMax} ppm). This affects osmoregulation!`);
      }

      // KH
      if (waterParameters.carbonateHardnessKH < waterStandard.carbonateHardnessKhMin || waterParameters.carbonateHardnessKH > waterStandard.carbonateHardnessKhMax) {
        errors.push(`Carbonate Hardness KH (${waterParameters.carbonateHardnessKH} ppm) is outside safe range (${waterStandard.carbonateHardnessKhMin} - ${waterStandard.carbonateHardnessKhMax} ppm). This affects pH stability!`);
      }

      // CO2
      if (waterParameters.co2 < waterStandard.oxygenMin || waterParameters.co2 > waterStandard.oxygenMax) {
        errors.push(`CO2 (${waterParameters.co2} mg/L) is outside safe range (${waterStandard.oxygenMin} - ${waterStandard.oxygenMax} mg/L). This affects breathing!`);
      }

      // Chlorine
      if (waterParameters.totalChlorines < waterStandard.chlorineMin || waterParameters.totalChlorines > waterStandard.chlorineMax) {
        errors.push(`Total Chlorines (${waterParameters.totalChlorines}g) is outside safe range (${waterStandard.chlorineMin} - ${waterStandard.chlorineMax}g). Chlorine is toxic to fish!`);
      }

      // Salt concentration analysis
      if (waterParameters.salt) {
        const saltPercentage = waterParameters.salt / 10000; // Convert to percentage
        if (saltPercentage === 0.3) {
          warnings.push("Salt concentration at 0.3% - Ideal for normal koi development and stress recovery");
        } else if (saltPercentage === 0.5) {
          warnings.push("Salt concentration at 0.5% - Good for balancing pressure when transferring koi and removing harmful bacteria");
        } else if (saltPercentage === 0.7) {
          warnings.push("Salt concentration at 0.7% - Effective for eliminating bacteria, fungi, and parasites");
        } else if (saltPercentage > 0.7) {
          errors.push(`Salt concentration too high (${saltPercentage}%). May stress fish!`);
        }
      }

      setValidationErrors(errors);
      setWarningMessages(warnings);
    }
  }, [waterParameters, waterStandard]);

  // Export water quality report
  const exportReport = () => {
    const reportContent = `Water Quality Analysis Report
${new Date().toLocaleString()}
-----------------------------------------

${selectedPond ? `Pond: ${selectedPond.name}` : ''}

CRITICAL ISSUES:
${validationErrors.map(error => `- ${error}`).join('\n')}

WARNINGS:
${warningMessages.map(warning => `- ${warning}`).join('\n')}

SALT CONCENTRATION GUIDE:
- 0.3%: Ideal for normal koi development and stress recovery
- 0.5%: Balances pressure when transferring koi and removes harmful bacteria
- 0.7%: Eliminates bacteria, fungi, and parasites

Current Parameters:
- NO2: ${waterParameters?.nitriteNO2} mg/L
- NO3: ${waterParameters?.nitrateNO3} mg/L
- NH4: ${waterParameters?.ammoniumNH4} mg/L
- pH: ${waterParameters?.ph}
- Temperature: ${waterParameters?.temperature}°C
- Salt: ${waterParameters?.salt / 10000}%
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'water-quality-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

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
              className="w-full h-48 object-cover cursor-pointer"
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
        width="80%"
        className="custom-modal"
      >
        {loading ? (
          <Spin />
        ) : !waterParameters ||
          waterParameters === null ||
          Object.keys(waterParameters).length === 0 ? (
          <div className="flex w-80%">
            {/* Left column: Image */}
            <div className="w-1/2 pr-4 flex items-start justify-center">
              <img
                src={selectedPond?.imageUrl}
                alt={selectedPond?.name}
                className="w-80 h-80 object-cover rounded-[8px] shadow-lg"
              />
            </div>

            {/* Right column: Content */}
            <div className="w-1/2 flex flex-col justify-center items-center">
              {/* First row: No water parameter and Add Water Parameter button */}
              <div className="text-center">
                <h2 className="font-bold text-[24px] mb-4">
                  No water parameters available
                </h2>
                <Button
                  onClick={() => {
                    setIsAddWaterParaModalVisible(true);
                    setIsModalVisible(false);
                  }}
                  className="bg-black text-white hover:!bg-black hover:!text-white hover:!border-none border-none"
                >
                  Add Water Parameter
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="">
            <div className="flex justify-around">
              <div className="mr-6 w-1/4 items-start">
                {" "}
                {/* Reduced width to 25% */}
                <img
                  src={selectedPond.imageUrl}
                  alt={selectedPond.name}
                  className="w-80 h-80 object-cover shadow-lg" // Reduced height to 48 (12rem)
                />
              </div>
              <Form
                layout="vertical"
                style={{ width: "60%" }}
                onFinish={formik.handleSubmit}
              >
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-semibold mr-4">
                    Edit Water Parameter
                  </h3>
                  <Form.Item className="mb-0">
                    <Checkbox onChange={handleEditToggle}></Checkbox>
                  </Form.Item>
                </div>

                {isEditEnabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Form.Item label="Nitrite NO2 (mg/L)" className="mb-2">
                        <Input
                          name="nitriteNO2"
                          value={formik.values.nitriteNO2}
                          onChange={formik.handleChange}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 w-3/4"
                        />
                      </Form.Item>
                      <Form.Item label="Nitrate NO3 (mg/L)" className="mb-2">
                        <Input
                          name="nitrateNO3"
                          value={formik.values.nitrateNO3}
                          onChange={formik.handleChange}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 w-3/4"
                        />
                      </Form.Item>
                      <Form.Item label="Ammonium NH4 (mg/L)" className="mb-2">
                        <Input
                          name="ammoniumNH4"
                          value={formik.values.ammoniumNH4}
                          onChange={formik.handleChange}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 w-3/4"
                        />
                      </Form.Item>
                      <Form.Item label="Hardness GH (ppm)" className="mb-2">
                        <Input
                          name="hardnessGH"
                          value={formik.values.hardnessGH}
                          onChange={formik.handleChange}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 w-3/4"
                        />
                      </Form.Item>
                      <Form.Item label="Salt (ppm)" className="mb-2">
                        <Input
                          name="salt"
                          value={formik.values.salt}
                          onChange={formik.handleChange}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 w-3/4"
                        />
                      </Form.Item>
                      <Form.Item label="Temperature (°C)" className="mb-2">
                        <Input
                          name="temperature"
                          value={formik.values.temperature}
                          onChange={formik.handleChange}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 w-3/4"
                        />
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item
                        label="Carbonate Hardness KH (ppm)"
                        className="mb-2"
                      >
                        <Input
                          name="carbonateHardnessKH"
                          value={formik.values.carbonateHardnessKH}
                          onChange={formik.handleChange}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 w-3/4"
                        />
                      </Form.Item>
                      <Form.Item label="CO2 (ppm)" className="mb-2">
                        <Input
                          name="co2"
                          value={formik.values.co2}
                          onChange={formik.handleChange}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 w-3/4"
                        />
                      </Form.Item>
                      <Form.Item label="Total Chlorines (ppm)" className="mb-2">
                        <Input
                          name="totalChlorines"
                          value={formik.values.totalChlorines}
                          onChange={formik.handleChange}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 w-3/4"
                        />
                      </Form.Item>
                      <Form.Item label="Last Cleaned At" className="mb-2 hidden">
                        <DatePicker
                          name="lastCleanedAt"
                          value={
                            formik.values.lastCleanedAt
                              ? dayjs(formik.values.lastCleanedAt)
                              : null
                          }
                          onChange={(date) =>
                            formik.setFieldValue(
                              "lastCleanedAt",
                              date ? date.format("YYYY-MM-DD") : null
                            )
                          }
                          style={{ width: "75%" }}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                      </Form.Item>
                      <Form.Item label="Cleaned Day Count" className="mb-2">
                        <Input
                          name="cleanedDayCount"
                          value={formik.values.cleanedDayCount}
                          onChange={formik.handleChange}
                          style={{ width: "75%" }}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                      </Form.Item>
                      <Form.Item label="pH" className="mb-2">
                        <Input
                          name="ph"
                          value={formik.values.ph}
                          onChange={formik.handleChange}
                          style={{ width: "75%" }}
                          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        />
                      </Form.Item>
                      <Form.Item label="Last Cleaned" className="mb-2">
                        <Checkbox
                          name="lastCleaned"
                          checked={formik.values.lastCleaned}
                          onChange={(e) =>
                            formik.setFieldValue(
                              "lastCleaned",
                              e.target.checked
                            )
                          }
                        >
                          Last Cleaned
                        </Checkbox>
                      </Form.Item>
                    </div>
                  </div>
                )}

                {isEditEnabled && (
                  <Form.Item className="flex justify-center mt-4">
                    <Button
                      className="bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                      type="primary"
                      htmlType="submit"
                      loading={mutation.isPending}
                    >
                      Update
                    </Button>
                  </Form.Item>
                )}

                <div className="flex space-x-4">
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                    onClick={handleShowParameters}
                  >
                    Show Water Quality Analysis
                  </Button>

                  <Button
                    className="bg-green-600 text-white hover:bg-green-700 transition duration-200"
                    onClick={exportReport}
                  >
                    Export Report
                  </Button>
                </div>

                <Modal
                  title="Water Quality Analysis Report"
                  visible={visible}
                  onOk={handleOk}
                  onCancel={handleCancelModal}
                  width="60%"
                  bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
                  centered
                >
                  {/* Critical Issues Section */}
                  {validationErrors.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="text-red-700 font-bold mb-3">⚠️ Critical Issues:</h3>
                      <ul className="list-disc pl-5">
                        {validationErrors.map((error, index) => (
                          <li key={index} className="text-red-600 mb-2">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Warnings Section */}
                  {warningMessages.length > 0 && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="text-yellow-700 font-bold mb-3">⚠️ Warnings:</h3>
                      <ul className="list-disc pl-5">
                        {warningMessages.map((warning, index) => (
                          <li key={index} className="text-yellow-600 mb-2">{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Salt Guide Section */}
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-blue-700 font-bold mb-3">🧂 Salt Concentration Guide:</h3>
                    <ul className="list-disc pl-5">
                      <li className="text-blue-600 mb-2">0.3%: Ideal for normal koi development and stress recovery</li>
                      <li className="text-blue-600 mb-2">0.5%: Balances pressure when transferring koi and removes harmful bacteria</li>
                      <li className="text-blue-600 mb-2">0.7%: Eliminates bacteria, fungi, and parasites</li>
                    </ul>
                  </div>

                  {/* Recommendations Section */}
                  {(validationErrors.length > 0 || warningMessages.length > 0) && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="text-blue-700 font-bold mb-3">💡 Recommendations:</h3>
                      <ul className="list-disc pl-5">
                        {validationErrors.length > 0 && (
                          <li className="text-blue-600 mb-2">
                            Perform an immediate water change of 25-50% to dilute harmful parameters
                          </li>
                        )}
                        {warningMessages.length > 0 && (
                          <li className="text-blue-600 mb-2">
                            Schedule a maintenance check within the next 48 hours
                          </li>
                        )}
                        <li className="text-blue-600 mb-2">
                          Check filtration system and ensure it's working properly
                        </li>
                        <li className="text-blue-600">
                          Consider using water treatment products from our store
                        </li>
                      </ul>
                    </div>
                  )}

                  {validationErrors.length === 0 && warningMessages.length === 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="text-green-700 font-bold mb-3">✅ Good News!</h3>
                      <p className="text-green-600">
                        All water parameters are within optimal ranges. Keep up the good work!
                      </p>
                    </div>
                  )}

                  <div className="mt-6">
                    <p className="text-gray-700 mb-4">
                      Need supplies to maintain optimal water quality?
                    </p>
                    <div className="flex justify-center">
                      <Button
                        onClick={() => {
                          window.open(PATH.STORE, "_blank");
                        }}
                        className="bg-black text-white hover:bg-gray-800 transition-colors duration-200 px-6 py-2"
                      >
                        Visit Store
                      </Button>
                    </div>
                  </div>
                </Modal>
              </Form>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal for Add Water Parameter */}
      <Modal
        visible={isAddWaterParaModalVisible}
        onCancel={() => setIsAddWaterParaModalVisible(false)}
        footer={null}
        width="60%"
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
        centered
        className="custom-modal"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <div className="w-full md:w-1/3 mb-4 md:mb-0 md:pr-4 items-start">
            <img
              src={selectedPond?.imageUrl}
              alt={selectedPond?.name}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="w-full md:w-2/3">
            <AddWaterPara
              selectedPond={selectedPond}
              onSuccess={() => {
                setIsAddWaterParaModalVisible(false);
                refetch();
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WaterParameter;
