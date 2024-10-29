import React from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { Input, Button, message, Radio } from "antd";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { manageUserActionThunks } from "../../../store/manageUser";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ showModalLogin, onRegisterSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetchingRegister } = useSelector((state) => state.manageUser);

  const handleShowModalLogin = () => {
    showModalLogin();
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  const onSubmit = (data) => {
    const { confirmPassword, ...formData } = data;
    
    const formattedData = {
      ...formData,
      role: data.roles
    };

    dispatch(manageUserActionThunks.registerThunk(formattedData))
      .unwrap()
      .then(() => {
        toast.success("Account created successfully. Please check your email for the log in link.");
        if (typeof onRegisterSuccess === 'function') {
          onRegisterSuccess(); // Close the popup on successful registration
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          toast.warning("User already exists. Please check your email or try logging in.");
        } else {
          toast.error('Registration failed. Please try again.');
        }
        console.error(err);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <img src="../../../images/logo.webp" className="w-20 h-20" alt="logo" />
      <h1 className="text-[30px] font-bold text-orange-500 mt-[10px]">
        {t("Register")}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center w-[80%]"
      >
        <div className="w-full">
          <p className="text-[16px] font-bold text-orange-500 mb-[10px]">User Name</p>
          <Controller
            control={control}
            name="username"
            render={({ field }) => (
              <Input
                {...field}
                className="!mb-[10px] !border-[1px] !border-gray-300"
                style={{ border: "1px solid #000 !important" }}
                placeholder="User Name"
              />
            )}
            rules={{
              required: "Please enter your username",
              pattern: {
                value: /^[a-zA-Z0-9]{5,}$/,
                message:
                  "Username must contain only letters and numbers, and be at least 5 characters long",
              },
            }}
          />
          {!!errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
          <p className="text-[16px] font-bold text-orange-500 mb-[10px]">Email</p>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                {...field}
                className="!mb-[10px] !border-[1px] !border-g"
                style={{ border: "1px solid #000 !important" }}
                placeholder="Email"
              />
            )}
            rules={{
              required: "Please enter your email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                message: "Invalid email address",
              },
            }}
          />
          {!!errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
          <p className="text-[16px] justify-start font-bold text-orange-500 mb-[10px]">
            {t("Password")}
          </p>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input.Password
                {...field}
                className="!mb-[10px] !border-[1px] !border-g"
                style={{ border: "1px solid #000 !important" }}
                placeholder="Password"
              />
            )}
            rules={{
              required: "Please enter your password",
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
                message:
                  "Password must include uppercase, lowercase, number, and special character",
              },
            }}
          />
          {!!errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
          <p className="text-[16px] justify-start font-bold text-orange-500 mb-[10px]">
            {t("Confirm Password")}
          </p>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <Input.Password
                {...field}
                className="!mb-[10px] !border-[1px] !border-g"
                style={{ border: "1px solid #000 !important" }}
                placeholder="Confirm Password"
              />
            )}
            rules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
          />
          {!!errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
          
          <p className="text-[16px] justify-start font-bold text-orange-500 mb-[10px]">
            {t("Roles")}
          </p>
        </div>
        <Controller
          control={control}
          name="roles"
          render={({ field }) => (
            <Radio.Group
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "",
              }}
              {...field}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
            >
              <Radio className="mr-[100px]" value="ROLE_MEMBER">Member</Radio>
              <Radio value="ROLE_CONTRIBUTOR">Contributor</Radio>
            </Radio.Group>
          )}
          rules={{ required: "Please select a role" }}
        />
        {!!errors.roles && (
          <p className="text-red-500">{errors.roles.message}</p>
        )}
        <Button
          className="w-full col-6 mt-[20px]"
          style={{
            backgroundColor: "#000000",
            border: "none",
            transition: "all .3s",
            marginBottom: "15px"
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
