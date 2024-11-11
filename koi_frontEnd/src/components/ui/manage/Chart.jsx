import React, { useState, useMemo } from "react";
import { Modal, Select } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Customized,
} from "recharts";
import PropTypes from "prop-types";
const { Option } = Select;

const KoiGrowthChart = ({
  isVisible,
  onClose,
  growthData,
  isLoading,
  isError,
  error,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [displayMode, setDisplayMode] = useState("full");
  const [zoomLevel, setZoomLevel] = useState(1); // M?c ?? zoom m?c ??nh l� 1 (kh�ng zoom)

  const calculateStandardLength = (ageMonth) => {
    let initialLength = 4.0;
    let standardLength = initialLength;

    for (let month = 1; month <= ageMonth; month++) {
      if (month <= 2) {
        standardLength += initialLength * (2 - 1) / 2;
      } else if (month <= 6) {
        standardLength += 2.5;
      } else if (month <= 12) {
        standardLength += 1.5;
      } else {
        standardLength += 0.5;
      }
    }

    return Math.round(standardLength * 10) / 10;
  };

  const processedGrowthData = useMemo(() => {
    if (!growthData || growthData.length < 2) return [];

    return growthData.map((data) => {
      const standardLength = calculateStandardLength(data.ageMonthHis);
      const difference = Math.round((data.length - standardLength) * 10) / 10;

      return {
        ...data,
        standardLength,
        difference,
      };
    });
  }, [growthData]);

  const filteredGrowthData = useMemo(() => {
    if (!processedGrowthData || processedGrowthData.length === 0) return [];

    let filtered = processedGrowthData;
    if (selectedStartDate && selectedEndDate) {
      filtered = processedGrowthData.filter(
        (data) =>
          new Date(data.date) >= new Date(selectedStartDate) &&
          new Date(data.date) <= new Date(selectedEndDate)
      );
    }
    return filtered;
  }, [processedGrowthData, selectedStartDate, selectedEndDate]);

  const handleStartDateChange = (startDate) => {
    setSelectedStartDate(startDate);
  };

  const handleEndDateChange = (endDate) => {
    setSelectedEndDate(endDate);
  };

  const handleDisplayModeChange = (mode) => {
    setDisplayMode(mode);
  };

  // H�m x? l� s? ki?n cu?n chu?t
  const handleWheel = (e) => {
    if (e.deltaY > 0) {
      // Cu?n xu?ng, thu nh?
      setZoomLevel((prevZoom) => Math.min(prevZoom * 1.1, 5)); // Gi?i h?n zoom t?i ?a l� 5
    } else {
      // Cu?n l�n, ph�ng to
      setZoomLevel((prevZoom) => Math.max(prevZoom / 1.1, 1)); // Gi?i h?n zoom t?i thi?u l� 1
    }
  };

  return (
    <Modal
      title="Koi Growth Data Comparison"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={1200}
    >
      {isLoading && <p>Loading growth data...</p>}
      {isError && <p>Error loading growth data: {error?.message}</p>}
      <div className="flex gap-4 mb-4">
        <Select
          style={{ width: 150 }}
          placeholder="Select Start Date"
          onChange={handleStartDateChange}
          value={selectedStartDate}
        >
          {processedGrowthData.map((data) => (
            <Option key={data.date} value={data.date}>
              {data.date} ({data.length}cm)
            </Option>
          ))}
        </Select>

        <Select
          style={{ width: 150 }}
          placeholder="Select End Date"
          onChange={handleEndDateChange}
          value={selectedEndDate}
        >
          {processedGrowthData.map((data) => (
            <Option key={data.date} value={data.date}>
              {data.date} ({data.length}cm)
            </Option>
          ))}
        </Select>

        <Select
          style={{ width: 150 }}
          placeholder="Display Mode"
          onChange={handleDisplayModeChange}
          value={displayMode}
        >
          <Option value="actual">Actual</Option>
          <Option value="standard">Standard</Option>
          <Option value="full">Full</Option>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height={400} onWheel={handleWheel}>
        <LineChart data={filteredGrowthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="ageMonthHis"
            label={{
              value: "Age (months)",
              position: "insideBottom",
              offset: -3,
            }}
            domain={['auto', 'auto']} // ?i?u ch?nh ph?m vi tr?c X t? ??ng
            interval={zoomLevel > 1 ? Math.ceil(zoomLevel) : 1} // ?i?u ch?nh kho?ng c�ch gi?a c�c m?c theo zoom
          />
          <YAxis
            label={{
              value: "Length (cm)",
              angle: -90,
              position: "insideLeft",
              offset: 0,
            }}
            domain={['auto', 'auto']} // ?i?u ch?nh ph?m vi tr?c Y t? ??ng
            allowDataOverflow={true} // Cho ph�p tr?c Y m? r?ng
            tickCount={zoomLevel > 1 ? 10 : 5} // ?i?u ch?nh s? l??ng c�c m?c theo m?c zoom
          />
          <Tooltip />
          <Legend />

          {(displayMode === "actual" || displayMode === "full") && (
            <Line
              type="monotone"
              dataKey="length"
              stroke="#8884d8"
              name="Actual Length"
              connectNulls
            />
          )}
          {(displayMode === "standard" || displayMode === "full") && (
            <Line
              type="monotone"
              dataKey="standardLength"
              stroke="#82ca9d"
              name="Standard Length"
              connectNulls
            />
          )}
        </LineChart>
      </ResponsiveContainer>
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
};

export default KoiGrowthChart;