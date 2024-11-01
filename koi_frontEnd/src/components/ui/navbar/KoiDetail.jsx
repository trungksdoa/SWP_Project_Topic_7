import React, { useState } from 'react';
import { Card, Spin, Button } from 'antd';
import dayjs from 'dayjs';
import { useGetGrowth } from '../../../hooks/koi/useGetGrowth';
import KoiGrowthChart from '../manage/Chart';
import GrowthListModal from '../manage/KoiComponent/GrowthListModal';
import { LineChartOutlined, HistoryOutlined } from '@ant-design/icons';

const KoiDetail = ({ koi, isLoading }) => {
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [isGrowthListVisible, setIsGrowthListVisible] = useState(false);

  const {
    data: growthData,
    isLoading: isLoadingGrowth,
    isError,
    error
  } = useGetGrowth(koi?.id);

  const formatAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Unknown';
    const today = dayjs();
    const birthDate = dayjs(dateOfBirth);
    const months = today.diff(birthDate, 'month');
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    const parts = [];
    if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    if (remainingMonths > 0 || parts.length === 0) parts.push(`${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  if (isLoading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="h-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Koi Information</h2>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 pr-4">
          <img
            src={koi.imageUrl}
            alt={koi.name}
            className="w-full h-[250px] object-cover rounded-lg"
          />
        </div>
        <div className="md:w-1/2 mt-4 md:mt-0">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <strong>Name:</strong>
              <span>{koi.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <strong>Variety:</strong>
              <span>{koi.variety}</span>
            </div>
            <div className="flex justify-between items-center">
              <strong>Sex:</strong>
              <span>{koi.sex ? 'Female' : 'Male'}</span>
            </div>
            <div className="flex justify-between items-center">
              <strong>Length:</strong>
              <span>{koi.length} cm</span>
            </div>
            <div className="flex justify-between items-center">
              <strong>Weight:</strong>
              <span>{koi.weight} grams</span>
            </div>
            <div className="flex justify-between items-center">
              <strong>Purchase Price:</strong>
              <span>{koi.purchasePrice} VND</span>
            </div>
            <div className="flex justify-between items-center">
              <strong>Date of Birth:</strong>
              <span>{koi.dateOfBirth ? dayjs(koi.dateOfBirth).format('YYYY-MM-DD') : 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center">
              <strong>Age:</strong>
              <span>{formatAge(koi.dateOfBirth)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        <Button
          onClick={() => setIsChartVisible(true)}
          icon={<LineChartOutlined />}
          className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white 
                    rounded-full flex items-center justify-center font-bold"
        >
          Growth Chart
        </Button>
        <Button
          onClick={() => setIsGrowthListVisible(true)}
          icon={<HistoryOutlined />}
          className="w-40 h-auto min-h-[2.5rem] py-2 px-4 bg-black text-white 
                    rounded-full flex items-center justify-center font-bold"
        >
          Growth List
        </Button>
      </div>

      {/* Growth Chart Modal */}
      <KoiGrowthChart
        isVisible={isChartVisible}
        onClose={() => setIsChartVisible(false)}
        growthData={growthData}
        isError={isError}
        error={error}
        koiAge={koi.dateOfBirth}
      />

      {/* Growth List Modal */}
      <GrowthListModal
        growthData={growthData}
        isGrowthListVisible={isGrowthListVisible}
        hideGrowthList={() => setIsGrowthListVisible(false)}
        isOpenAddGrowthModal={() => {}} // Disabled for view-only mode
        refetchGrowthData={() => {}}    // Disabled for view-only mode
        isError={isError}
      />
    </div>
  );
};

export default KoiDetail;
