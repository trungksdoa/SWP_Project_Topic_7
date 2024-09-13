import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PATH } from "../../../constant";
import { Button, Layout, Menu, theme } from "antd";
import { NavLink, Outlet } from "react-router-dom";
import { UserOutlined, CarFilled, HomeFilled, DesktopOutlined } from '@ant-design/icons';
import { LOCAL_STORAGE_LOGIN_KEY } from "../../../constant/localStorage";
import { manageUserActions, manageUserReducer } from "../../../store/manageUser/slice";

const AdminTemplate = () => {
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
    dispatch(manageUserActions.updateUserLogin(null))
    navigate(PATH.HOME);
  };


  return (
    <div>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" mode="inline" selectedKeys={selectedKeys}>
            <NavLink to="/">
              <img src="" alt="" />
            </NavLink>
            <Menu.Item key={5} icon={<UserOutlined />}>
              <NavLink key={1} to={PATH.MANAGE_USER}>Manage User</NavLink>
            </Menu.Item>
            <Menu.Item key={6} icon={<CarFilled />}>
              <NavLink key={2}>Quản lý thông tin vị trí</NavLink>
            </Menu.Item>
            <Menu.Item key={7} icon={<HomeFilled />}>
              <NavLink key={3}>Quản lý thông tin phòng</NavLink>
            </Menu.Item>
            {/* <SubMenu key="sub1" icon={<FileOutlined />} title="Films">
            
          </SubMenu> */}
            <Menu.Item key={8} icon={<DesktopOutlined />}>
              <NavLink key={4}>Quản lý đặt phòng</NavLink>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
          >
            <div className="container text-right">
              <Button
                className="ms-auto"
                onClick={() => {
                    handleLogout()
                }}
              >
                Đăng xuất
              </Button>
            </div>
          </Header>
          <div
            style={{
              padding: 24,
              height: '100%'
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
