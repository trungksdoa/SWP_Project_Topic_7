import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetAllKoi } from "../../../hooks/koi/useGetAllKoi";
import { useGetAllPond } from "../../../hooks/koi/useGetAllPond";
import { Button, Spin, Pagination, Select, Space } from "antd";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';

const { Option } = Select;

const KoiManagement = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const { data: lstKoi, refetch, isFetching } = useGetAllKoi(userId);
  const { data: lstPond } = useGetAllPond(userId);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const koiPerPage = 8;

  useEffect(() => {
    refetch();
  }, [refetch]);

  const sortedKoi = useMemo(() => {
    if (!lstKoi) return [];
    return [...lstKoi].sort((a, b) => {
      let comparison = 0;
      switch (sortCriteria) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'length':
          comparison = a.length - b.length;
          break;
        case 'weight':
          comparison = a.weight - b.weight;
          break;
        case 'age':
          comparison = new Date(a.dateOfBirth) - new Date(b.dateOfBirth);
          break;
        case 'dateCreated':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [lstKoi, sortCriteria, sortOrder]);

  const indexOfLastKoi = currentPage * koiPerPage;
  const indexOfFirstKoi = indexOfLastKoi - koiPerPage;
  const currentKoi = sortedKoi.slice(indexOfFirstKoi, indexOfLastKoi);

  const handleAddClick = () => {
    navigate('/add-koi');
  };

  const handleClick = (koi) => {
    navigate(`/update-koi/${koi.id}`, { state: { koi } });
  };

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (value) => {
    setSortCriteria(value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (isFetching) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

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
      
          <div className="flex justify-between items-center mx-4 my-6">
            <div className="w-1/3"></div> {/* Empty div for spacing */}
            <div className="flex justify-center items-center w-1/3">
              <button
                onClick={handleAddClick}
                className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white 
                          rounded-full flex items-center justify-center font-bold mr-2"
              >
                Add a new Koi
              </button>
              <button
                onClick={() => navigate('/move-koi')}
                className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-orange-500 text-white 
                          rounded-full flex items-center justify-center font-bold ml-2"
              >
                Move Koi
              </button>
            </div>
            <div className="flex justify-end items-center w-1/3">
              <Space>
                <Select
                  defaultValue="name"
                  style={{ width: 120 }}
                  onChange={handleSortChange}
                >
                  <Option value="name">Name</Option>
                  <Option value="length">Length</Option>
                  <Option value="weight">Weight</Option>
                  <Option value="age">Age</Option>
                  <Option value="dateCreated">Date Created</Option>
                </Select>
                <Button onClick={toggleSortOrder}>
                  {sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                </Button>
              </Space>
            </div>
          </div>

          <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-16">
            {currentKoi.map((koi, index) => (
              <div key={index} className="text-center flex flex-col items-center">
                <div 
                  className="w-full h-48 overflow-hidden cursor-pointer rounded-xl"
                  onClick={() => handleClick(koi)}
                >
                  <img
                    src={koi.imageUrl}
                    alt={koi.name}
                    className="w-full h-full object-cover transition-transform duration-300 rounded-xl"
                  />
                </div>
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
              total={sortedKoi.length}
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
