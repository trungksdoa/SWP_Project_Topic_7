import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond";
import { useGetKoiByPondId } from "../../../hooks/koi/useGetKoiByPondId";
import { Button, Modal, Pagination, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";
import BreadcrumbComponent from "../BreadcrumbCoponent";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useGetWaterParameters } from "../../../hooks/koi/useGetWaterParameters";
import {
  calculateFood,
  calculateFoodByPond,
} from "../../../utils/FoodCalculator";

const PONDS_PER_PAGE = 8;
const LOADING_CHECK_INTERVAL = 100;
const LOADING_TIMEOUT = 10000;
const TRANSITION_DELAY = 300;

const FoodCalculator = () => {
  const [state, setState] = useState({
    koiAge: null,
    imgSrc: null,
    selectedKoi: null,
    currentPage: 1,
    selectedPond: null,
    isModalVisible: false,
    isModalLoading: false,
    isImageLoading: false,
    imageCache: new Set()
  });

  const navigate = useNavigate();
  const userId = useSelector((state) => state.manageUser.userLogin?.id);

  const { data: lstPond } = useGetAllPond(userId);

  const { data: lstKoi, isLoading: isLoadingKoi } = useGetKoiByPondId(
    state.selectedPond?.id,
    {
      enabled: !!state.selectedPond?.id,
      staleTime: 300000,
      cacheTime: 900000,
      refetchOnWindowFocus: false
    }
  );

  const { data: waterData, isLoading: isLoadingWater } = useGetWaterParameters(
    state.selectedPond?.id,
    {
      enabled: !!state.selectedPond?.id,
      staleTime: 300000,
      cacheTime: 900000, 
      refetchOnWindowFocus: false
    }
  );

  console.log(lstKoi)

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handlePondClick = async (pond) => {
    try {
      updateState({ 
        isModalLoading: true,
        selectedPond: pond,
        isModalVisible: true
      });

      await new Promise(resolve => {
        if (!isLoadingKoi && !isLoadingWater && lstKoi) {
          resolve();
          return;
        }

        const checkInterval = setInterval(() => {
          if (!isLoadingKoi && !isLoadingWater && lstKoi) {
            clearInterval(checkInterval);
            resolve();
          }
        }, LOADING_CHECK_INTERVAL);

        setTimeout(() => {
          clearInterval(checkInterval);
          resolve();
        }, LOADING_TIMEOUT);
      });

      await new Promise(resolve => setTimeout(resolve, TRANSITION_DELAY));

    } catch (error) {
      console.error('Error loading pond data:', error);
      toast.error('Failed to load pond data');
    } finally {
      updateState({ isModalLoading: false });
    }
  };

  const handleModalClose = () => updateState({ isModalVisible: false });

  const onPageChange = (page) => updateState({ currentPage: page });

  const handleClick = (koi) => {
    const ageInMonths = koi.dateOfBirth ? 
      dayjs().diff(dayjs(koi.dateOfBirth), "month") : 
      null;

    updateState({
      selectedKoi: koi,
      koiAge: ageInMonths,
      imgSrc: koi.imageUrl
    });
  };

  const handleClose = () => updateState({ selectedKoi: null });

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      handleClose();
    }
  };

  const handleImageLoad = (imageUrl) => {
    updateState({
      isImageLoading: false,
      imageCache: new Set([...state.imageCache, imageUrl])
    });
  };

  const calculateFoodRecommendation = () => {
    calculateFoodByPond(lstKoi, waterData);
  };

  const calculateFoodByKoi = () => {
    calculateFood(state.selectedKoi, state.koiAge);
  };

  const handleQuickView = (koi) => {
    const ageInMonths = koi.dateOfBirth ?
      dayjs().diff(dayjs(koi.dateOfBirth), "month") :
      null;
    
    updateState({ koiAge: ageInMonths });
    calculateFood(koi, ageInMonths);
  };

  const indexOfLastPond = state.currentPage * PONDS_PER_PAGE;
  const indexOfFirstPond = indexOfLastPond - PONDS_PER_PAGE;
  const currentPonds = lstPond?.slice(indexOfFirstPond, indexOfLastPond) || [];

  const renderPondGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 my-12">
      {currentPonds.map((pond, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div
            className="relative overflow-hidden cursor-pointer rounded-t-2xl"
            onClick={() => handlePondClick(pond)}
          >
            <LazyLoadImage
              src={pond.imageUrl}
              alt={pond.name}
              className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300"
              effect={state.isImageLoading ? "blur" : "none"}
              placeholderSrc="../../../../images/placeHolderImage.jfif"
              threshold={100}
              beforeLoad={() => updateState({ isImageLoading: true })}
              onLoad={() => handleImageLoad(pond.imageUrl)}
              visibleByDefault={state.imageCache.has(pond.imageUrl)}
              wrapperClassName="w-full h-52"
            />
          </div>
          <div className="p-4">
            <h3
              className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer truncate"
              onClick={() => handlePondClick(pond)}
            >
              {pond.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );

  const renderKoiGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {lstKoi && lstKoi?.length > 0 &&
        lstKoi.map((koi, index) => (
          <div key={index} className="relative text-center">
            <div
              className="w-16 h-16 mx-auto mb-1 overflow-hidden rounded-full shadow hover:shadow-md cursor-pointer transition-shadow duration-200"
              onClick={() => handleClick(koi)}
            >
              <img
                src={koi.imageUrl}
                alt={koi.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <h3
                className="text-xs font-medium truncate max-w-[80px] cursor-pointer hover:text-blue-600"
                onClick={() => handleClick(koi)}
              >
                {koi.name}
              </h3>
              <Button
                type="link"
                size="small"
                className="text-xs text-gray-500 hover:text-blue-600 p-0 h-auto flex items-center gap-0.5"
                onClick={() => handleQuickView(koi)}
              >
                <EyeOutlined className="text-xs" />
                View result
              </Button>
            </div>
          </div>
        ))}
    </div>
  );

  const renderKoiModal = () => (
    state.selectedKoi && (
      <div
        id="modal-overlay"
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleOutsideClick}
      >
        <div
          className="relative bg-white p-8 rounded-lg shadow-lg flex flex-col"
          style={{
            width: 700,
            maxWidth: "800px",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-2xl font-bold"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Koi Information
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center justify-center">
              <LazyLoadImage
                src={state.imgSrc || state.selectedKoi.imageUrl}
                alt={state.selectedKoi.name}
                className="w-80 h-40 object-cover rounded"
              />
            </div>
            <div className="col-span-2">
              <p className="flex justify-between mb-1">
                <strong>Name:</strong> <span>{state.selectedKoi.name}</span>
              </p>
              <p className="flex justify-between mb-1">
                <strong>Variety:</strong>{" "}
                <span>{state.selectedKoi.variety}</span>
              </p>
              <p className="flex justify-between mb-1">
                <strong>Sex:</strong>{" "}
                <span>{state.selectedKoi.sex ? "Female" : "Male"}</span>
              </p>
              <p className="flex justify-between mb-1">
                <strong>Purchase Price:</strong>{" "}
                <span>{state.selectedKoi.purchasePrice.toLocaleString('vi-VN')} VND</span>
              </p>
              <p className="flex justify-between mb-1">
                <strong>Weight:</strong>{" "}
                <span>{state.selectedKoi.weight} grams</span>
              </p>
              <p className="flex justify-between mb-1">
                <strong>Length:</strong>{" "}
                <span>{state.selectedKoi.length} cm</span>
              </p>
              <p className="flex justify-between mb-1">
                <strong>Date of Birth:</strong>{" "}
                <span>
                  {state.selectedKoi.dateOfBirth
                    ? dayjs(state.selectedKoi.dateOfBirth).format(
                        "YYYY-MM-DD"
                      )
                    : "Unknown"}
                </span>
              </p>
              <p className="flex justify-between mb-1">
                <strong>Age:</strong>
                <span>
                  {state.koiAge !== null ? `${state.koiAge} months` : "Unknown"}
                </span>
              </p>
              <Button
                type="link"
                size="large"
                className="text-base text-gray-600 hover:text-blue-600 p-2 h-auto flex items-center gap-2 font-medium"
                onClick={calculateFoodByKoi}
              >
                <EyeOutlined className="text-base" />
                View result
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div>
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, { name: "Food Calculator" }]}
      />
      <div className="flex justify-center items-center text-bold text-3xl h-full m-8">
        <strong>Food Calculator</strong>
      </div>

      {lstPond?.length === 0 && (
        <div className="flex flex-row items-center justify-center space-x-4">
          <div className="text-lg">You have no pond</div>
          <Button
            className="w-40 h-auto min-h-[2.5rem] py-2 px-4 border-black border-1 text-black rounded-full flex items-center justify-center font-bold text-lg"
            onClick={() => navigate("/pond-management")}
          >
            Add a pond
          </Button>
        </div>
      )}

      <div className="container mx-auto px-4">
        {renderPondGrid()}

        <div className="flex justify-center mb-8">
          <Pagination
            current={state.currentPage}
            total={lstPond?.length || 0}
            pageSize={PONDS_PER_PAGE}
            onChange={onPageChange}
            showSizeChanger={false}
            className="hover:text-blue-600"
          />
        </div>
      </div>

      {state.isModalVisible && state.selectedPond && (
        <Modal
          open={state.isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={800}
        >
          {state.isModalLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-xl font-bold text-center">
                  {state.selectedPond.name}
                </div>
                <div className="text-xl font-bold text-center">Koi in pond</div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex justify-center items-center ml-4 mr-4">
                  <img
                    src={state.selectedPond.imageUrl}
                    alt={state.selectedPond.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                {renderKoiGrid()}
              </div>
              <div className="mt-6 ml-4 flex flex-row items-center space-x-2">
                <div className="font-bold text-lg">
                  Food Calculation ( Pond ):
                </div>
                {lstKoi?.length > 0 ? (
                  <div className="text-lg">
                    <Button
                      type="link"
                      size="large"
                      className="text-base text-gray-600 hover:text-blue-600 p-2 h-auto flex items-center gap-2 font-medium"
                      onClick={calculateFoodRecommendation}
                    >
                      <EyeOutlined className="text-base" />
                      View result
                    </Button>
                  </div>
                ) : (
                  <div className="text-lg">
                    Add Koi to pond to calculate food
                  </div>
                )}
              </div>
              {renderKoiModal()}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default FoodCalculator;
