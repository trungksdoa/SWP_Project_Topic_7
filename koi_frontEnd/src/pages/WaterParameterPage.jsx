import React, { useEffect } from "react";
import WaterParameter from "../components/ui/manage/WaterParameter";
import { useSelector } from "react-redux";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { PATH } from "../constant";

const WaterParameterPage = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userLogin) {
      message.warning(
        "Please sign in or create an account to access this feature."
      );
      navigate(PATH.HOME);
    } else if (userLogin.roles && userLogin.roles[0].name === "ROLE_SHOP") {
      message.warning("Please register account Member to access this feature.");
      navigate(PATH.MANAGE_BLOG);
    }
  }, [userLogin]);
  return (
    <div>
      <WaterParameter />
    </div>
  );
};

export default WaterParameterPage;
