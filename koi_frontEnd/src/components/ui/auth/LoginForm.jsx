import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { manageUserActionThunks } from '../../../store/manageUser'
import { Controller } from 'react-hook-form'
import { Input, Button } from 'antd'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { LOCAL_STORAGE_LOGIN_KEY } from '../../../constant/localStorage'
import { PATH } from '../../../constant/config'
import { Navigate } from 'react-router-dom'

const LoginForm = ({ showModalRegister, showModalLogin, handleOkLogin }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isFetchingLogin, userLogin } = useSelector(
    (state) => state.manageUser
  );
  const role = userLogin?.roles;

  const {
    control, 
    handleSubmit,
    formState: { errors }
  } = useForm();

  // Kiểm tra role và điều hướng hoặc đóng modal
  if (userLogin) {
    if (role === "ROLE_ADMIN") {
      return <Navigate to={PATH.ADMIN} />;
    } else if (role === "ROLE_USER") {
      handleOkLogin(); // Đóng modal khi role là ROLE_USER
    }
  }

  const onSubmit = (data) => {
    dispatch(manageUserActionThunks.loginThunk(data))
      .unwrap()
      .then((res) => {
        toast.success(t('Login successfully'));
        if (res.roles === "ROLE_USER") {
          handleOkLogin(); // Đóng modal nếu role là ROLE_USER
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
      });
  };

  const handleShowModalRegister = () => {
    showModalRegister();
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <img src="../../../images/logo.png" className='w-20 h-20' alt="logo" />
      <h1 className='text-[30px] font-bold text-orange-500 mt-[10px]'>{t('login')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-center justify-center w-[80%]'>
        <div className='flex flex-col items-start justify-center w-[100%]'>
          <p htmlFor="username" className='text-[16px] !mb-[8px] font-bold text-orange-500'>User Name</p>
          <Controller
            control={control}
            name="username"
            render={({ field }) => <Input {...field} />}
          />
          <p htmlFor="password" className='text-[16px] mb-[8px] mt-[20px] justify-start font-bold text-orange-500'>{t('Password')}</p>
          <Controller
            control={control}
            name="password"
            render={({ field }) => <Input.Password {...field} />}
          />
        </div>
        <Button
          loading={isFetchingLogin}
          htmlType="submit"
          style={{
            backgroundColor: "#F97316",
            border: "none",
            transition: "all .3s",
            marginTop: "20px",
            marginBottom: "10px"
          }}
          size="large"
          className="!text-white w-[100%] !hover:bg-rose-700"
        >
          {t('login')}
        </Button>
        <p className='text-[16px]'>{t("Don't have an account?")} <span onClick={handleShowModalRegister} className='text-orange-400 underline hover:!text-orange-600 cursor-pointer'>{t('register')}</span></p>
      </form>
    </div>
  );
}

export default LoginForm;