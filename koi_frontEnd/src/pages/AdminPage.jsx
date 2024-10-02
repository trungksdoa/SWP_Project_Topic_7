import React, { useEffect } from "react";
import AdminTemplate from "../components/template/Admin/AdminTemplate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH } from "../constant";
const AdminPage = () => {
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.manageUser.userLogin);

  const role = userLogin?.roles?.map((role) => {
    return role?.name;
  });
  useEffect(() => {
    if (role[0] === "ROLE_MEMBER") {
      navigate(PATH.HOME);
    }
  }, []);

  return (
    <div>
      <AdminTemplate />
    </div>
  );
};

export default AdminPage;
