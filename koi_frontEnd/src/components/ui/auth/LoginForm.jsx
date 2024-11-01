import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { manageUserActionThunks } from "../../../store/manageUser";
import { Controller } from "react-hook-form";
import { Input, Button, message } from "antd";
import { useSelector } from "react-redux";
import { LOCAL_STORAGE_LOGIN_KEY } from "../../../constant/localStorage";
import { PATH } from "../../../constant/config";
import ForgotPassword from "./ForgotPassword"; // Import ForgotPassword

const LoginForm = ({
  showModalRegister,
  handleOkLogin,
  showModalForgotPassword,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetchingLogin, userLogin } = useSelector(
    (state) => state.manageUser
  );

  useEffect(() => {
    if (userLogin) {
      const role = userLogin.roles[0]?.name; // Assuming roles is an array
      if (role === "ROLE_ADMIN") {
        navigate(PATH.MANAGE_USER);
      } else if (role === "ROLE_MEMBER") {
        navigate(PATH.KOI_MANAGEMENT);
      } else if (role === "ROLE_SHOP") {
        navigate(PATH.MANAGE_BLOG);
      }
    }
  }, [userLogin, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur", // Optional: to validate on blur
  });

  const validateEmail = (value) => {
    if (!value) return "Email is required";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value) || "Invalid email address";
  };

  // const validatePassword = (value) => {
  //   if (!value) return "Password is required";
  //   const passwordPattern =
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  //   return (
  //     passwordPattern.test(value) ||
  //     "Password must include uppercase, lowercase, number, and special character"
  //   );
  // };

  const onSubmit = (data) => {
    dispatch(manageUserActionThunks.loginThunk(data))
      .unwrap()
      .then((res) => {
        message.success(t("Login successfully"));
        handleOkLogin();
      })
      .catch((error) => {
        message.error(error.response?.data?.message);
      });
  };

  const handleShowModalRegister = () => {
    showModalRegister();
  };

  const handleShowForgotPassword = () => {
    showModalForgotPassword(); // Mở pop-up Forgot Password
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <img src="../../../images/logo.webp" className="w-20 h-20" alt="logo" />
      <h1 className="text-[30px] font-bold text-orange-400 mt-[10px]">
        {t("Login")}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center w-[80%]"
      >
        <div className="flex flex-col items-start justify-center w-[100%]">
          <p
            htmlFor="username"
            className="text-[16px] !mb-[8px] font-bold text-orange-500"
          >
            Email
          </p>
          <Controller
            control={control}
            name="email"
            rules={{ validate: validateEmail }} // Add validation rule
            render={({ field }) => <Input {...field} />}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
          <p
            htmlFor="password"
            className="text-[16px] mb-[8px] mt-[20px] justify-start font-bold text-orange-500"
          >
            {t("Password")}
          </p>
          <Controller
            control={control}
            name="password"
            // rules={{ validate: validatePassword }} // Add validation rule
            render={({ field }) => <Input.Password {...field} />}
          />
          {/* {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )} */}
        </div>
        <Button
          loading={isFetchingLogin}
          htmlType="submit"
          style={{
            backgroundColor: "#000000",
            border: "none",
            transition: "all .3s",
            marginTop: "20px",
            marginBottom: "10px",
          }}
          size="large"
          id="login-button"
          className="!text-white w-[100%] !hover:bg-rose-700"
        >
          {t("Login")}
        </Button>
        <p
          className="underline cursor-pointer my-[10px] hover:text-black transition-all duration-300"
          onClick={handleShowForgotPassword}
        >
          {t("Forgot Password?")}
        </p>
        <p className="text-[16px]">
          {t("Don't have an account?")}{" "}
          <span
            onClick={handleShowModalRegister}
            className="text-orange-400 underline hover:!text-orange-600 cursor-pointer"
            id="register-button"
          >
            {t("Register")}
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
