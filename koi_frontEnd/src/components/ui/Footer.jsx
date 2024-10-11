import React from 'react'
import { NavLink } from 'react-router-dom'
import { PATH } from '../../constant'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()
  return (
    <div className="w-full bg-black-400">
      <footer className="px-4 bg-black text-white">
        <div className="container mx-auto py-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Column 1: Logo */}
            <div className="flex flex-col items-center justify-center h-full">
              <NavLink to={PATH.HOME} rel="noopener noreferrer" className="inline-block text-center">
                <img className="w-[150px] mx-auto" src="../../../images/logo.webp" alt={t("Koi Control logo")} />
                <p className='text-orange-400 font-bold text-[40px] mt-2'>{t("KoiControl")}</p>
              </NavLink>
            </div>

            {/* Column 2: INTRODUCTION */}
            <div>
              <h3 className="uppercase text-orange-400 text-[25px] font-semibold mb-[20px]">
                {t("INTRODUCTION")}
              </h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-white text-[16px] hover:text-orange-400 duration-300">{t("About us")}</a></li>
                <li><a href="/" className="text-white text-[16px] hover:text-orange-400 duration-300">{t("Vision")}</a></li>
                <li><a href="/" className="text-white text-[16px] hover:text-orange-400 duration-300">{t("Career Opportunities")}</a></li>
              </ul>
            </div>

            {/* Column 3: SERVICES */}
            <div>
              <h3 className="uppercase text-orange-400 text-[25px] font-semibold mb-[20px]">
                {t("SERVICES")}
              </h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-white text-[16px] hover:text-orange-400 duration-300">{t("Management")}</a></li>
                <li><a href="/" className="text-white text-[16px] hover:text-orange-400 duration-300">{t("Calculator")}</a></li>
                <li><a href="/" className="text-white text-[16px] hover:text-orange-400 duration-300">{t("Store")}</a></li>
                <li><a href="/" className="text-white text-[16px] hover:text-orange-400 duration-300">{t("Blog")}</a></li>
              </ul>
            </div>

            {/* Column 4: SUPPORT */}
            <div>
              <h3 className="uppercase text-orange-400 text-[25px] font-semibold mb-[20px]">
                {t("SUPPORT")}
              </h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-white text-[16px] hover:text-orange-400 duration-300">{t("Support Center")}</a></li>
                <li><a href="/" className="text-white text-[16px] hover:text-orange-400 duration-300">{t("Tutorial")}</a></li>
                <li><a href="/" className="text-white text-[16px] hover:text-orange-400 duration-300">{t("Policy")}</a></li>
              </ul>
            </div>

            {/* Column 5: Social Media */}
            <div>
              <h3 className="uppercase text-orange-400 text-[25px] font-semibold mb-[20px]">
                {t("SOCIAL MEDIA")}
              </h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-white text-[16px] hover:text-orange-400 duration-300">{t("Facebook")}</a></li>
                <li><a href="/" className="text-white text-[16px] hover:text-orange-400 duration-300">{t("Twitter")}</a></li>
                <li><a href="/" className="text-white text-[16px] hover:text-orange-400 duration-300">{t("Instagram")}</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 text-center text-white text-[16px] border-t border-gray-700">
          {t("© 2024 All rights reserved. Design by")}{" "}
          <a href="/khailuu1512/" target="blank">
            <span className="text-orange-400 text-[16px] font-semibold">
              {t("GROUP 3")}
            </span>
          </a>
        </div>
      </footer>
    </div>
  )
}

export default Footer