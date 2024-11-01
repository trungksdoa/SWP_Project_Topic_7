import React, { useState } from 'react';
import { Spin, Modal } from 'antd';

const PondDetail = ({ 
  pond, 
  isLoading, 
  waterParameters, 
  waterStandard, 
  foodStandard, 
  validationErrors,
  koiInSelectedPond,
  currentKoiPage,
  koisPerPage,
  handleKoiClick,
  handleKoiPageChange 
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleShowParameters = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  if (isLoading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center">
        <Spin size="large" />
        <p className="mt-4 text-gray-500"></p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-center">Pond Detail</h2>
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <img
            src={pond.imageUrl}
            alt={pond.name}
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
        <div className="md:w-1/2 mt-4 md:mt-0 md:ml-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <strong>Name:</strong>
              <span>{pond.name}</span>
            </div>
            <div className="flex justify-between">
              <strong>Width:</strong>
              <span>{pond.width} meters</span>
            </div>
            <div className="flex justify-between">
              <strong>Length:</strong>
              <span>{pond.length} meters</span>
            </div>
            <div className="flex justify-between">
              <strong>Depth:</strong>
              <span>{pond.depth} meters</span>
            </div>
            <div className="flex justify-between">
              <strong>Volume:</strong>
              <span>{pond.volume} cubic meters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Water Parameters and Food Section */}
      <div className="mt-4 mb-4 flex justify-between">
        <div className="md:w-1/2 flex justify-center">
          {waterParameters === null ? (
            <span className="text-gray-500 font-semibold">Hasn't added params</span>
          ) : validationErrors.length > 0 ? (
            <button
              className="bg-blue-600 text-sm px-2 rounded-full py-2 text-white hover:bg-blue-700 transition duration-200"
              onClick={handleShowParameters}
            >
              Parameters that don't meet standards
            </button>
          ) : (
            <span className="text-green-500 font-semibold">All parameters meet standards</span>
          )}
        </div>
        <div className="md:w-1/2 mt-4 md:mt-0 md:ml-6 flex justify-center">
          {foodStandard ? (
            foodStandard.amountFedStandard !== undefined && foodStandard.amountFedStandard > 0 ? (
              <div className="flex justify-between w-full">
                <span className="font-bold">Recommended Food:</span>
                <span>{foodStandard.amountFedStandard} grams</span>
              </div>
            ) : (
              <span className="text-gray-500 font-semibold">Hasn't added koi</span>
            )
          ) : (
            <span className="text-gray-500 font-semibold">Hasn't added koi</span>
          )}
        </div>
      </div>

      {/* Parameters Modal */}
      <Modal
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        <div className="p-4">
          <h3 className="text-xl font-bold mb-4">Parameters that don't meet standards:</h3>
          <div className="space-y-2">
            {validationErrors.map((error, index) => (
              <div
                key={index}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
              >
                {error}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Koi List Section */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-4">Koi in this pond</h3>
        {koiInSelectedPond.length > 0 ? (
          <div>
            <div className="flex flex-row flex-wrap gap-4 mb-4">
              {koiInSelectedPond
                .slice((currentKoiPage - 1) * koisPerPage, currentKoiPage * koisPerPage)
                .map((koi) => (
                  <div 
                    key={koi.id} 
                    className="flex flex-col items-center w-20 cursor-pointer"
                    onClick={() => handleKoiClick(koi)}
                  >
                    <img
                      src={koi.imageUrl}
                      alt={koi.name}
                      className="w-16 h-16 object-cover rounded-full mb-2"
                    />
                    <p className="text-center font-semibold text-sm truncate w-full">
                      {koi.name}
                    </p>
                  </div>
                ))}
            </div>
            
            {/* Koi Pagination */}
            {Math.ceil(koiInSelectedPond.length / koisPerPage) > 1 && (
              <div className="flex justify-center items-center gap-2">
                {Array.from({ length: Math.ceil(koiInSelectedPond.length / koisPerPage) }).map((_, index) => (
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
        ) : (
          <p className="text-center text-gray-500">This pond has no koi.</p>
        )}
      </div>
    </div>
  );
};

export default PondDetail;
