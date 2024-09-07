import { Popconfirm } from "antd";
import React, { useState } from "react";
import { GlobalOutlined, UserOutlined } from "@ant-design/icons";
import { AiOutlineMenu } from "react-icons/ai";
import { Button, Popover } from "antd";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

export const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const renderAvatar = () => {
    return <UserOutlined style={{ color: "white" }} />;
  };

  const renderUser = () => {
    return (
      <div className="flex flex-col">
        <NavLink to={"/login"}>
          <Button className="mb-[10px] w-full">{t("login")}</Button>
        </NavLink>
        <NavLink to={"/register"}>
          <Button>{t("register")}</Button>
        </NavLink>
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
          <div className="p-4  md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
            <AiOutlineMenu style={{ color: "white" }} />
            <div className="m-1 hidden md:block">{renderAvatar()}</div>
          </div>
        </Popover>
      </div>
    </div>
  );
};
