import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import UserDataChart from "./UserChart.jsx";
import ProductChart from "./ProductChart.jsx";
import OrderChart from "./OrderChart.jsx";
import dayjs from "dayjs";

import { useGetTotalSales } from "../../hooks/order/useGetTotalSales";
const { Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const AdminDashboard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const defaultStartDate = useMemo(() => dayjs("2024-09-01"), []);
  const [dateRange, setDateRange] = useState([defaultStartDate, dayjs()]);

  const {
    data: totalSalesData,
    isLoading,
    isError,
    refetch,
  } = useGetTotalSales(
    dateRange[0].format("YYYY/MM/DD"),
    dateRange[1].format("YYYY/MM/DD")
  );

  useEffect(() => {
    if (totalSalesData && totalSalesData.data) {

      console.log(totalSalesData.data)
      const total = totalSalesData.data.reduce(
        (sum, item) => sum + item.count,
        0
      );
      setTotalSales(total);
    }
  }, [totalSalesData]);

  const [topProduct, setTopProduct] = useState({ name: "", value: 0 });
  const [averageUsersPerDay, setAverageUsersPerDay] = useState(0);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    refetch();
  };

  const handleTotalOrdersChange = (newTotalOrders) => {
    setTotalOrders(newTotalOrders);
  };

  const handleTotalUsersChange = (newTotalUsers) => {
    setTotalUsers(newTotalUsers);
  };

  const handleTopProductChange = (newTopProduct) => {
    setTopProduct(newTopProduct);
  };

  const handleAverageUsersPerDayChange = (newAverage) => {
    setAverageUsersPerDay(newAverage);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px" }}>
        <Title level={2}>Admin Dashboard</Title>

        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={8} md={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={totalUsers}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card>
              <Statistic
                title="Total Orders"
                value={totalOrders}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card>
              <Statistic
                title="Total Sales"
                // Format vnd
                value={totalSales.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                prefix={<DollarOutlined />}
                precision={2}
              />
              <RangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                style={{ marginTop: "10px" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card>
              <Statistic
                title="Avg Users/Day"
                value={averageUsersPerDay}
                prefix={<RiseOutlined />}
                precision={0}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Card>
              <Statistic
                title="Top Product"
                value={topProduct.name}
                suffix={`(${topProduct.value} sales)`}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="User Growth" style={{ marginBottom: "16px" }}>
              <UserDataChart
                onTotalUsersChange={handleTotalUsersChange}
                onAverageUsersPerDayChange={handleAverageUsersPerDayChange}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Product Sales" style={{ marginBottom: "16px" }}>
              <ProductChart onTopProductChange={handleTopProductChange} />
            </Card>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Card title="Order Statistics">
              <OrderChart onTotalOrdersChange={handleTotalOrdersChange} />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
