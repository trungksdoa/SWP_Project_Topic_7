import React, { useState, useEffect } from "react";
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
} from "recharts";
import dayjs from "dayjs";
import { useGetUserGrowth } from "../../hooks/user/useGetUserGrowth";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const UserDataChart = ({ onTotalUsersChange, onAverageUsersPerDayChange }) => {
  const defaultStartDate = dayjs("2024-09-01");
  const [dateRange, setDateRange] = useState([defaultStartDate, dayjs()]);
  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  
  const {
    data: userGrowthData,
    isLoading,
    isError,
    refetch,
  } = useGetUserGrowth(
    dateRange[0].format("YYYY/MM/DD"),
    dateRange[1].format("YYYY/MM/DD")
  );

  useEffect(() => {
    if (userGrowthData) {
      const formattedData = userGrowthData.data.map((item) => ({
        date: dayjs(item.date).format("YYYY-MM-DD"),
        count: item.count,
      }));
      setChartData(formattedData);
      setFilteredData(formattedData);

      onTotalUsersChange(totalUsers);
      onAverageUsersPerDayChange(averageUsersPerDay);
    }
  }, [userGrowthData, onTotalUsersChange, onAverageUsersPerDayChange]);

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
      const filtered = chartData.filter((item) =>
        dayjs(item.date).isBetween(dates[0], dates[1], null, "[]")
      );
      setFilteredData(filtered);
    }
  };

  const formatXAxis = (tickItem) => {
    return dayjs(tickItem).format("MMM DD");
  };

  if (isLoading) return <Spin size="large" />;
  if (isError) return <div>Error loading data. Please try again later.</div>;

  const totalUsers = filteredData.reduce((sum, item) => sum + item.count, 0);
  const averageUsersPerDay =
    filteredData.length > 0 ? Math.round(totalUsers / filteredData.length) : 0;



    const rangePresets = [
        { label: 'Last 7 Days', value: [dayjs().subtract(6, "day"), dayjs()] },
        { label: 'Last 30 Days', value: [dayjs().subtract(29, "day"), dayjs()] },
        { label: 'This Month', value: [dayjs().startOf("month"), dayjs().endOf("month")] },
        { label: 'Last Month', value: [dayjs().subtract(1, "month").startOf("month"), dayjs().subtract(1, "month").endOf("month")] },
        { label: 'Last 3 Months', value: [dayjs().subtract(3, "month"), dayjs()] },
        { label: 'Last 6 Months', value: [dayjs().subtract(6, "month"), dayjs()] },
        { label: "Last 12 Months", value: [dayjs().subtract(12, "month"), dayjs()] },
        { label: "All Time", value: [defaultStartDate, dayjs()] },
  ];

  return (
    <div>
      <Title level={2} style={{ marginBottom: "24px", color: "#1890ff" }}>
        User Growth
      </Title>
      <Row justify="center" style={{ marginBottom: "20px" }}>
        <Col xs={24} sm={24} md={20} lg={16} xl={12}>
          <Space size={12} style={{ width: "100%", justifyContent: "center" }}>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              format="YYYY/MM/DD"
              style={{ width: "calc(100% - 6px)" }} // Adjusted width
              presets={rangePresets}
              onCalendarChange={(dates) => {
                if (dates && dates.length === 2) {
                  setDateRange(dates);
                }
              }}
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
        <Col xs={24} md={6}>
          <Card title="Total Users" className="stat-card">
            <Title level={4}>100</Title>
          </Card>
          <Card
            style={{ marginTop: "10px" }}
            title="Average Users per Day"
            className="stat-card"
          >
            <Title level={4}>{averageUsersPerDay}</Title>
          </Card>

        </Col>
        <Col xs={24} md={18}>
          <Card title="User Growth Over Time" className="chart-card">
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
                  dataKey="count"
                  name="New Users"
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

export default UserDataChart;
