import { Popconfirm } from "antd";
import { Modal } from "antd";
import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { AiOutlineMenu } from "react-icons/ai";
import { Button, Popover } from "antd";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { PATH } from "../../../constant";

export const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const [isModalLogin, setIsModalLogin] = useState(false);
  const [isModalRegister, setIsModalRegister] = useState(false);
  const showModalLogin = () => {
    setIsModalLogin(true);
  };
  const showModalRegister = () => {
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
    return (
      <div className="flex flex-col">
        <Button
          className="mb-[10px] w-full bg-orange-500 text-white hover:!text-white border-none hover:!bg-orange-600"
          onClick={showModalLogin}
        >
          {t("login")}
        </Button>
        <Button
          className="mb-[10px] w-full bg-white text-black hover:!text-white hover:!border-orange-600 hover:!bg-orange-600"
          onClick={showModalRegister}
        >
          {t("register")}
        </Button>

      </div>
    );
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
        title="Login"
        open={isModalLogin}
        onOk={handleOkLogin}
        onCancel={handleCancelLogin}
      >
        <h1>Login</h1>
      </Modal>
      <Modal
        title="Register"
        open={isModalRegister}
        onOk={handleOkRegister}
        onCancel={handleCancelRegister}
      >
        <h1>Register</h1>
      </Modal>
    </div>
  );
};
