import React from "react";
import { Link } from "react-router-dom";
import { PATH } from "../../constant";
import { LanguageSwitcher } from "./navbar/LanguageSwitcher";
import { UserMenu } from "./navbar/UserMenu";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  return (
    <header className="p-4 bg-orange-500">
      <div className="container flex justify-between h-16 mx-auto">
        <Link to={PATH.HOME}>
          <img
            className="w-[80px]"
            src="../../images/logo.png"
            alt="logo"
          />
        </Link>
        <ul className="items-stretch hidden space-x-3 lg:flex">
          <li className="flex text-white">
            <a
              rel="noopener noreferrer"
              href={PATH.HOME}
              className="flex items-center px-4 -mb-1  dark:border- dark:text-violet-600 dark:border-violet-600"
            >
              {t("Home")}
            </a>
          </li>
          <li className="flex text-white">
            <a
              rel="noopener noreferrer"
              href={PATH.STORE}
              className="flex items-center px-4 -mb-1  dark:border- dark:text-violet-600 dark:border-violet-600"
            >
              {t("Store")}
            </a>
          </li>
          <li className="flex text-white">
            <a
              rel="noopener noreferrer"
              href="#"
              className="flex items-center px-4 -mb-1  dark:border-"
            >
              {t("Dealer")}
            </a>
          </li>
          <li className="flex text-white">
            <a
              rel="noopener noreferrer"
              href="#"
              className="flex items-center px-4 -mb-1  dark:border-"
            >
              {t("Base")}
            </a>
          </li>
          <li className="flex text-white">
            <a
              rel="noopener noreferrer"
              href="#"
              className="flex items-center px-4 -mb-1  dark:border-"
            >
              {t("Blog")}
            </a>
          </li>
        </ul>
        <div className="items-center flex-shrink-0 hidden lg:flex">
          <UserMenu />
          <div className="ml-4">
            <LanguageSwitcher />
          </div>
        </div>
        <button className=" lg:hidden">
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
    </header>
  );
};

export default Header;
