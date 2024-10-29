import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { PATH } from "../../../constant";
import { Button, Layout, Menu, theme } from "antd";
import { NavLink, Outlet } from "react-router-dom";

import {
  UserOutlined,
  CarFilled,
  HomeFilled,
  DollarOutlined,
  FileTextOutlined,
  DesktopOutlined,
  ProductOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { LOCAL_STORAGE_LOGIN_KEY } from "../../../constant/localStorage";
import {
  manageUserActions,
  manageUserReducer,
} from "../../../store/manageUser/slice";
import { useTranslation } from "react-i18next";

const AdminTemplate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const getSelectedKeys = (pathname) => {
    if (pathname.startsWith(PATH.ADMIN)) {
      return [PATH.ADMIN];
    }
    return [pathname];
  };
  const [collapsed, setCollapsed] = useState(false);
  const { Header, Content, Footer, Sider } = Layout;
  const [selectedKeys, setSelectedKeys] = useState(
    getSelectedKeys(location.pathname)
  );

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_LOGIN_KEY);
    dispatch(manageUserActions.updateUserLogin(null));
    navigate(PATH.HOME);
  };

  const getSectionName = (pathname) => {
    const path = pathname.split("/").pop();
    return t(
      path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  return (
    <div>
      <Layout
        style={{
          backgroundColor: "#F97316 !important",
          minHeight: "100vh",
        }}
      >
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" mode="inline" selectedKeys={selectedKeys}>
            <div className="flex justify-center items-center mt-[20px]">
              <NavLink to="/">
                <img
                  src="../../../images/logo.webp"
                  className="w-[100px] h-[100px]"
                  alt=""
                />
              </NavLink>
            </div>
            {/* Dashboard */}
            <Menu.Item
              className="text-white"
              key={1}
              icon={
                <HomeFilled
                  style={{
                    color: selectedKeys.includes(PATH.ADMIN)
                      ? "orange"
                      : "white",
                  }}
                />
              }
            >
              <NavLink
                key={1}
                to={PATH.ADMIN_DASHBOARD}
                className={({ isActive }) =>
                  isActive ? "!text-orange-500" : "!text-white"
                }
              >
                {t("Dashboard")}
              </NavLink>
            </Menu.Item>
            <Menu.Item
              className="text-white"
              key={5}
              icon={
                <UserOutlined
                  style={{
                    color: selectedKeys.includes(PATH.MANAGE_USER)
                      ? "orange"
                      : "white",
                  }}
                />
              }
            >
              <NavLink
                key={2}
                to={PATH.MANAGE_USER}
                className={({ isActive }) =>
                  isActive ? "!text-orange-500" : "!text-white"
                }
              >
                {t("Manage Users")}
              </NavLink>
            </Menu.Item>
            <Menu.Item
              className="text-white"
              key={6}
              icon={
                <ProductOutlined
                  style={{
                    color: selectedKeys.includes(PATH.MANAGE_PRODUCTS)
                      ? "orange"
                      : "white",
                  }}
                />
              }
            >
              <NavLink
                key={3}
                to={PATH.MANAGE_PRODUCTS}
                className={({ isActive }) =>
                  isActive ? "!text-orange-500" : "!text-white"
                }
              >
                {t("Manage Products")}
              </NavLink>
            </Menu.Item>
            <Menu.Item
              className="text-white"
              key={7}
              icon={
                <ProductOutlined
                  style={{
                    color: selectedKeys.includes(PATH.MANAGE_PACKAGE)
                      ? "orange"
                      : "white",
                  }}
                />
              }
            >
              <NavLink
                key={4}
                to={PATH.MANAGE_PACKAGE}
                className={({ isActive }) =>
                  isActive ? "!text-orange-500" : "!text-white"
                }
              >
                {t("Manage Packages")}
              </NavLink>
            </Menu.Item>
            <Menu.Item
              className="text-white"
              key={8}
              icon={
                <UnorderedListOutlined
                  style={{
                    color: selectedKeys.includes(PATH.MANAGE_CATEGORY)
                      ? "orange"
                      : "white",
                  }}
                />
              }
            >
              <NavLink
                key={5}
                to={PATH.MANAGE_CATEGORY}
                className={({ isActive }) =>
                  isActive ? "!text-orange-500" : "!text-white"
                }
              >
                {t("Manage Category")}
              </NavLink>
            </Menu.Item>
            <Menu.Item
              className="text-white"
              key={9}
              icon={
                <UnorderedListOutlined
                  style={{
                    color: selectedKeys.includes(PATH.MANAGE_ORDER)
                      ? "orange"
                      : "white",
                  }}
                />
              }
            >
              <NavLink
                key={6}
                to={PATH.MANAGE_ORDER}
                className={({ isActive }) =>
                  isActive ? "!text-orange-500" : "!text-white"
                }
              >
                {t("Manage Order")}
              </NavLink>
            </Menu.Item>
            <Menu.Item
              className="text-white"
              key={10}
              icon={
                <UnorderedListOutlined
                  style={{
                    color: selectedKeys.includes(PATH.MANAGE_PAYMENT_STATUS)
                      ? "orange"
                      : "white",
                  }}
                />
              }
            >
              <NavLink
                key={7}
                to={PATH.MANAGE_PAYMENT_STATUS}
                className={({ isActive }) =>
                  isActive ? "!text-orange-500" : "!text-white"
                }
              >
                {t("Manage Payment Status")}
              </NavLink>
            </Menu.Item>
            <Menu.Item
              className="text-white"
              key={12}
              icon={
                <HomeFilled
                  style={{
                    color: selectedKeys.includes(PATH.HOME)
                      ? "orange"
                      : "white",
                  }}
                />
              }
            >
              <NavLink
                key={9}
                to={PATH.HOME}
                className={({ isActive }) =>
                  isActive ? "!text-orange-500" : "!text-white"
                }
              >
                {t("Back to home")}
              </NavLink>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 24px",
            }}
          >
            <h2
              style={{
                color: "black",
                margin: 0,
                fontSize: "27px",
                fontWeight: "bold",
              }}
            >
              {getSectionName(location.pathname)}
            </h2>
            <Button
              className="bg-black text-white hover:!text-white hover:!bg-black"
              onClick={() => {
                handleLogout();
              }}
            >
              {t("Logout")}
            </Button>
          </Header>
          <div
            style={{
              padding: 24,
              height: "100%",
            }}
          >
            <Outlet />
          </div>
          <Footer
            style={{
              textAlign: "center",
            }}
          >
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default AdminTemplate;
