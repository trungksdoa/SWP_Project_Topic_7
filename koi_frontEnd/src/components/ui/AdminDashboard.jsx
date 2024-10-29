import React, { useState, useEffect, useMemo } from "react";
import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Space,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
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
  const [topProduct, setTopProduct] = useState({ name: "", value: 0 });
  const [averageUsersPerDay, setAverageUsersPerDay] = useState(0);

  const {
    data: totalSalesData,
    isLoading,
    refetch,
  } = useGetTotalSales(
    dateRange[0].format("YYYY/MM/DD"),
    dateRange[1].format("YYYY/MM/DD")
  );

  useEffect(() => {
    if (totalSalesData?.data) {
      const total = totalSalesData.data.reduce(
        (sum, item) => sum + item.count,
        0
      );
      setTotalSales(total);
    }
  }, [totalSalesData]);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    refetch();
  };

  const StatCard = ({ title, value, prefix, suffix, loading }) => (
    <Card 
      hoverable 
      className="dashboard-stat-card"
      style={{
        height: "100%",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      <Statistic
        title={<span style={{ fontSize: "16px", color: "#666" }}>{title}</span>}
        value={value}
        prefix={prefix}
        suffix={suffix}
        loading={loading}
        valueStyle={{ color: "#1890ff", fontSize: "24px" }}
      />
    </Card>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Content style={{ padding: "24px" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title level={2} style={{ margin: 0 }}>Admin Dashboard</Title>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              style={{ width: "300px" }}
            />
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Total Orders"
                value={totalOrders}
                prefix={<ShoppingCartOutlined style={{ fontSize: "24px" }} />}
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Total Sales"
                value={totalSales.toLocaleString("vi-VN", { 
                  style: "currency", 
                  currency: "VND" 
                })}
                prefix={<DollarOutlined style={{ fontSize: "24px" }} />}
                loading={isLoading}
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <StatCard
                title="Top Product"
                value={topProduct.name}
                suffix={`(${topProduct.value} sales)`}
                prefix={<RiseOutlined style={{ fontSize: "24px" }} />}
              />
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Card 
                title="User Growth" 
                style={{ 
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <UserDataChart
                  onTotalUsersChange={setTotalUsers}
                  onAverageUsersPerDayChange={setAverageUsersPerDay}
                />
              </Card>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Card 
                title="Product Sales" 
                style={{ 
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
              >
                <ProductChart onTopProductChange={setTopProduct} />
              </Card>
            </Col>
          </Row>

          <Row>
            <Col span={24}>
              <Card 
                title="Order Statistics"
                style={{ 
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
              >
                <OrderChart onTotalOrdersChange={setTotalOrders} />
              </Card>
            </Col>
          </Row>
        </Space>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;