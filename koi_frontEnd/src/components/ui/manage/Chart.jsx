import React, { useState, useMemo } from 'react';
import { Modal, Select } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { assessKoiGrowth } from '../manage/growthAssessment';

const { Option } = Select;

const KoiGrowthChart = ({ isVisible, onClose, growthData, isLoading, isError, error, koiAge }) => {
  const [selectedYear, setSelectedYear] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const years = useMemo(() => {
    if (!growthData) return [];
    const uniqueYears = [...new Set(growthData.map(data => new Date(data.date).getFullYear()))];
    return uniqueYears.sort((a, b) => a - b);
  }, [growthData]);

  const filteredGrowthData = useMemo(() => {
    if (!growthData) return [];
    let filtered = growthData.filter(data => data.ageMonthHis > 0);
    if (selectedYear) {
      filtered = filtered.filter(data => new Date(data.date).getFullYear() === selectedYear);
    }
    return filtered;
  }, [growthData, selectedYear]);

  const getDateRange = () => {
    if (filteredGrowthData.length > 0) {
      const sortedData = [...filteredGrowthData].sort((a, b) => new Date(a.date) - new Date(b.date));
      return `${formatDate(sortedData[0].date)} to ${formatDate(sortedData[sortedData.length - 1].date)}`;
    }
    return '';
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const growthAssessment = useMemo(() => {
    return assessKoiGrowth(filteredGrowthData, koiAge);
  }, [filteredGrowthData, koiAge]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
          <p>Age: {label} months</p>
          <p>Length: {payload[0].value} cm</p>
          <p>Weight: {payload[1].value} kg</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Modal
      title={`Koi Growth Data ${selectedYear ? `(${selectedYear})` : ''}`}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {isLoading && <p>Loading growth data...</p>}
      {isError && <p>Error loading growth data: {error?.message}</p>}
      {!isLoading && !isError && filteredGrowthData.length > 0 ? (
        <>
          <Select
            style={{ width: 120, marginBottom: 16 }}
            placeholder="Select Year"
            onChange={handleYearChange}
            value={selectedYear}
          >
            <Option value={null}>All Years</Option>
            {years.map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
          <div style={{ marginBottom: 16 }}>
            <strong>Growth Assessment:</strong> {growthAssessment}
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageMonthHis" label={{ value: 'Age (months)', position: 'insideBottom', offset: -3 }} />
              <YAxis 
                yAxisId="left" 
                label={{ value: 'Length (cm)', angle: -90, position: 'insideLeft', offset: 0 }} 
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                label={{ value: 'Weight (kg)', angle: 90, position: 'insideRight', offset: 5 }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="length" stroke="#8884d8" name="Length (cm)" />
              <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#82ca9d" name="Weight (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <p>No growth data available for this koi.</p>
      )}
    </Modal>
  );
};

export default KoiGrowthChart;
