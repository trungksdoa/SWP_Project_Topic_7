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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const ProductChart = ({ onTopProductChange }) => {
  const fixedStartDate = useMemo(() => dayjs("2020-01-01"), []);
  const [dateRange, setDateRange] = useState(() => [fixedStartDate, dayjs()]);

  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const {
    data: topSellingProductsData,
    isLoading,
    isError,
    refetch,
  } = useGetTopSaleProduct(
    dateRange[0].format("YYYY/MM/DD"),
    dateRange[1].format("YYYY/MM/DD")
  );

  useEffect(() => {
    if (topSellingProductsData) {
      const formattedData = topSellingProductsData.data.map((item) => ({
        name: item.label,
        value: item.count,
        date: dayjs(item.date).format("YYYY-MM-DD"),
      }));
      setChartData(formattedData);
      setFilteredData(formattedData);
      onTopProductChange(topProduct);
    }
  }, [topSellingProductsData, onTopProductChange]);

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    }
  };

  const formatXAxis = (tickItem) => {
    return dayjs(tickItem).format("MMM DD");
  };

  const disabledDate = (current) => {
    // Chỉ vô hiệu hóa các ngày trong tương lai
    return current && current > dayjs().endOf("day");
  };

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Error loading data. Please try again later.</div>;

  const topProduct = filteredData.reduce(
    (max, item) => (max.value > item.value ? max : item),
    { value: 0 }
  );

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
      <Title level={2} style={{ marginBottom: "24px", color: "#1890ff" }}>
        Product Sales
      </Title>
      <Row justify="center" style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={24} md={20} lg={16} xl={12}>
          <Space size={12} style={{ width: "100%", justifyContent: "center" }}>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="YYYY/MM/DD"
              disabledDate={disabledDate}
              presets={rangePresets}
            />
            <Button
              type="primary"
              onClick={refetch}
              style={{ width: "calc(100% - 6px)" }}
            >
              Fetch Data
            </Button>
          </Space>
        </Col>
      </Row>
      <Divider style={{ marginBottom: "24px" }} />
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card title="Top Selling Products" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {filteredData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Card title="Sales Trend Over Time" className="chart-card">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatXAxis}
                  interval="preserveStartEnd"
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => dayjs(label).format("YYYY-MM-DD")}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Sales"
                  stroke="#1890ff"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
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
