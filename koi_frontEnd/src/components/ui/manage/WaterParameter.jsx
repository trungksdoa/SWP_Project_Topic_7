import React, { useEffect, useRef, useState } from "react";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond.js";
import { useSelector } from "react-redux";
import { Button, Form, Input, DatePicker, Spin, Modal, Checkbox } from "antd";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { manageWaterServices } from "../../../services/koifish/manageWaterServices.js";
import BreadcrumbComponent from "../BreadcrumbCoponent.jsx";
import AddWaterPara from "./AddWaterPara.jsx";
import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constant/config.js";
import StoreTemplate from "../../template/StoreTemplate.jsx";
import { useMutation } from "@tanstack/react-query";
import { useUpdateWaterParameter } from "../../../hooks/koi/useUpdateWaterParameter.js";
import { toast } from "react-toastify";
import { useGetWaterStandard } from "../../../hooks/koi/useGetWaterStandard.js";

const WaterParameter = () => {
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
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const mutation = useUpdateWaterParameter();
  const draggleRef = useRef(null);
  const { data: waterStandards, refetchStandard } = useGetWaterStandard(
    selectedPond?.id
  );
  const handleGoToStore = () => {
    setShowStore(true);
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
          `Nitrite NO2: must be less than or equal to ${waterStandard.no2Standard}`
        );
      }
      if (waterParameters.nitrateNO3 > waterStandard.no3Standard) {
        errors.push(
          `Nitrate NO3: must be less than or equal to ${waterStandard.no3Standard}`
        );
      }
      if (
        waterParameters.ammoniumNH4 < waterStandard.nh4StandardMin ||
        waterParameters.ammoniumNH4 > waterStandard.nh4Standard
      ) {
        errors.push(
          `Ammonium NH4: must be in the range from ${waterStandard.nh4StandardMin} to ${waterStandard.nh4Standard}`
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
          `Temperature: must be in the range from ${waterStandard.temperatureMin} to ${waterStandard.temperatureMax}`
        );
      }
      if (
        waterParameters.hardnessGH < waterStandard.generalHardnessGhMin ||
        waterParameters.hardnessGH > waterStandard.generalHardnessGhMax
      ) {
        errors.push(
          `Hardness GH: must be in the range from ${waterStandard.generalHardnessGhMin} to ${waterStandard.generalHardnessGhMax}`
        );
      }
      if (
        waterParameters.carbonateHardnessKH <
          waterStandard.carbonateHardnessKhMin ||
        waterParameters.carbonateHardnessKH >
          waterStandard.carbonateHardnessKhMax
      ) {
        errors.push(
          `Carbonate Hardness KH: must be in the range from ${waterStandard.carbonateHardnessKhMin} to ${waterStandard.carbonateHardnessKhMax}`
        );
      }
      if (
        waterParameters.co2 < waterStandard.oxygenMin ||
        waterParameters.co2 > waterStandard.oxygenMax
      ) {
        errors.push(
          `CO2: must be in the range from ${waterStandard.oxygenMin} to ${waterStandard.oxygenMax}`
        );
      }
      if (
        waterParameters.totalChlorines < waterStandard.chlorineMin ||
        waterParameters.totalChlorines > waterStandard.chlorineMax
      ) {
        errors.push(
          `Total Chlorines: must be in the range from ${waterStandard.chlorineMin} to ${waterStandard.chlorineMax}`
        );
      }
      if (waterParameters.amountFed > waterStandard.amountFedStandard) {
        errors.push(
          `Amount: Fed must be less than or equal to ${waterStandard.amountFedStandard}`
        );
      }
      if (waterParameters.salt > waterStandard.salt05) {
        errors.push(
          `Salt: must be less than or equal to ${waterStandard.salt05}`
        );
      }
      console.log(errors);
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
        width="70%"
      >
        {loading ? (
          <Spin />
        ) : !waterParameters ||
          waterParameters === null ||
          Object.keys(waterParameters).length === 0 ? (
          <div className="flex justify-between">
            <div className="mr-6  basis-1/3">
              <img
                src={selectedPond?.imageUrl}
                alt={selectedPond?.name}
                className="w-80 rounded-[8px] h-70 object-cover"
              />
            </div>
            <div className=" basis-2/3">
              <div className="font-bold text-[24px]">Chưa có thông số nước</div>
              <AddWaterPara selectedPond={selectedPond} />
            </div>
          </div>
        ) : (
          <div className="flex justify-between">
            <div className="mr-6">
              <img
                src={selectedPond.imageUrl}
                alt={selectedPond.name}
                className="w-80 rounded-[8px] h-70 object-cover"
              />
            </div>
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              layout="horizontal"
              style={{ width: "100%" }}
              onFinish={formik.handleSubmit}
            >
              <Form.Item label="Edit Parameter">
                <Checkbox onChange={handleEditToggle}>Edit Parameter</Checkbox>
              </Form.Item>

              <Form.Item label="Nitrite NO2">
                <Input
                  name="nitriteNO2"
                  value={formik.values.nitriteNO2}
                  onChange={formik.handleChange}
                  disabled={!isEditEnabled}
                />
              </Form.Item>

              <Form.Item label="Nitrate NO3">
                <Input
                  name="nitrateNO3"
                  value={formik.values.nitrateNO3}
                  onChange={formik.handleChange}
                  disabled={!isEditEnabled}
                />
              </Form.Item>

              <Form.Item label="Ammonium NH4">
                <Input
                  name="ammoniumNH4"
                  value={formik.values.ammoniumNH4}
                  onChange={formik.handleChange}
                  disabled={!isEditEnabled}
                />
              </Form.Item>

              <Form.Item label="Hardness GH">
                <Input
                  name="hardnessGH"
                  value={formik.values.hardnessGH}
                  onChange={formik.handleChange}
                  disabled={!isEditEnabled}
                />
              </Form.Item>

              <Form.Item label="Salt">
                <Input
                  name="salt"
                  value={formik.values.salt}
                  onChange={formik.handleChange}
                  disabled={!isEditEnabled}
                />
              </Form.Item>

              <Form.Item label="Temperature">
                <Input
                  name="temperature"
                  value={formik.values.temperature}
                  onChange={formik.handleChange}
                  disabled={!isEditEnabled}
                />
              </Form.Item>

              <Form.Item label="Carbonate Hardness KH">
                <Input
                  name="carbonateHardnessKH"
                  value={formik.values.carbonateHardnessKH}
                  onChange={formik.handleChange}
                  disabled={!isEditEnabled}
                />
              </Form.Item>

              <Form.Item label="CO2">
                <Input
                  name="co2"
                  value={formik.values.co2}
                  onChange={formik.handleChange}
                  disabled={!isEditEnabled}
                />
              </Form.Item>

              <Form.Item label="Total Chlorines">
                <Input
                  name="totalChlorines"
                  value={formik.values.totalChlorines}
                  onChange={formik.handleChange}
                  disabled={!isEditEnabled}
                />
              </Form.Item>

              <Form.Item label="Amount Fed">
                <Input
                  name="amountFed"
                  value={formik.values.amountFed}
                  onChange={formik.handleChange}
                  disabled={!isEditEnabled}
                />
              </Form.Item>

              <Form.Item label="Pond ID">
                <Input
                  name="pondId"
                  value={formik.values.pondId}
                  onChange={formik.handleChange}
                  disabled={!isEditEnabled}
                />
              </Form.Item>

              <Form.Item label="Last Cleaned At">
                <DatePicker
                  value={
                    formik.values.lastCleanedAt
                      ? dayjs(formik.values.lastCleanedAt, "YYYY-MM-DD")
                      : null
                  }
                  format="YYYY-MM-DD"
                  onChange={handleChangeDatePicker}
                  disabled={!isEditEnabled}
                />
              </Form.Item>

              <Form.Item label="Cleaned Day Count">
                <Input
                  name="cleanedDayCount"
                  value={formik.values.cleanedDayCount}
                  onChange={formik.handleChange}
                  disabled={!isEditEnabled}
                />
              </Form.Item>

              <Form.Item label="pH">
                <Input
                  name="ph"
                  value={formik.values.ph}
                  onChange={formik.handleChange}
                  disabled={!isEditEnabled}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  className=" bg-black text-white hover:!bg-black hover:!text-white hover:!border-none border-none"
                  type="primary"
                  disabled={!isEditEnabled}
                  htmlType="submit"
                  loading={mutation.isPending}
                >
                  Update
                </Button>
              </Form.Item>
              <Button
                className="mt-[15px] bg-black text-white hover:!bg-black hover:!text-white hover:!border-none border-none"
                onClick={showModal}
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
                <div>
                  <p>
                    Let to the store to check out products that can improve your
                    pond.{" "}
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
        )}
      </Modal>
    </div>
  );
};

export default WaterParameter;