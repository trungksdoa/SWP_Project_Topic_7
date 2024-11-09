import React, { useState, useEffect, useMemo } from "react";
import { VN } from 'country-flag-icons/react/3x2'
import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Space,
  Button,
  Tabs
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
import { useGetOrderStatusChart } from "../../hooks/order/useGetOrderStatusChart";
import { useGetTopSaleProduct } from "../../hooks/product/useGetTopSaleProduct";
import { useGetUserGrowth } from "../../hooks/user/useGetUserGrowth";
import PropTypes from "prop-types";
const { Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const DEFAULT_START_DATE = "2024-09-01";

{/* ===== Stat Card Components ===== */}
const StatCard = React.memo(({ title, value, prefix, suffix, loading }) => (
  <Card
    hoverable
    className="dashboard-stat-card"
    style={{
      height: "100%",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      padding: "12px"
    }}
  >
    <Statistic
      title={<span style={{ fontSize: "16px", color: "#666", fontWeight: "500" }}>{title}</span>}
      value={value}
      prefix={prefix}
      suffix={suffix && <span style={{ fontSize: "14px", color: "#8c8c8c" }}>{suffix}</span>}
      loading={loading}
      valueStyle={{
        color: "#1890ff",
        fontSize: "20px",
        fontWeight: "600",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "100%"
      }}
    />
  </Card>
));
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  loading: PropTypes.bool,
};
StatCard.displayName = 'StatCard';

{/* ===== Top Product Card Component ===== */}
const StatCardTopProduct = React.memo(({ title, value, prefix, suffix, loading }) => {
  if(value === undefined) {
    value = 0;
  };
  
  const totalSales = value.reduce((sum, product) => sum + product.value, 0);

  const renderTopProducts = () => {
    if (Array.isArray(value)) {
      const hasAnySales = value.some(product => product.value > 0);
      
      if (!hasAnySales) {
        return <span style={{ fontSize: '14px', color: '#8c8c8c' }}>No sales data</span>;
      }

      return value.map((product, index) => (
        product.value > 0 && (
          <div key={index} style={{ marginTop: index > 0 ? '8px' : '0' }}>
            <span style={{ fontSize: '14px', color: '#1890ff' }}>
              {`${index + 1}. ${product.name}`}
            </span>
            <span style={{ marginLeft: '8px', fontSize: '14px', color: '#8c8c8c' }}>
              ({product.value} sales)
            </span>
          </div>
        )
      )).filter(Boolean);
    }
    return <span style={{ fontSize: '20px' }}>{value || 'No sales data'}</span>;
  };

  return (
    <Card
      hoverable
      className="dashboard-stat-card"
      style={{
        height: "100%",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "12px"
      }}
    >
      <Statistic
        title={<span style={{ fontSize: "16px", color: "#666", fontWeight: "500" }}>{title}</span>}
        value={totalSales}
        prefix={prefix}
        suffix={suffix}
        loading={loading}
        valueStyle={{
          color: "#1890ff",
          fontSize: "20px",
          fontWeight: "600",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%"
        }}
      />
      {renderTopProducts()}
    </Card>
  );
});
StatCardTopProduct.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.array.isRequired,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  loading: PropTypes.bool,
};
StatCardTopProduct.displayName = 'StatCardTopProduct';

{/* ===== Main Dashboard Component ===== */}
const AdminDashboard = () => {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const defaultStartDate = useMemo(() => dayjs(DEFAULT_START_DATE), []);
  const [dateRange, setDateRange] = useState([defaultStartDate, dayjs()]);
  const [activeTab, setActiveTab] = useState('1');

  const [topProduct, setTopProduct] = useState([
    { name: "", value: 0 },
    { name: "", value: 0 },
    { name: "", value: 0 },
  ]);

  const formattedStartDate = dateRange[0].format("YYYY/MM/DD");
  const formattedEndDate = dateRange[1].format("YYYY/MM/DD");

  {/* ===== API Hooks ===== */}
  const { 
    data: totalSalesData, 
    isLoading: isSalesLoading,
    refetch: refetchSales 
  } = useGetTotalSales(formattedStartDate, formattedEndDate);

  const {
    data: orderStatusData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders
  } = useGetOrderStatusChart(formattedStartDate, formattedEndDate);

  const {
    data: topSellingProductsData,
    isLoading: isTopProductLoading,
    isError: isTopProductError,
    refetch: refetchTopProduct,
  } = useGetTopSaleProduct(formattedStartDate, formattedEndDate);

  const {
    data: userGrowthData,
    isLoading: isUserGrowthLoading,
    isError: isUserGrowthError,
    refetch: refetchUserGrowth,
  } = useGetUserGrowth(formattedStartDate, formattedEndDate);

  useEffect(() => {
    if (totalSalesData?.data) {
      const total = totalSalesData.data.reduce(
        (sum, item) => sum + item.count,
        0
      );
      setTotalSales(total);
    }
  }, [totalSalesData]);

  useEffect(() => {
    if (orderStatusData?.data) {
      const total = orderStatusData.data.reduce(
        (sum, item) => sum + item.count,
        0
      );
      setTotalOrders(total);
    }
  }, [orderStatusData]);

  // Add new useEffect to handle top products data
  useEffect(() => {
    if (topSellingProductsData?.data) {
     
      const top3 = topSellingProductsData?.data.slice(0, 3).map(product => ({
        name: product.label,
        value: product.count
      }));

      // Fill remaining slots with empty data if less than 3 products
      while (top3.length < 3) {
        top3.push({ name: "", value: 0 });
      }
      
      setTopProduct(top3);
    }
  }, [topSellingProductsData]);

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    refetchSales();
    refetchOrders();
    refetchTopProduct();
    refetchUserGrowth();
  };

  const handleRefresh = () => {
    refetchSales();
    refetchOrders();
    refetchTopProduct();
    refetchUserGrowth();
  }

  const listTopProduct = [
    { name: topProduct[0].name, value: topProduct[0].value },
    { name: topProduct[1].name, value: topProduct[1].value },
    { name: topProduct[2].name, value: topProduct[2].value },
  ]

  const renderHeader = () => (
    <Card style={{ borderRadius: "12px", marginBottom: "24px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0"
      }}>
        <Title level={2} style={{ margin: 0, fontSize: "24px", color: "#1a1a1a" }}>
          Admin Dashboard
        </Title>
        <VN 
          title="Vietnam" 
          style={{
            width: "30px",
            height: "auto",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderRadius: "4px"
          }}
        />
        <RangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          style={{ 
            width: "300px",
            borderRadius: "6px"
          }}
        />
        <Button type="primary" onClick={handleRefresh}>Refresh</Button>
      </div>
    </Card>
  );

  const renderStatsSummary = () => (
    <Row gutter={[24, 24]} style={{ width: "100%" }}>
      <Col xs={24} sm={12} lg={12}>
        <StatCard
          title="Total Orders"
          value={totalOrders}
          prefix={<ShoppingCartOutlined style={{ fontSize: "24px", color: "#1890ff" }} />}
          loading={isOrdersLoading}
        />
      </Col>
      <Col xs={24} sm={12} lg={12}>
        <StatCard
          title="Total Sales"
          value={totalSales.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
          prefix={<DollarOutlined style={{ fontSize: "24px", color: "#52c41a" }} />}
          loading={isSalesLoading}
        />
      </Col>
    </Row>
  );

  const renderTopProducts = () => (
    <Row gutter={[24, 24]} style={{ width: "100%" }}>
      <Col span={24}>
        <StatCardTopProduct
          title="Top 3 Product"
          value={listTopProduct}  
          loading={isTopProductLoading}
          suffix={null}
          prefix={<RiseOutlined style={{ fontSize: "24px", color: "#722ed1", flexShrink: 0 }} />}
        />
      </Col>
    </Row>
  );

  const renderCharts = () => (
    <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ width: "925px", margin: "0 auto" }}>
      <TabPane tab="User Growth" key="1">
        <Card 
          style={{
            width: "925px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
          bodyStyle={{ padding: "24px" }}
        >
          <UserDataChart 
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            userData={userGrowthData}
            isLoading={isUserGrowthLoading}
            isError={isUserGrowthError}
            refetch={refetchUserGrowth}
          />
        </Card>
      </TabPane>

      <TabPane tab="Product Sales" key="2">
        <Card 
          style={{
            width: "925px", 
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
          bodyStyle={{ padding: "24px" }}
        >
          <ProductChart 
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            setTopProduct={setTopProduct}
            productData={topSellingProductsData}
            isLoading={isTopProductLoading}
            isError={isTopProductError}
            refetch={refetchTopProduct}
          />
        </Card>
      </TabPane>

      <TabPane tab="Order Statistics" key="3">
        <Card 
          style={{
            width: "925px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
          bodyStyle={{ padding: "24px" }}
        >
          <OrderChart 
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onTotalOrdersChange={setTotalOrders}
            orderData={orderStatusData}
            isLoading={isOrdersLoading}
            isError={isOrdersError}
            refetch={refetchOrders}
          />
        </Card>
      </TabPane>
    </Tabs>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Content style={{ padding: "24px", maxWidth: "2400px", margin: "0 auto" }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {renderHeader()}
          {renderStatsSummary()}
          {renderTopProducts()}
          {renderCharts()}
        </Space>
      </Content>
    </Layout>
  );
};

export default AdminDashboard;
