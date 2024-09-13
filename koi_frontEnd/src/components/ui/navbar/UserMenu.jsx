import { Popconfirm } from "antd";
import { Modal } from "antd";
import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { AiOutlineMenu } from "react-icons/ai";
import { Button, Popover } from "antd";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { PATH } from "../../../constant";
import LoginForm from "../auth/LoginForm";
import RegisterForm from "../auth/RegisterForm";
import { useDispatch, useSelector } from "react-redux";
import { LOCAL_STORAGE_LOGIN_KEY } from "../../../constant/localStorage";
import { manageUserActions } from "../../../store/manageUser/slice";

export const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const naigate = useNavigate()
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_LOGIN_KEY);
    dispatch(manageUserActions.updateUserLogin(null))
    naigate(PATH.HOME);
  };

  const { userLogin } = useSelector((state) => state.manageUser);

  console.log(userLogin)

  const [isModalLogin, setIsModalLogin] = useState(false);
  const [isModalRegister, setIsModalRegister] = useState(false);
  
  const showModalLogin = () => {
    setIsModalRegister(false);
    setIsModalLogin(true);
  };
  const showModalRegister = () => {
    setIsModalLogin(false);
    setIsModalRegister(true);
  };

  const handleOkLogin = () => {
    setIsModalLogin(false);
  };

  const handleOkRegister = () => {
    setIsModalRegister(false);
  };

  const handleCancelLogin = () => {
    setIsModalLogin(false);
  };

  const handleCancelRegister = () => {
    setIsModalRegister(false);
  };

  const renderAvatar = () => {
    return <UserOutlined style={{ color: "white" }} />;
  };

  const renderUser = () => {
    if(!userLogin) {
      return (
        <div className="flex flex-col">
          <Button
            className="mb-[10px] w-full bg-orange-500 text-white hover:!text-white border-none hover:!bg-orange-600"
            onClick={showModalLogin}
          >
            {t("login")}
          </Button>
          <Button
            className="w-full bg-white text-black hover:!text-white hover:!border-orange-600 hover:!bg-orange-600"
            onClick={showModalRegister}
          >
            {t("register")}
          </Button>
  
        </div>
      );
    }
    if(userLogin) {
      if(userLogin.roles === "ROLE_ADMIN") {
        return (
          <div>
            <Button>
              {t("dashboard")}
            </Button>
            <Button onClick={handleLogout} className="w-full bg-white text-black hover:!text-white hover:!border-orange-600 hover:!bg-orange-600">
              {t("Logout")}
            </Button>
          </div>
        );
      }
      if(userLogin.roles === "ROLE_USER") {
        return (
          <div className="flex flex-col">
            <NavLink to={PATH.PROFILE} className="!mb-[10px] rounded-[6px] px-[15px] py-[4px] !w-full bg-orange-500 text-white hover:!text-white border-none hover:!bg-orange-600">
              {t("Profile")}
            </NavLink>
            <Button onClick={handleLogout} className="w-full bg-white text-black hover:!text-white hover:!border-orange-600 hover:!bg-orange-600">
              {t("Logout")}
            </Button>
          </div>
        );
      }
    }

  };

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-1">
        <Popover
          content={renderUser()}
          title=""
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <div className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
            <AiOutlineMenu style={{ color: "white" }} />
            <div className="m-1 hidden md:block">{renderAvatar()}</div>
          </div>
        </Popover>
      </div>
      {/* Modal được đưa ra ngoài */}
      <Modal
        title=""
        open={isModalLogin}
        onOk={handleOkLogin}
        onCancel={handleCancelLogin}
      >
        <LoginForm showModalRegister={showModalRegister} handleOkLogin={handleOkLogin} showModalLogin={showModalLogin} />
      </Modal>
      <Modal
        title=""
        open={isModalRegister}
        onOk={handleOkRegister}
        onCancel={handleCancelRegister}
      >
        <RegisterForm showModalLogin={showModalLogin} />
      </Modal>
    </div>
  );
};
