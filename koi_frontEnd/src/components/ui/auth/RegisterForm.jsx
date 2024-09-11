import React from "react";
import { useTranslation } from "react-i18next";

const RegisterForm = ({ showModalLogin }) => {
  const handleShowModalLogin = () => {
    showModalLogin()
  }

  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center">
      <img src="../../../images/logo.png" className='w-20 h-20' alt="logo" />
      <h1 className="text-[30px] font-bold text-orange-500 mt-[10px]">{t('Register')}</h1>
      <form className='flex flex-col items-center justify-center w-[80%]'>
        <div>
        <label htmlFor="email" className='text-[16px] font-bold text-orange-500'>Email</label>
        <input type="text" placeholder='Email' className='border-[1px] border-orange-500 w-full rounded-[8px] p-3 mb-4 mt-[10px]'/>
        <label htmlFor="password" className='text-[16px] justify-start font-bold text-orange-500'>{t('Password')}</label>
        <input type="password" placeholder='Password' className='border-[1px] border-orange-500 w-full rounded-[8px] p-3 mb-4 mt-[10px]' />
        </div>
        <button type='submit' className='w-full rounded-[8px] bg-orange-500 text-white text-[16px] p-3 mt-4 mb-5'>{t('Register')}</button>
        <p className='text-[16px]'>{t('Do you have an account?')} <span onClick={handleShowModalLogin} className='text-orange-400 underline hover:!text-orange-600 cursor-pointer' to="/register">{t('Login')}</span></p>
      </form>
    </div>
  );
};

export default RegisterForm;
