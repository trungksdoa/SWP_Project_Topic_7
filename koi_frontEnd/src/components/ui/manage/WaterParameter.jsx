import { useEffect, useState } from "react";
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
} from "antd";
import { useFormik } from "formik";
import dayjs from "dayjs";

import BreadcrumbComponent from "../BreadcrumbCoponent.jsx";
import AddWaterPara from "./AddWaterPara.jsx";
import { PATH } from "../../../constant/config.js";

import { useUpdateWaterParameter } from "../../../hooks/koi/useUpdateWaterParameter.js";
import { useGetWaterStandard } from "../../../hooks/koi/useGetWaterStandard.js";

// Add these imports at the top
import { useGetWaterParameters } from "../../../hooks/koi/useGetWaterParameters.js";
import { exportToPDF } from "./exportFile.jsx";


const WaterParameter = () => {
  const [selectedPond, setSelectedPond] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [warningMessages, setWarningMessages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isAddWaterParaModalVisible, setIsAddWaterParaModalVisible] =
    useState(false);

  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const mutation = useUpdateWaterParameter();

  const { data: waterStandards, refetch: refetchWaterStandard } =
    useGetWaterStandard(selectedPond?.id);
  const { data: lstPond, refetch: refetchPond } = useGetAllPond(userId);
  const { data: waterParamsData, refetch: refetchWaterParams } =
    useGetWaterParameters(selectedPond?.id);

  const handleEditToggle = (e) => setIsEditEnabled(e.target.checked);

  useEffect(() => {
    if (!selectedPond) {
      setLoading(false);
      return;
    }

    setLoading(true);
    refetchWaterParams();
    refetchWaterStandard();

    setInterval(() => {
      setLoading(false);
    }, 1000);
  }, [selectedPond]);

  const showModal = () => setVisible(true);
  const handleOk = () => setVisible(false);
  const handleCancelModal = () => setVisible(false);
  const handleClick = (pond) => {
    setSelectedPond(pond);
    setIsModalVisible(true);
  };

  const handleCancel = () => setIsModalVisible(false);

  const handleShowParameters = () => {
    if (validationErrors.length > 0 || warningMessages.length > 0) {
      showModal();
    } else {
      message.info("All parameters meet the standards.");
    }
  };

  

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
      mutation.mutate(
        { id: waterParamsData?.pondId, payload: values },
        {
          onSuccess: () => {
            message.success("Update Water Parameter Success!");
            refetchWaterParams();
            refetchWaterStandard();
          },
        }
      );
    },
  });

  useEffect(() => {
    if (waterParamsData) {
      formik.setValues({
        nitriteNO2: waterParamsData.nitriteNO2 || 0,
        nitrateNO3: waterParamsData.nitrateNO3 || 0,
        ammoniumNH4: waterParamsData.ammoniumNH4 || 0,
        hardnessGH: waterParamsData.hardnessGH || 0,
        salt: waterParamsData.salt || 0,
        temperature: waterParamsData.temperature || 0,
        carbonateHardnessKH: waterParamsData.carbonateHardnessKH || 0,
        co2: waterParamsData.co2 || 0,
        totalChlorines: waterParamsData.totalChlorines || 0,
        amountFed: waterParamsData.amountFed || 0,
        pondId: waterParamsData.pondId || 0,
        lastCleanedAt: waterParamsData.lastCleanedAt || "2024-10-03",
        cleanedDayCount: waterParamsData.cleanedDayCount || 0,
        ph: waterParamsData.ph || 0,
      });
    }
  }, [waterParamsData]);

  useEffect(() => {
    if (!waterParamsData || !waterStandards) return;

    const errors = [];
    const warnings = [];

    // Validation checks
    const validateParameter = (value, min, max, name, unit, message) => {
      if (value < min || value > max) {
        errors.push(
          `${name} (${value} ${unit}) is outside safe range (${min} - ${max} ${unit}). ${message}`
        );
      } else if (value > max * 0.8) {
        warnings.push(
          `${name} (${value} ${unit}) is approaching dangerous levels. Consider water change.`
        );
      }
    };

    validateParameter(
      waterParamsData.nitriteNO2,
      0,
      waterStandards.no2Standard,
      "Nitrite NO2",
      "mg/L",
      "This can be toxic to fish!"
    );
    validateParameter(
      waterParamsData.nitrateNO3,
      0,
      waterStandards.no3Standard,
      "Nitrate NO3",
      "mg/L",
      "High nitrates indicate poor water quality."
    );
    validateParameter(
      waterParamsData.ammoniumNH4,
      waterStandards.nh4StandardMin,
      waterStandards.nh4Standard,
      "Ammonium NH4",
      "mg/L",
      "This is highly toxic to fish!"
    );
    validateParameter(
      waterParamsData.ph,
      waterStandards.phMin,
      waterStandards.phMax,
      "pH",
      "",
      "This can stress fish!"
    );
    validateParameter(
      waterParamsData.temperature,
      waterStandards.temperatureMin,
      waterStandards.temperatureMax,
      "Temperature",
      "°C",
      "This affects fish metabolism!"
    );
    validateParameter(
      waterParamsData.hardnessGH,
      waterStandards.generalHardnessGhMin,
      waterStandards.generalHardnessGhMax,
      "Hardness GH",
      "ppm",
      "This affects osmoregulation!"
    );
    validateParameter(
      waterParamsData.carbonateHardnessKH,
      waterStandards.carbonateHardnessKhMin,
      waterStandards.carbonateHardnessKhMax,
      "Carbonate Hardness KH",
      "ppm",
      "This affects pH stability!"
    );
    validateParameter(
      waterParamsData.co2,
      waterStandards.oxygenMin,
      waterStandards.oxygenMax,
      "CO2",
      "mg/L",
      "This affects breathing!"
    );
    validateParameter(
      waterParamsData.totalChlorines,
      waterStandards.chlorineMin,
      waterStandards.chlorineMax,
      "Total Chlorines",
      "g",
      "Chlorine is toxic to fish!"
    );

    // Salt concentration analysis
    if (waterParamsData.salt) {
      const saltPPM = waterParamsData.salt;
      const pondVolume = selectedPond?.volume || 0;

      const calculateSaltAmount = (ppm) => (ppm * pondVolume) / 1000000;

      const saltAmounts = {
        3000: calculateSaltAmount(3000),
        5000: calculateSaltAmount(5000),
        7000: calculateSaltAmount(7000),
      };

      if (saltPPM === 0) {
        warnings.push(
          `No salt detected. Consider adding ${saltAmounts[3000].toFixed(
            2
          )}kg of salt for basic health maintenance (3000 PPM).`
        );
      } else if (saltPPM < 3000) {
        const additionalSaltNeeded =
          saltAmounts[3000] - calculateSaltAmount(saltPPM);
        warnings.push(
          `Salt concentration too low (${saltPPM} PPM). Add ${additionalSaltNeeded.toFixed(
            2
          )}kg more salt to reach 3000 PPM for optimal health.`
        );
      } else if (saltPPM > 7000) {
        const excessSalt = (
          calculateSaltAmount(saltPPM) - saltAmounts[7000]
        ).toFixed(2);
        errors.push(
          `Salt concentration too high (${saltPPM} PPM). Remove approximately ${excessSalt}kg of salt or perform water change. High salt levels may stress fish!`
        );
      }

      warnings.push(`
Salt amount recommendations for ${pondVolume}L pond:
- For 3000 PPM (health maintenance): ${saltAmounts[3000].toFixed(2)}kg
- For 5000 PPM (bacteria control): ${saltAmounts[5000].toFixed(2)}kg  
- For 7000 PPM (treatment): ${saltAmounts[7000].toFixed(2)}kg
`);
    }

    setValidationErrors(errors);
    setWarningMessages(warnings);
  }, [waterParamsData, waterStandards, selectedPond]);

  return (
    <div>
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, { name: "Calculator" }]}
      />
      <div className="flex justify-center items-center text-bold text-3xl h-full m-8">
        <strong>Water Parameter</strong>
      </div>

      <div className="container grid grid-cols-4 gap-6 my-16">
        {lstPond?.map((pond, index) => (
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
        ) : !waterParamsData ||
          waterParamsData === null ||
          Object.keys(waterParamsData).length === 0 ? (
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
                      <Form.Item
                        label="Last Cleaned At"
                        className="mb-2 hidden"
                      >
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
                </div>

                <Modal
                  title={
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Water Quality Analysis Report
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Generated on {new Date().toLocaleString()}
                      </p>

                      <Button
                        key="export"
                        onClick={exportToPDF}
                        className="mt-2 bg-gradient-to-r from-blue-500 to-blue-800 text-white hover:from-blue-600 hover:to-blue-800 transition-all duration-300 px-6 py-2 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center mx-auto border-2 border-blue-400"
                        icon={<span className="mr-2 text-lg">📑</span>}
                      >
                        Export Report
                      </Button>
                    </div>
                  }
                  open={visible}
                  onOk={handleOk}
                  onCancel={handleCancelModal}
                  width="70%"
                  style={{ maxHeight: "80vh", overflowY: "auto" }}
                  centered
                  className="water-quality-modal"
                >
                  {/* Critical Issues Section */}
                  {validationErrors.length > 0 && (
                    <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-2">⚠️</span>
                        <h3 className="text-xl text-red-700 font-bold">
                          Critical Issues Detected
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {validationErrors.map((error, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-4 h-4 mt-1 mr-2 bg-red-500 rounded-full flex-shrink-0"></span>
                            <p className="text-red-700 leading-relaxed">
                              {error}
                            </p>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 p-3 bg-red-100 rounded">
                        <p className="text-red-800 text-sm font-medium">
                          ⚡ Immediate action required! These issues can
                          severely impact fish health.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Warnings Section */}
                  {warningMessages.length > 0 && (
                    <div className="mb-8 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-lg shadow-md">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-2">⚠️</span>
                        <h3 className="text-xl text-amber-700 font-bold">
                          Important Warnings
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {warningMessages.map((warning, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-4 h-4 mt-1 mr-2 bg-amber-500 rounded-full flex-shrink-0"></span>
                            <p className="text-amber-700 leading-relaxed whitespace-pre-line">
                              {warning}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Salt Guide Section */}
                  <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-2">🧂</span>
                      <h3 className="text-xl text-blue-700 font-bold">
                        Salt Concentration Guidelines
                      </h3>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-bold text-blue-800 mb-2">
                            Maintenance Level
                          </h4>
                          <p className="text-blue-700">3000 PPM</p>
                          <p className="text-sm text-blue-600 mt-2">
                            Ideal for normal development and stress recovery
                          </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-bold text-blue-800 mb-2">
                            Treatment Level
                          </h4>
                          <p className="text-blue-700">5000 PPM</p>
                          <p className="text-sm text-blue-600 mt-2">
                            For pressure balance and bacteria control
                          </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-bold text-blue-800 mb-2">
                            Therapeutic Level
                          </h4>
                          <p className="text-blue-700">7000 PPM</p>
                          <p className="text-sm text-blue-600 mt-2">
                            For eliminating parasites and infections
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-800 font-medium">
                            Current Salt Level:
                          </span>
                          <span className="text-blue-800 font-bold">
                            {waterParamsData?.salt} PPM
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations Section */}
                  {(validationErrors.length > 0 ||
                    warningMessages.length > 0) && (
                    <div className="mb-8 p-6 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg shadow-md">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-2">💡</span>
                        <h3 className="text-xl text-emerald-700 font-bold">
                          Action Plan
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <h4 className="font-bold text-emerald-800 mb-3">
                            Immediate Actions:
                          </h4>
                          <ul className="space-y-2">
                            {validationErrors.length > 0 && (
                              <li className="flex items-center text-emerald-700">
                                <span className="mr-2">🔄</span>
                                Perform 25-50% water change
                              </li>
                            )}
                            {warningMessages.length > 0 && (
                              <li className="flex items-center text-emerald-700">
                                <span className="mr-2">📅</span>
                                Schedule maintenance within 48h
                              </li>
                            )}
                          </ul>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <h4 className="font-bold text-emerald-800 mb-3">
                            Preventive Measures:
                          </h4>
                          <ul className="space-y-2">
                            <li className="flex items-center text-emerald-700">
                              <span className="mr-2">🔍</span>
                              Inspect filtration system
                            </li>
                            <li className="flex items-center text-emerald-700">
                              <span className="mr-2">💊</span>
                              Consider water treatments
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {validationErrors.length === 0 &&
                    warningMessages.length === 0 && (
                      <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-md">
                        <div className="flex items-center mb-4">
                          <span className="text-2xl mr-2">✨</span>
                          <h3 className="text-xl text-green-700 font-bold">
                            Perfect Water Conditions!
                          </h3>
                        </div>
                        <p className="text-green-700 leading-relaxed">
                          All parameters are within optimal ranges. Your koi are
                          swimming in perfect conditions!
                        </p>
                        <div className="mt-4 p-3 bg-green-100 rounded">
                          <p className="text-green-800 text-sm font-medium">
                            💡 Tip: Maintain regular testing schedule to ensure
                            continued water quality excellence.
                          </p>
                        </div>
                      </div>
                    )}

                  <div className="mt-8 text-center">
                    <p className="text-gray-700 mb-4 font-medium">
                      Need professional-grade water treatment supplies?
                    </p>
                    <Button
                      onClick={() => {
                        window.open(PATH.STORE, "_blank");
                      }}
                      className="bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 transition-all duration-300 px-8 py-2 rounded-full shadow-lg hover:shadow-xl"
                    >
                      Browse Our Store
                    </Button>
                  </div>
                </Modal>
              </Form>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal for Add Water Parameter */}
      <Modal
        open={isAddWaterParaModalVisible}
        onCancel={() => setIsAddWaterParaModalVisible(false)}
        footer={null}
        width="60%"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
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
                refetchWaterParams();
                refetchWaterStandard();
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WaterParameter;
