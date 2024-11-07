import React, { useState, useMemo } from 'react';
import { Modal, Select } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
const { Option } = Select

const KoiGrowthChart = ({ isVisible, onClose, growthData, isLoading, isError, error, koiAge }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedHistories, setSelectedHistories] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const calculateStandardLength = (ageMonths) => {
    let standardLength = 3.5;
    
    // Đảm bảo ageMonths là số
    ageMonths = Number(ageMonths) || 0;
    
    for (let month = 1; month <= ageMonths; month++) {
      if (month <= 2) {
        standardLength *= 1.5; // Điều chỉnh tỷ lệ tăng trưởng
      } else if (month <= 6) {
        standardLength += 2;
      } else if (month <= 12) {
        standardLength += 1;
      } else {
        standardLength += 0.5;
      }
    }
    
    return Math.round(standardLength * 10) / 10; // Làm tròn 1 số thập phân
  };
  const calculateGrowthRate = (currentLength, previousLength, previousAge, currentAge) => {
    const expectedGrowth = calculateExpectedGrowth(previousLength, previousAge, currentAge);
    const actualGrowth = currentLength - previousLength;
    const growthDiff = ((actualGrowth - expectedGrowth) / expectedGrowth) * 100;

    if (growthDiff <= -10) return "Slow growth";
    if (growthDiff >= 10) return "Fast growth";
    return "Normal growth";
  };

  const calculateExpectedGrowth = (previousLength, previousAgeMonth, currentAgeMonth) => {
    let expectedGrowth = 0.0;

    for (let ageMonth = previousAgeMonth + 1; ageMonth <= currentAgeMonth; ageMonth++) {
      if (ageMonth <= 2) {
        expectedGrowth += previousLength * (2 - 1) / 2;
      } else if (ageMonth <= 6) {
        expectedGrowth += 2.5;
      } else if (ageMonth <= 12) {
        expectedGrowth += 1.5;
      } else {
        expectedGrowth += 0.5;
      }
    }

    return expectedGrowth;
  };

  const processedGrowthData = useMemo(() => {
    if (!growthData || growthData.length < 2) return [];

    return growthData.map((data, index) => {
      const standardLength = calculateStandardLength(data.ageMonthHis);
      
      let growthRate = "Initial";
      if (index > 0) {
        const prevData = growthData[index - 1];
        growthRate = calculateGrowthRate(
          data.length,
          prevData.length,
          prevData.ageMonthHis,
          data.ageMonthHis
        );
      }

      return {
        ...data,
        standardLength,
        growthRate
      };
    });
  }, [growthData]);

  const years = useMemo(() => {
    if (!growthData) return [];
    const uniqueYears = [...new Set(growthData.map(data => new Date(data.date).getFullYear()))];
    return uniqueYears.sort((a, b) => a - b);
  }, [growthData]);

  const filteredGrowthData = useMemo(() => {
    if (!processedGrowthData) return [];
    let filtered = processedGrowthData.filter(data => data.ageMonthHis > 0);
    if (selectedYear) {
      filtered = filtered.filter(data => new Date(data.date).getFullYear() === selectedYear);
    }
    return filtered;
  }, [processedGrowthData, selectedYear]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedHistories([]);
  };

  const handleHistoryChange = (selectedDates) => {
    setSelectedHistories(selectedDates);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
          <p><strong>Age:</strong> {label} months</p>
          {payload.map((entry, index) => (
            <p key={index}>
              <strong>{entry.name}:</strong> {entry.value} cm
              {entry.dataKey.startsWith('length_') && (
                <>
                  <br />
                  <strong>Growth Rate:</strong> {entry.payload[`growthRate_${entry.dataKey.split('_')[1]}`]}
                  <br /> 
                  <strong>Date:</strong> {formatDate(entry.payload[`date_${entry.dataKey.split('_')[1]}`])}
                </>
              )}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartData = useMemo(() => {
    if (!filteredGrowthData || filteredGrowthData.length === 0) return [];
    
    if (selectedHistories.length === 0) {
      return filteredGrowthData.map(data => ({
        ageMonthHis: data.ageMonthHis,
        length: data.length,
        standardLength: data.standardLength,
        date: data.date,
        growthRate: data.growthRate
      }));
    }

    // Get all unique age months from selected histories
    const allAgeMonths = Array.from(new Set(
      filteredGrowthData
        .filter(data => selectedHistories.includes(data.date))
        .map(data => data.ageMonthHis)
    )).sort((a, b) => a - b);

    // Create data points for each age month
    return allAgeMonths.map(age => {
      const dataPoint = {
        ageMonthHis: age,
        standardLength: calculateStandardLength(age)
      };

      // Add data for each selected history
      selectedHistories.forEach((date, index) => {
        const historyData = filteredGrowthData.find(data => 
          data.date === date && data.ageMonthHis === age
        );
        if (historyData) {
          dataPoint[`length_${index}`] = historyData.length;
          dataPoint[`date_${index}`] = historyData.date;
          dataPoint[`growthRate_${index}`] = historyData.growthRate;
        }
      });

      return dataPoint;
    });
  }, [filteredGrowthData, selectedHistories]);

  const renderChart = (data) => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="ageMonthHis" label={{ value: 'Age (months)', position: 'insideBottom', offset: -3 }} />
        <YAxis label={{ value: 'Length (cm)', angle: -90, position: 'insideLeft', offset: 0 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {selectedHistories.length === 0 ? (
          <>
            <Line type="monotone" dataKey="length" stroke="#8884d8" name="Actual Length" connectNulls />
            <Line type="monotone" dataKey="standardLength" stroke="#82ca9d" name="Standard Length" connectNulls />
          </>
        ) : (
          <>
            {selectedHistories.map((date, index) => (
              <Line 
                key={date}
                type="monotone" 
                dataKey={`length_${index}`}
                stroke={`hsl(${(index * 137.5) % 360}, 70%, 50%)`}
                name={`Length (${formatDate(date)})`}
                connectNulls
              />
            ))}
            <Line type="monotone" dataKey="standardLength" stroke="#82ca9d" name="Standard Length" connectNulls />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <Modal
      title={`Koi Growth Data Comparison ${selectedYear ? `(${selectedYear})` : ''}`}
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={1200}
    >
      {isLoading && <p>Loading growth data...</p>}
      {isError && <p>Error loading growth data: {error?.message}</p>}
      <>
        <div className="flex gap-4 mb-4">
          <Select
            style={{ width: 120 }}
            placeholder="Select Year"
            onChange={handleYearChange}
            value={selectedYear}
          >
            <Option value={null}>All Years</Option>
            {years.map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>

          <Select
            mode="multiple"
            style={{ width: 300 }}
            placeholder="Select Chart Points"
            onChange={handleHistoryChange}
            value={selectedHistories}
            maxTagCount={1}
            maxTagTextLength={20}
            maxTagPlaceholder={`${selectedHistories.length} points selected`}
          >
            {filteredGrowthData.map(data => (
              <Option 
                key={data.date} 
                value={data.date}
              >
                {formatDate(data.date)} ({data.length}cm)
              </Option>
            ))}
          </Select>
        </div>

        <div>
          {renderChart(chartData)}
        </div>
      </>
    </Modal>
  );
};

KoiGrowthChart.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  growthData: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  error: PropTypes.object,
  koiAge: PropTypes.number,
};

export default KoiGrowthChart;