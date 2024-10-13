import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond";
import { Button, Spin, Pagination } from "antd";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const KoiManagement = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const { data: lstKoi, refetch, isFetching } = useGetAllKoi(userId);
  const { data: lstPond } = useGetAllPond(userId);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const koiPerPage = 8;

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleAddClick = () => {
    navigate('/add-koi');
  };

  const handleClick = (koi) => {
    navigate(`/update-koi/${koi.id}`, { state: { koi } });
  };

  if (isFetching) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  const indexOfLastKoi = currentPage * koiPerPage;
  const indexOfFirstKoi = indexOfLastKoi - koiPerPage;
  const currentKoi = lstKoi ? lstKoi.slice(indexOfFirstKoi, indexOfLastKoi) : [];

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex justify-center items-center text-bold text-3xl h-full m-8">
        <strong>Koi Management</strong>
      </div>
      
      {lstPond?.length === 0 ? (
        <div className="flex items-center space-x-4 justify-center py-10">
          <div className="font-bold mb-5 text-2xl">
            {t("You don't have any pond yet.")} 
          </div>
          <Button 
            className="bg-black text-white py-4 rounded-md mb-6 font-bold text-2xl"
            onClick={() => navigate('/pond-management')}
          >
            {t("Create a pond first!")}
          </Button>
        </div>
      ) : lstKoi?.length === 0 ? (
        <div className="flex items-center space-x-4 justify-center py-10">
          <div className="font-bold mb-5 text-2xl">
            {t("You have no koi yet.")} 
          </div>
          <Button 
            className="bg-black text-white py-4 rounded-md mb-6 font-bold text-2xl"
            onClick={handleAddClick}
          >
            {t("Let's add koi!")}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center">
            <button
              onClick={handleAddClick}
              className="w-50 h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white 
                        rounded-full flex items-center justify-center font-bold"
            >
              Add a new Koi
            </button>
            <button
            onClick={() => navigate('/move-koi')}
            className="w-50 h-auto min-h-[2.5rem] py-2 px-4 bg-orange-500 text-white 
                      rounded-full flex items-center justify-center font-bold ml-4"
            >
              Move Koi
            </button>
          </div>

          <div className="container grid grid-cols-4 gap-6 my-16">
            {currentKoi.map((koi, index) => (
              <div key={index} className="text-center">
                <img
                  onClick={() => handleClick(koi)}
                  src={koi.imageUrl}
                  alt={koi.name}
                  className="w-[100%] max-h-[200px] object-cover cursor-pointer"
                />
                <h3
                  className="text-lg mt-2 cursor-pointer"
                  onClick={() => handleClick(koi)}
                >
                  {koi.name}
                </h3>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8 mb-8">
            <Pagination
              current={currentPage}
              total={lstKoi ? lstKoi.length : 0}
              pageSize={koiPerPage}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default KoiManagement;
