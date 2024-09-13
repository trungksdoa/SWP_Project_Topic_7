import React from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { Input, Button } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { manageUserActionThunks } from '../../../store/manageUser'

const RegisterForm = ({ showModalLogin }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch()

  const { isFetchingRegister } = useSelector((state) => state.manageUser);

  const handleShowModalLogin = () => {
    showModalLogin();
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    dispatch(manageUserActionThunks.registerThunk(data))
    .unwrap()
    .then((res) => {
      console.log(res.data)
      toast.success(res.data.message)
      showModalLogin()
    })
    .catch((err) => {
      console.log(err)
    })
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <img src="../../../images/logo.png" className="w-20 h-20" alt="logo" />
      <h1 className="text-[30px] font-bold text-orange-500 mt-[10px]">
        {t("Register")}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center w-[80%]"
      >
        <div className="w-full">
          <p className="text-[16px] font-bold text-orange-500">
            User Name
          </p>
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <Input
                {...field}
                className="!mb-[10px] !border-[1px] !border-black"
                style={{ border: "1px solid #000 !important" }}
                placeholder="User Name"
              />
            )}
          />
          <p className="text-[16px] font-bold text-orange-500">
            Email
          </p>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                {...field}
                className="!mb-[10px] !border-[1px] !border-black"
                style={{ border: "1px solid #000 !important" }}
                placeholder="Email"
              />
            )}
            // rules={{
            //   required: "Required",
            //   pattern: {
            //     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
            //     message: "Invalid email address",
            //   },
            // }}
          />
          <p
            className="text-[16px] justify-start font-bold text-orange-500"
          >
            {t("Password")}
          </p>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input.Password
                {...field}
                className="!mb-[10px] !border-[1px] !border-black"
                style={{ border: "1px solid #000 !important" }}
                placeholder="Password"
              />
            )}
            // rules={{
            //   required: "Required",
            //   pattern: {
            //     value:
            //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
            //     message:
            //       "Password must include uppercase, lowercase, number, and special character",
            //   },
            // }}
          />
        </div>
        <Button
          className="w-full col-6 mt-[20px]"
          style={{
            backgroundColor: "#f97316",
            border: "none",
            transition: "all .3s",
          }}
          loading={isFetchingRegister}
          htmlType="submit"
          type="primary"
          size="large"
        >
          Register
        </Button>
        <p className="text-[16px]">
          {t("Do you have an account?")}{" "}
          <span
            onClick={handleShowModalLogin}
            className="text-orange-400 underline hover:!text-orange-600 cursor-pointer"
            to="/register"
          >
            {t("Login")}
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
