import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PATH } from "../../../constant";
import { Button, Layout, Menu, theme } from "antd";
import { NavLink, Outlet } from "react-router-dom";
import {
  UserOutlined,
  CarFilled,
  HomeFilled,
  DesktopOutlined,
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
                  src="../../../images/logo.png"
                  className="w-[100px] h-[100px]"
                  alt=""
                />
              </NavLink>
            </div>
            <Menu.Item className="text-white" key={5} icon={<UserOutlined  style={{color: "white"}}/>}>
              <NavLink key={1} to={PATH.MANAGE_USER} className="!text-white">
                {t("Manage Users")}
              </NavLink>
            </Menu.Item>
            <Menu.Item className="text-white" key={5} icon={<UserOutlined  style={{color: "white"}}/>}>
              <NavLink key={1} to={PATH.MANAGE_PRODUCTS} className="!text-white">
                {t("Manage Products")}
              </NavLink>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header>
            <div className="container text-right">
              <Button
                className="ms-auto bg-orange-500 text-white hover:!text-white hover:!border-orange-600 hover:!bg-orange-600"
                onClick={() => {
                  handleLogout();
                }}
              >
                {t("Logout")}
              </Button>
            </div>
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
