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
  console.log(user);
  return (
    <div className="container mx-auto w-[80%]">
       <div className="flex justify-center items-center text-bold text-3xl h-full m-2 mb-3">
          <strong>Profile</strong>
        </div>
      <div className="flex items-center">
        <div className="mr-[30px]">
          {!!user?.avatar ? (
            <div
              style={{
                height: "150px",
                width: "150px",
                borderRadius: "50%",
                border: "1px solid #000000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img className="rounded-full" src={user?.avatar} alt="avatar" />
            </div>
          ) : (
            <div
              style={{
                height: "150px",
                width: "150px",
                borderRadius: "50%",
                border: "1px solid #000000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <UserOutlined
                style={{
                  fontSize: "80px",
                }}
              />
            </div>
          )}
        </div>
        <div>
          <h2 className="text-[32px]">
            Welcome,{" "}
            <span className="font-bold text-orange-500">
              {userLogin?.username}
            </span>
          </h2>
        </div>
      </div>
      <FormUserUpdate user={user} refetch={refetch} />
    </div>
  );
};

export default ProfileTemplage;
