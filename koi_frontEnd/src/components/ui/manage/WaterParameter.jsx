import React, { useEffect, useState } from "react";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond.js";
import { useSelector } from "react-redux";
import { Button, Form, Input, DatePicker, Spin } from "antd";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { manageWaterServices } from "../../../services/koifish/manageWaterServices.js";
import BreadcrumbComponent from "../BreadcrumbCoponent.jsx";

const WaterParameter = () => {
  const [selectedPond, setSelectedPond] = useState(null);
  const [waterParameters, setWaterParameters] = useState(null);
  const [waterStandard, setWaterStandard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]); // Thêm biến trạng thái để lưu lỗi
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;

  const { data: lstPond } = useGetAllPond(userId);

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
  }, [selectedPond]);

  console.log(waterParameters);

  const handleClick = (pond) => setSelectedPond(pond);
  const handleClose = () => setSelectedPond(null);

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      setSelectedPond(null);
    }
  };

  const handleChangeDatePicker = (date) => {
    if (date) {
      formik.setFieldValue("birthday", date.format("DD/MM/YYYY"));
    } else {
      formik.setFieldValue("birthday", null);
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
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

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

  useEffect(() => {
    if (waterParameters && waterStandard) {
      const errors = [];
      if (waterParameters.nitriteNO2 > waterStandard.no2Standard) {
        errors.push(
          `Nitrite NO2 must be less than or equal to ${waterStandard.no2Standard}`
        );
      }
      if (waterParameters.nitrateNO3 > waterStandard.no3Standard) {
        errors.push(
          `Nitrate NO3 must be less than or equal to ${waterStandard.no3Standard}`
        );
      }
      if (
        waterParameters.ammoniumNH4 < waterStandard.nh4StandardMin ||
        waterParameters.ammoniumNH4 > waterStandard.nh4Standard
      ) {
        errors.push(
          `Ammonium NH4 must be in the range from ${waterStandard.nh4StandardMin} to ${waterStandard.nh4Standard}`
        );
      }
      if (
        waterParameters.ph < waterStandard.phMin ||
        waterParameters.ph > waterStandard.phMax
      ) {
        errors.push(
          `pH must be in the range from ${waterStandard.phMin} to ${waterStandard.phMax}`
        );
      }
      if (
        waterParameters.temperature < waterStandard.temperatureMin ||
        waterParameters.temperature > waterStandard.temperatureMax
      ) {
        errors.push(
          `Temperature must be in the range from ${waterStandard.temperatureMin} to ${waterStandard.temperatureMax}`
        );
      }
      if (
        waterParameters.hardnessGH < waterStandard.generalHardnessGhMin ||
        waterParameters.hardnessGH > waterStandard.generalHardnessGhMax
      ) {
        errors.push(
          `Hardness GH must be in the range from ${waterStandard.generalHardnessGhMin} to ${waterStandard.generalHardnessGhMax}`
        );
      }
      if (
        waterParameters.carbonateHardnessKH <
          waterStandard.carbonateHardnessKhMin ||
        waterParameters.carbonateHardnessKH >
          waterStandard.carbonateHardnessKhMax
      ) {
        errors.push(
          `Carbonate Hardness KH must be in the range from ${waterStandard.carbonateHardnessKhMin} to ${waterStandard.carbonateHardnessKhMax}`
        );
      }
      if (
        waterParameters.co2 < waterStandard.oxygenMin ||
        waterParameters.co2 > waterStandard.oxygenMax
      ) {
        errors.push(
          `CO2 must be in the range from ${waterStandard.oxygenMin} to ${waterStandard.oxygenMax}`
        );
      }
      if (
        waterParameters.totalChlorines < waterStandard.chlorineMin ||
        waterParameters.totalChlorines > waterStandard.chlorineMax
      ) {
        errors.push(
          `Total Chlorines must be in the range from ${waterStandard.chlorineMin} to ${waterStandard.chlorineMax}`
        );
      }
      if (waterParameters.amountFed > waterStandard.amountFedStandard) {
        errors.push(
          `Amount Fed must be less than or equal to ${waterStandard.amountFedStandard}`
        );
      }
      console.log(errors);
      setValidationErrors(errors);
    }
  }, [waterParameters, waterStandard]);

  if (!lstPond) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, { name: "Water Parameter" }]}
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

      {selectedPond && (
        <div
          id="modal-overlay"
          className=" inset-0 flex items-center justify-center z-50"
          onClick={handleOutsideClick}
        >
          <div
            className="relative bg-white p-6 rounded-lg shadow-lg flex flex-col"
            style={{ width: "70%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute -top-1 right-2 text-2xl font-bold"
            >
              &times;
            </button>
            <div className="flex flex-row justify-center">
              <div className="mr-6">
                <img
                  src={selectedPond.imageUrl}
                  alt={selectedPond.name}
                  className="w-80 rounded-[8px] h-70 object-cover"
                />
              </div>

              <div className="flex flex-col w-full">
                {loading ? (
                  <Spin />
                ) : !waterParameters ||
                  waterParameters === null ||
                  Object.keys(waterParameters).length === 0 ? (
                  <div className="mt-12 text-center">Chưa có thông số nước</div>
                ) : (
                  <Form
                    labelCol={{
                      span: 8,
                    }}
                    wrapperCol={{
                      span: 16,
                    }}
                    layout="horizontal"
                    style={{
                      maxWidth: 600,
                    }}
                    onFinish={formik.handleSubmit}
                  >
                    <Form.Item label="Nitrite NO2">
                      <Input
                        name="nitriteNO2"
                        value={formik.values.nitriteNO2}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>

                    <Form.Item label="Nitrate NO3">
                      <Input
                        name="nitrateNO3"
                        value={formik.values.nitrateNO3}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>

                    <Form.Item label="Ammonium NH4">
                      <Input
                        name="ammoniumNH4"
                        value={formik.values.ammoniumNH4}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>

                    <Form.Item label="Hardness GH">
                      <Input
                        name="hardnessGH"
                        value={formik.values.hardnessGH}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>

                    <Form.Item label="Salt">
                      <Input
                        name="salt"
                        value={formik.values.salt}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>

                    <Form.Item label="Temperature">
                      <Input
                        name="temperature"
                        value={formik.values.temperature}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>

                    <Form.Item label="Carbonate Hardness KH">
                      <Input
                        name="carbonateHardnessKH"
                        value={formik.values.carbonateHardnessKH}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>

                    <Form.Item label="CO2">
                      <Input
                        name="co2"
                        value={formik.values.co2}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>

                    <Form.Item label="Total Chlorines">
                      <Input
                        name="totalChlorines"
                        value={formik.values.totalChlorines}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>

                    <Form.Item label="Amount Fed">
                      <Input
                        name="amountFed"
                        value={formik.values.amountFed}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>

                    <Form.Item label="Pond ID">
                      <Input
                        name="pondId"
                        value={formik.values.pondId}
                        onChange={formik.handleChange}
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
                      />
                    </Form.Item>

                    <Form.Item label="Cleaned Day Count">
                      <Input
                        name="cleanedDayCount"
                        value={formik.values.cleanedDayCount}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>

                    <Form.Item label="pH">
                      <Input
                        name="ph"
                        value={formik.values.ph}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Submit
                      </Button>
                    </Form.Item>
                    {validationErrors.length > 0 && (
                      <div className="text-red-500">
                        <ul>
                          {validationErrors.map((error, index) => (
                            <li key={index} className="my-[10px]">
                              {error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterParameter;
