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
            message.success("Update Water Parameter Success !");
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
      // if (waterParameters.amountFed != waterStandard.amountFedStandard) {
      //   errors.push(
      //     `Amount: Fed must be equal to ${waterStandard.amountFedStandard}g`
      //   );
      // }
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
              className="w-full h-48 object-cover cursor-pointer" // Updated this line
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

                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
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
                  width="60%" // Increased from default (usually 520px) to 80% of screen width
                  bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }} // Added to enable scrolling if content is too long
                  centered // Add this prop to center the modal
                  style={{ top: 20 }} // Add some top margin to prevent it from being flush against the top of the screen
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
                      You can check out products that can improve your pond at
                      the store.
                    </p>
                    <div className="mt-4 flex justify-center">
                      {" "}
                      {/* Added container with centering */}
                      <Button
                        onClick={() => {
                          window.open(PATH.STORE, "_blank");
                        }}
                        className="bg-black text-white hover:bg-gray-800 transition-colors duration-200 px-6 py-2" // Added more padding
                      >
                        Go To Store
                      </Button>
                    </div>
                  </div>
                </Modal>
              </Form>
            </div>
          </div>
        )}
      </Modal>

      {/* New Modal for Add Water Parameter */}
      <Modal
        visible={isAddWaterParaModalVisible}
        onCancel={() => setIsAddWaterParaModalVisible(false)}
        footer={null}
        width="60%" // Increased width for better responsiveness
        bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }} // Added scrolling for tall content
        centered // Centers the modal vertically
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
