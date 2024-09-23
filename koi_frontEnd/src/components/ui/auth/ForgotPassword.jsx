import React from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { Input, Button } from "antd";
import { toast } from "react-toastify";

const ForgotPassword = ({ showModalLogin }) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Gửi yêu cầu quên mật khẩu
    console.log(data);
    toast.success("Password reset link sent to your email!");
    showModalLogin(); // Quay lại LoginForm sau khi gửi yêu cầu
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <img src="../../../images/logo.webp" className="w-20 h-20" alt="logo" />

      <h1 className="text-[30px] font-bold text-orange-500 mt-[10px]">
        {t("Forgot Password")}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center w-[80%]"
      >
        <div className="w-full">
          <p className="text-[16px] font-bold text-orange-500 mb-[10px]">
            Email
          </p>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                {...field}
                className="!mb-[10px] !border-[1px] !border-gray-300"
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
          <Button className="w-full mt-[20px] bg-black text-white mb-[15px] hover:!bg-black hover:!text-white" htmlType="submit">
            {t("Send Reset Link")}
          </Button>
          <div className="text-center">
          <p className="text-[16px]">
            {t("Remember your password?")}{" "}
            <span
              onClick={showModalLogin}
              className="text-orange-400 underline hover:!text-orange-600 cursor-pointer"
            >
              {t("Login")}
            </span>
          </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
