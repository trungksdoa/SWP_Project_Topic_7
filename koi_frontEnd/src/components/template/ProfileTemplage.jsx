import React from "react";
import { useGetUserById } from "../../hooks/user/useGetUserById";
import { useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import FormUserUpdate from "../ui/user/FormUserUpdate";
import HistoryOrder from "../ui/user/HistoryOrder";

const ProfileTemplage = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const { data: user, refetch } = useGetUserById(userId);

  return (
    <div className="container mx-auto w-[80%]">
       <div className="flex justify-center items-center text-bold text-3xl h-full m-2 mb-3">
          <strong>Profile</strong>
        </div>
      <FormUserUpdate user={user} refetch={refetch} />
    </div>
  );
};

export default ProfileTemplage;
