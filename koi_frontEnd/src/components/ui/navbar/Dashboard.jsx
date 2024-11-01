import React, { useRef, useState, useEffect } from 'react';
import Header from '../HeaderManage';
import Footer from '../Footer';
import { useSelector } from 'react-redux';
import { useGetAllKoi } from '../../../hooks/koi/useGetAllKoi';
import { useGetAllPond } from '../../../hooks/koi/useGetAllPond';
import { useGetFood } from '../../../hooks/koi/useGetFood';
import { Card, Spin, Button, Modal } from 'antd';
import Draggable from "react-draggable";
import { manageWaterServices } from '../../../services/koifish/manageWaterServices';
import dayjs from 'dayjs';
import KoiDetail from './KoiDetail';
import PondDetail from './PondDetail';

const Dashboard = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  
  const { data: lstKoi, isFetching: isKoiLoading } = useGetAllKoi(userId);
  const { data: lstPond, isFetching: isPondLoading } = useGetAllPond(userId);

  const isLoading = isKoiLoading || isPondLoading;
  const [pageLoading, setPageLoading] = useState(true);

  const [selectedPond, setSelectedPond] = useState(null);
  const [koiInSelectedPond, setKoiInSelectedPond] = useState([]);

  const [waterParameters, setWaterParameters] = useState(null);
  const [waterStandard, setWaterStandard] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const draggleRef = useRef(null);

  const [foodStandard, setFoodStandard] = useState(null);
  const { data: foodData, refetch: refetchFood } = useGetFood(selectedPond?.id);

  const [currentKoiPage, setCurrentKoiPage] = useState(1);
  const [currentPondPage, setCurrentPondPage] = useState(1);
  const koisPerPage = 6;
  const pondsPerPage = 10;
  const pondsPerRow = 5;

  const [isLoadingParams, setIsLoadingParams] = useState(false);
  const [isRightColumnLoading, setIsRightColumnLoading] = useState(false);

  const [selectedKoi, setSelectedKoi] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const [koiAge, setKoiAge] = useState(null);

  const [activeTab, setActiveTab] = useState('ponds');

  const [selectedTabKoi, setSelectedTabKoi] = useState(null);
  const [isKoiDetailLoading, setIsKoiDetailLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedPond) {
      refetchFood();
    }
  }, [selectedPond, refetchFood]);

  useEffect(() => {
    if (foodData) {
      setFoodStandard(foodData);
    }
  }, [foodData]);

  const handlePondClick = async (pond) => {
    setIsRightColumnLoading(true);
    setSelectedPond(pond);
    setWaterParameters(null);
    setWaterStandard(null);
    setFoodStandard(null);
    setKoiInSelectedPond([]);
    
    try {
      const [waterParamsRes, waterStandardRes] = await Promise.all([
        manageWaterServices.getWaterByPondId(pond.id),
        manageWaterServices.getWaterStandard(pond.id)
      ]);
      
      const filteredKoi = lstKoi?.filter(koi => koi.pondId === pond.id) || [];
      await refetchFood();
      
      setWaterParameters(waterParamsRes?.data?.data || null);
      setWaterStandard(waterStandardRes?.data?.data || null);
      setKoiInSelectedPond(filteredKoi);
      setCurrentKoiPage(1);
      
    } catch (error) {
      console.error("Error loading pond data:", error);
      setKoiInSelectedPond([]);
    } finally {
      setIsRightColumnLoading(false);
    }
  };

  useEffect(() => {
    const fetchWaterData = async () => {
      if (selectedPond) {
        setIsLoadingParams(true);
        try {
          const waterParamsRes = await manageWaterServices.getWaterByPondId(selectedPond.id);
          const waterStandardRes = await manageWaterServices.getWaterStandard(selectedPond.id);
          
          setWaterParameters(waterParamsRes?.data?.data || null);
          setWaterStandard(waterStandardRes?.data?.data || null);
        } catch (error) {
          console.error("Error fetching water data:", error);
          setWaterParameters(null);
          setWaterStandard(null);
        } finally {
          setIsLoadingParams(false);
        }
      }
    };

    fetchWaterData();
  }, [selectedPond]);

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
      setValidationErrors(errors);
    }
  }, [waterParameters, waterStandard]);

  const handleShowParameters = () => {
    if (validationErrors.length > 0) {
      setVisible(true);
    }
  };

  const handleKoiPageChange = (page) => {
    setCurrentKoiPage(page);
  };

  const handlePondPageChange = (page) => {
    setCurrentPondPage(page);
  };

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

  const formatAge = (ageInMonths) => {
    if (ageInMonths === null) return 'Unknown';
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;

    const parts = [];
    if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    if (months > 0 || parts.length === 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);

    return parts.join(', ');
  };

  const handleKoiClick = (koi) => {
    setSelectedKoi(koi);
    setImgSrc(koi.imageUrl);
    calculateAge(koi.dateOfBirth);
  };

  const handleClose = () => {
    setSelectedKoi(null);
    setImgSrc("");
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === 'modal-overlay') {
      handleClose();
    }
  };

  const handleTabKoiClick = (koi) => {
    setIsKoiDetailLoading(true);
    setSelectedTabKoi(koi);
    // Simulate loading for smoother transition
    setTimeout(() => {
      setIsKoiDetailLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-[450px] flex flex-col bg-gray-50">
      <Header />
      {pageLoading ? (
        <div className="flex justify-center items-center min-h-[450px]">
          <Spin tip="Loading" size="large" />
        </div>
      ) : (
        <div className="flex flex-col p-6 mb-8 flex-grow">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto max-w-7xl">
            {/* Left Column */}
            <div className="space-y-8">
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-center gap-4 text-center">
                      {/* Koi Count Card */}
                      <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 w-[300px] h-[120px]">
                        <div className="flex items-center justify-center h-full">
                          <div>
                            <p className="text-2xl font-semibold text-gray-600 mb-2 mt-2">Total Koi</p>
                            <p className="text-3xl font-bold text-center">{lstKoi?.length || 0}</p>
                          </div>
                        </div>
                      </Card>
                      {/* Pond Count Card */}
                      <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 w-[300px] h-[120px]">
                        <div className="flex items-center justify-center h-full">
                          <div>
                            <p className="text-2xl font-semibold text-gray-600 mb-2 mt-2">Total Ponds</p>
                            <p className="text-3xl font-bold text-center">{lstPond?.length || 0}</p>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Tabbed Card */}
                    <Card className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300 mt-4 w-full h-[340px]">
                      <div className="h-full flex flex-col">
                        {/* Tab Headers */}
                        <div className="flex border-b mb-4 text-center">
                          <div
                            className={`cursor-pointer px-6 py-2 text-lg font-semibold transition-colors duration-200 w-1/2
                              ${activeTab === 'ponds' 
                                ? 'text-blue-600 border-b-2 border-blue-600' 
                                : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('ponds')}
                          >
                            My Ponds
                          </div>
                          <div
                            className={`cursor-pointer px-6 py-2 text-lg font-semibold transition-colors duration-200 w-1/2
                              ${activeTab === 'koi' 
                                ? 'text-blue-600 border-b-2 border-blue-600' 
                                : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('koi')}
                          >
                            My Koi
                          </div>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-grow">
                          {activeTab === 'ponds' ? (
                            // Ponds Content
                            <div className="h-full flex flex-col">
                              <div className="grid grid-cols-5 gap-4 mb-4">
                                {lstPond
                                  ?.slice((currentPondPage - 1) * pondsPerPage, currentPondPage * pondsPerPage)
                                  .map((pond) => (
                                    <div
                                      key={pond.id}
                                      className="flex flex-col items-center cursor-pointer"
                                      onClick={() => handlePondClick(pond)}
                                    >
                                      <img
                                        src={pond.imageUrl}
                                        alt={pond.name}
                                        className="w-16 h-16 object-cover rounded-full mb-2"
                                      />
                                      <p className="text-sm text-center font-medium truncate w-full">{pond.name}</p>
                                    </div>
                                  ))}
                              </div>
                              {/* Pond Pagination */}
                              {lstPond && (
                                <div className="flex justify-center items-center gap-2 mt-auto pb-2">
                                  <button
                                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 
                                      ${lstPond.length <= pondsPerPage 
                                        ? 'bg-blue-500 text-white' 
                                        : currentPondPage === 1 
                                          ? 'bg-blue-500 text-white' 
                                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                    onClick={() => handlePondPageChange(1)}
                                  >
                                  </button>
                                  {lstPond.length > pondsPerPage && (
                                    <button
                                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 
                                        ${currentPondPage === 2 
                                          ? 'bg-blue-500 text-white' 
                                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                      onClick={() => handlePondPageChange(2)}
                                    >
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            // Koi Content
                            <div className="h-full flex flex-col">
                              <div className="grid grid-cols-5 gap-4 mb-4">
                                {lstKoi
                                  ?.slice((currentKoiPage - 1) * koisPerPage, currentKoiPage * koisPerPage)
                                  .map((koi) => (
                                    <div
                                      key={koi.id}
                                      className="flex flex-col items-center cursor-pointer"
                                      onClick={() => handleTabKoiClick(koi)}
                                    >
                                      <img
                                        src={koi.imageUrl}
                                        alt={koi.name}
                                        className="w-16 h-16 object-cover rounded-full mb-2"
                                      />
                                      <p className="text-sm text-center font-medium truncate w-full">{koi.name}</p>
                                    </div>
                                  ))}
                              </div>
                              {/* Koi Pagination */}
                              {lstKoi && Math.ceil(lstKoi.length / koisPerPage) > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-auto pb-2">
                                  {Array.from({ length: Math.ceil(lstKoi.length / koisPerPage) }).map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleKoiPageChange(index + 1)}
                                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-200 
                                        ${currentKoiPage === index + 1 
                                          ? 'bg-blue-500 text-white' 
                                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                    >
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                </>    
              )}
            </div>

            {/* Right Column */}
            <div className="bg-white rounded-xl shadow-lg p-6 h-[475px]">
              {activeTab === 'ponds' ? (
                selectedPond ? (
                  <PondDetail 
                    pond={selectedPond}
                    isLoading={isRightColumnLoading}
                    waterParameters={waterParameters}
                    waterStandard={waterStandard}
                    foodStandard={foodStandard}
                    validationErrors={validationErrors}
                    koiInSelectedPond={koiInSelectedPond}
                    currentKoiPage={currentKoiPage}
                    koisPerPage={koisPerPage}
                    handleShowParameters={handleShowParameters}
                    handleKoiClick={handleKoiClick}
                    handleKoiPageChange={handleKoiPageChange}
                  />
                ) : (
                  <div className="h-[405px] flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold mb-4">Select a pond to view details</h2>
                  </div>
                )
              ) : (
                // Koi detail content
                selectedTabKoi ? (
                  <KoiDetail koi={selectedTabKoi} isLoading={isKoiDetailLoading} />
                ) : (
                  <div className="h-[405px] flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold mb-4">Select a koi to view details</h2>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
      {selectedKoi && (
        <div
          id="modal-overlay"
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOutsideClick}
        >
          <div
            className="relative bg-white p-8 rounded-lg shadow-lg flex flex-col"
            style={{ width: 700, maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="absolute top-2 right-4 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Koi Information</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center justify-center">
                <img
                  src={imgSrc || selectedKoi.imageUrl}
                  alt={selectedKoi.name}
                  className="w-80 h-40 object-cover rounded"
                />
              </div>
              <div className="col-span-2">
                <p className="flex justify-between mb-1"><strong>Name:</strong> <span>{selectedKoi.name}</span></p>
                <p className="flex justify-between mb-1"><strong>Variety:</strong> <span>{selectedKoi.variety}</span></p>
                <p className="flex justify-between mb-1"><strong>Sex:</strong> <span>{selectedKoi.sex ? 'Female' : 'Male'}</span></p>
                <p className="flex justify-between mb-1"><strong>Purchase Price:</strong> <span>{selectedKoi.purchasePrice} VND</span></p>
                <p className="flex justify-between mb-1"><strong>Weight:</strong> <span>{selectedKoi.weight} grams</span></p>
                <p className="flex justify-between mb-1"><strong>Length:</strong> <span>{selectedKoi.length} cm</span></p>
                <p className="flex justify-between mb-1"><strong>Date of Birth:</strong> <span>{selectedKoi.dateOfBirth ? dayjs(selectedKoi.dateOfBirth).format('YYYY-MM-DD') : 'Unknown'}</span></p>
                <p className="flex justify-between mb-1"><strong>Age:</strong> <span>{formatAge(koiAge)}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;