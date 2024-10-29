import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Spin,
  Divider,
  DatePicker,
  Space,
  Button,
} from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import dayjs from "dayjs";

import { useGetTopSaleProduct } from "../../hooks/product/useGetTopSaleProduct";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d", "#722ed1"];

const ProductChart = ({ dateRange, onDateRangeChange, setTopProduct, productData, isLoading, isError, refetch }) => {
  const fixedStartDate = useMemo(() => dayjs("2020-01-01"), []);  
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (productData) {
      const formattedData = productData.data.map((item) => ({
        name: item.label,
        value: item.count,
        date: dayjs(item.date).format("YYYY-MM-DD"),
      }));

      setFilteredData(formattedData);

      // Sort data by value in descending order and take top 3
      const topThreeProducts = formattedData.length > 0 
        ? [...formattedData]
            .sort((a, b) => b.value - a.value)
            .slice(0, 3)
            .map(product => ({
              name: product.name,
              value: product.value
            }))
        : [
            { name: "No products yet", value: 0 },
            { name: "No products yet", value: 0 }, 
            { name: "No products yet", value: 0 }
          ];

      // Pad with empty products if less than 3
      while (topThreeProducts.length < 3) {
        topThreeProducts.push({ name: "No products yet", value: 0 });
      }

      setTopProduct(topThreeProducts);
    }
  }, [productData, setTopProduct]);

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      onDateRangeChange(dates);
    }
  };

  const formatXAxis = (tickItem) => {
    return dayjs(tickItem).format("MMM DD");
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Error loading data. Please try again later.</div>;

  const rangePresets = [
    { label: "Last 7 Days", value: [dayjs().subtract(6, "day"), dayjs()] },
    { label: "Last 30 Days", value: [dayjs().subtract(29, "day"), dayjs()] },
    {
      label: "This Month",
      value: [dayjs().startOf("month"), dayjs().endOf("month")],
    },
    {
      label: "Last Month",
      value: [
        dayjs().subtract(1, "month").startOf("month"),
        dayjs().subtract(1, "month").endOf("month"),
      ],
    },
    { label: "Last 3 Months", value: [dayjs().subtract(3, "month"), dayjs()] },
    { label: "Last 6 Months", value: [dayjs().subtract(6, "month"), dayjs()] },
    {
      label: "Last 12 Months", 
      value: [dayjs().subtract(12, "month"), dayjs()],
    },
    { label: "All Time", value: [fixedStartDate, dayjs()] },
  ];

  return (
    <div>
      <Row justify="center" style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={24} md={20} lg={16} xl={12}>
          <Space size={12} style={{ width: "100%", justifyContent: "center" }}>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="YYYY/MM/DD"
              disabledDate={disabledDate}
              presets={rangePresets}
              style={{ width: "300px" }}
            />
            <Button
              type="primary"
              onClick={refetch}
              style={{ minWidth: "120px" }}
            >
              Fetch Data
            </Button>
          </Space>
        </Col>
      </Row>
      <Divider style={{ marginBottom: "24px" }} />
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card 
            title={<Title level={4}>Top Selling Products</Title>} 
            className="chart-card"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderRadius: "12px" }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={filteredData.filter(item => item.value > 0)} // Only show products with sales
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={140}
                  innerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(1)}%)`
                  }
                  paddingAngle={2}
                >
                  {filteredData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} sales`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title={<Title level={4}>Sales Trend Over Time</Title>} 
            className="chart-card"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderRadius: "12px" }}
          >
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatXAxis}
                  interval="preserveStartEnd"
                  stroke="#666"
                />
                <YAxis stroke="#666" />
                <Tooltip
                  labelFormatter={(label) => dayjs(label).format("YYYY-MM-DD")}
                  contentStyle={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.96)",
                    border: "1px solid #f0f0f0",
                    borderRadius: "4px"
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Sales"
                  stroke="#1890ff"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#1890ff" }}
                  activeDot={{ r: 6, fill: "#1890ff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductChart;
