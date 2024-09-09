import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { PATH } from "../../constant";
import { LanguageSwitcher } from "./navbar/LanguageSwitcher";
import { UserMenu } from "./navbar/UserMenu";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOverlay, setIsOverlay] = useState(false);

  const toggleOverlay = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsOverlay(!isOverlay);
  };

  const toggleMenu = () => {
    setIsOverlay(!isOverlay);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="p-4 bg-orange-500 top-0 left-0 right-0 z-30 sticky">
      <div className="container flex justify-between h-16 mx-auto">
        <Link to={PATH.HOME}>
          <img className="w-[80px]" src="../../images/logo.png" alt="logo" />
        </Link>
        <ul className="items-stretch hidden space-x-3 lg:flex">
          <li className="flex text-white">
            <NavLink
              rel="noopener noreferrer"
              to={PATH.HOME}
              className="flex items-center px-4 -mb-1  dark:border- dark:text-violet-600 dark:border-violet-600"
            >
              {t("Home")}
            </NavLink>
          </li>
          <li className="flex text-white">
            <NavLink
              rel="noopener noreferrer"
              to={PATH.STORE}
              className="flex items-center px-4 -mb-1  dark:border- dark:text-violet-600 dark:border-violet-600"
            >
              {t("Store")}
            </NavLink>
          </li>
          <li className="flex text-white">
            <NavLink
              rel="noopener noreferrer"
              href="#"
              className="flex items-center px-4 -mb-1  dark:border-"
            >
              {t("Dealer")}
            </NavLink>
          </li>
          <li className="flex text-white">
            <NavLink
              rel="noopener noreferrer"
              href="#"
              className="flex items-center px-4 -mb-1  dark:border-"
            >
              {t("Base")}
            </NavLink>
          </li>
          <li className="flex text-white">
            <NavLink
              rel="noopener noreferrer"
              href="#"
              className="flex items-center px-4 -mb-1  dark:border-"
            >
              {t("Blog")}
            </NavLink>
          </li>
        </ul>
        <div className="items-center flex-shrink-0 hidden lg:flex">
          <UserMenu />
          <div className="ml-4">
            <LanguageSwitcher />
          </div>
        </div>
        <button className="lg:hidden" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 dark:text-gray-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile sliding menu */}
      <div
        className={`z-20 fixed top-0 left-0 w-[50%] h-full bg-orange-500 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="p-4">
          <div className="text-right">
            <button
              onClick={toggleMenu}
              className="mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <ul className="space-y-2 mt-[60px]">
            {/* Mobile menu items */}
            <li>
              <NavLink
                to={PATH.HOME}
                className="block text-white hover:text-black transition-all duration-300"
                onClick={toggleMenu}
              >
                {t("Home")}
              </NavLink>
            </li>
            <li className="!my-[30px]">
              <NavLink
                to={PATH.STORE}
                className="block text-white hover:text-black transition-all duration-300"
                onClick={toggleMenu}
              >
                {t("Store")}
              </NavLink>
            </li>
            <li className="!my-[30px]">
                <NavLink href="#" className="block text-white hover:text-black transition-all duration-300" onClick={toggleMenu}>
                {t("Dealer")}
              </NavLink>
            </li>
            <li className="!my-[30px]">
              <NavLink href="#" className="block text-white hover:text-black transition-all duration-300" onClick={toggleMenu}>
                {t("Base")}
              </NavLink>
            </li>
            <li className="!my-[30px]">
              <NavLink href="#" className="block text-white hover:text-black transition-all duration-300" onClick={toggleMenu}>
                {t("Blog")}
              </NavLink>
            </li>
            <li className="!my-[30px]">
              <NavLink href="#" className="block text-white hover:text-black transition-all duration-300" onClick={toggleMenu}>
                {t("Login")}
              </NavLink>
            </li>
            <li className="!my-[30px]">
              <NavLink href="#" className="block text-white hover:text-black transition-all duration-300" onClick={toggleMenu}>
                {t("Register")}
              </NavLink>
            </li>
          </ul>
          <div className="mt-4">
            
            <div className="mt-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed z-10 top-0 left-0 w-full h-full bg-black opacity-50 ${
          isOverlay ? "block" : "hidden"
        } lg:hidden`}
        onClick={toggleOverlay}
      ></div>
    </header>
  );
};

export default Header;
