import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllPond } from '../../../hooks/koi/useGetAllPond';
import { useGetAllKoi } from '../../../hooks/koi/useGetAllKoi';
import { Button, Modal, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import BreadcrumbComponent from '../BreadcrumbCoponent';
import dayjs from 'dayjs';
import { manageWaterServices } from '../../../services/koifish/manageWaterServices';

const FoodCalculator = () => {
  const [selectedPond, setSelectedPond] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pondsPerPage = 8;
  const navigate = useNavigate();
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [koiAge, setKoiAge] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [waterParameters, setWaterParameters] = useState(null);
  const [waterStandard, setWaterStandard] = useState(null);

  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;

  const { data: lstPond, refetch } = useGetAllPond(userId);
  const { data: lstKoi } = useGetAllKoi(userId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handlePondClick = async (pond) => {
    setSelectedPond(pond);
    try {
      const waterParamsRes = await manageWaterServices.getWaterByPondId(pond.id);
      const waterStandardRes = await manageWaterServices.getWaterStandard(pond.id);
      setWaterParameters(waterParamsRes?.data?.data || null);
      setWaterStandard(waterStandardRes?.data?.data || null);
    } catch (error) {
      console.error("Error fetching water data:", error);
      setWaterParameters(null);
      setWaterStandard(null);
    }
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClick = (koi) => {
    setSelectedKoi(koi);
    // Calculate koi age
    if (koi.dateOfBirth) {
      const age = dayjs().diff(dayjs(koi.dateOfBirth), 'day');
      setKoiAge(age);
    } else {
      setKoiAge(null);
    }
    setImgSrc(koi.imageUrl);
  };

  const handleClose = () => {
    setSelectedKoi(null);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === 'modal-overlay') {
      handleClose();
    }
  };

  const indexOfLastPond = currentPage * pondsPerPage;
  const indexOfFirstPond = indexOfLastPond - pondsPerPage;
  const currentPonds = lstPond?.slice(indexOfFirstPond, indexOfLastPond) || [];

  return (
    <div>
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, { name: "Food Calculator" }]}
      />
      <div className="flex justify-center items-center text-bold text-3xl h-full m-8">
        <strong>Food Calculator</strong>
      </div>

      {lstPond?.length > 0 && (!lstKoi || lstKoi.length === 0) && (
        <div className="flex flex-row items-center justify-center space-x-4">
          <div className="text-lg">You have no Koi</div>
          <Button 
            className="w-40 h-auto min-h-[2.5rem] py-2 px-4 border-black border-1 text-black rounded-full flex items-center justify-center font-bold text-lg"
            onClick={() => navigate('/add-koi')}
          >
            Add a Koi
          </Button>
        </div>
      )}

      <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-16 mb-2">
        {currentPonds.map((pond, index) => (
          <div key={index} className="text-center flex flex-col items-center">
            <div 
              className="w-full h-48 overflow-hidden cursor-pointer rounded-xl"
              onClick={() => handlePondClick(pond)}
            >
              <img
                src={pond.imageUrl}
                alt={pond.name}
                className="w-full h-full object-cover transition-transform duration-300 rounded-xl"
              />
            </div>
            <h3
              className="text-lg mt-2 cursor-pointer"
              onClick={() => handlePondClick(pond)}
            >
              {pond.name}
            </h3>
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-8">
        <Pagination
          current={currentPage}
          total={lstPond?.length || 0}
          pageSize={pondsPerPage}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>

      {isModalVisible && selectedPond && (
        <Modal
          visible={isModalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={800}
        >
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-xl font-bold text-center">{selectedPond.name}</div>
              <div className="text-xl font-bold text-center">Koi in pond</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex justify-center items-center ml-4 mr-4">
                <img
                  src={selectedPond.imageUrl}
                  alt={selectedPond.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {lstKoi?.filter(koi => koi.pondId === selectedPond.id).map((koi, index) => (
                  <div key={index} className="relative text-center">
                    <div className="w-20 h-20 mx-auto mb-2 overflow-hidden rounded-full shadow-md">
                      <img
                        onClick={() => handleClick(koi)}
                        src={koi.imageUrl}
                        alt={koi.name}
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </div>
                    <h3 className="text-sm cursor-pointer font-semibold truncate" onClick={() => handleClick(koi)}>
                      {koi.name}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 ml-4 flex flex-row items-center space-x-2">
              <div className="font-bold text-lg">Food Calculation:</div>
              {waterParameters && waterStandard && waterStandard.amountFedStandard !== undefined && waterStandard.amountFedStandard !== 0 ? (
                <div className="text-lg">
                  Recommended amount fed of {waterStandard.amountFedStandard} gram
                </div>
              ) : (
                <div className="text-lg">Add Koi to pond to calculate food</div>
              )}
            </div>
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
                    className="absolute top-2 right-2 text-2xl font-bold"
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
                      <p className="flex justify-between mb-1"><strong>Age:</strong> <span>{koiAge !== null ? `${koiAge} days` : 'Unknown'}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FoodCalculator;
