import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { PATH } from "../constant";
import { LanguageSwitcher } from "../../src/components/ui/navbar/LanguageSwitcher";
import { UserMenu } from "../../src/components/ui/navbar/UserMenu";
import { useTranslation } from "react-i18next";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useGetCartByUserId} from "../../src/hooks/manageCart/useGetCartByUserId";
import { manageCartActions } from "../../src/store/manageCart/slice";

const HeaderManage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOverlay, setIsOverlay] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const cartCount = useSelector((state) => state.manageCart.cartCount);
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const { data: carts } = useGetCartByUserId(userLogin?.id);
  const navbarRef = useRef(null);
  const [showGradient, setShowGradient] = useState(false);
  const navigate = useNavigate();

  const toggleOverlay = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsOverlay(!isOverlay);
  };

  const toggleMenu = () => {
    setIsOverlay(!isOverlay);
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (!isLoggedOut) {
      dispatch(manageCartActions.setCartCount(carts?.length || 0));
    }
  }, [carts, dispatch, isLoggedOut]);

  useEffect(() => {
    const checkScroll = () => {
      if (navbarRef.current) {
        const { scrollWidth, clientWidth } = navbarRef.current;
        setShowGradient(scrollWidth > clientWidth);
      }
    };

    checkScroll(); // Kiểm tra khi component được mount

    window.addEventListener("resize", checkScroll); // Kiểm tra khi resize
    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <header className="p-4 bg-black top-0 left-0 right-0 z-30 sticky">
      <div className="container flex justify-between items-center h-16 mx-auto">
        <Link to={PATH.HOME} className="mr-[30px]">
          <img className="w-[80px]" src="../../images/logo.webp" alt="logo" />
        </Link>
        <div className="scrollable-navbar-wrapper relative overflow-hidden">
          <ul
            className="scrollable-navbar flex overflow-x-auto whitespace-nowrap p-2 scrollbar-hide"
            ref={navbarRef}
          >
            <li className="flex text-white">
              <NavLink
                rel="noopener noreferrer"
                to={PATH.KOI_MANAGEMENT}
                className="flex items-center px-4 -mb-1 dark:border- dark:text-violet-600 dark:border-violet-600"
              >
                {t("Koi Management")}
              </NavLink>
            </li>
            <li className="flex text-white">
              <NavLink
                rel="noopener noreferrer"
                to={PATH.POND_MANAGEMENT}
                className="flex items-center px-4 -mb-1 dark:border- dark:text-violet-600 dark:border-violet-600"
              >
                {t("Pond Management")}
              </NavLink>
            </li>
            <li className="flex text-white">
              <NavLink
                rel="noopener noreferrer"
                to={PATH.WATER_PARAMETER}
                className="flex items-center px-4 -mb-1 dark:border- dark:text-violet-600 dark:border-violet-600"
              >
                {t("Water Parameter")}
              </NavLink>
            </li>
            <li className="flex text-white">
              <NavLink
                rel="noopener noreferrer"
                to={PATH.FOOD_CALCULATOR}
                className="flex items-center px-4 -mb-1 dark:border- dark:text-violet-600 dark:border-violet-600"
              >
                {t("Food Calculator")}
              </NavLink>
            </li>
            <li className="flex text-white">
              <NavLink
                rel="noopener noreferrer"
                to={PATH.SALT_CALCULATOR}
                className="flex items-center px-4 -mb-1 dark:border- dark:text-violet-600 dark:border-violet-600"
              >
                {t("Salt Calculator")}
              </NavLink>
            </li>
            <li>
              <NavLink to={PATH.PACKAGES}>
                <button className="custom-button">Upgrade Account</button>
              </NavLink>
            </li>
          </ul>

          {/* Hiển thị gradient chỉ khi có scroll */}
          {showGradient && (
            <>
              <div className="absolute top-0 bottom-0 left-0 w-12 pointer-events-none bg-gradient-to-r from-black/50 to-transparent z-10" />
              <div className="absolute top-0 bottom-0 right-0 w-12 pointer-events-none bg-gradient-to-l from-black/50 to-transparent z-10" />
            </>
          )}
        </div>

        <div className="items-center ml-[30px] flex-shrink-0 hidden lg:flex">
          <div className="relative">
            <ShoppingCartOutlined
              style={{
                color: "white",
                marginRight: "15px",
                fontSize: "30px",
                cursor: "pointer",
              }}
              onClick={() => navigate(PATH.CART)}
            />
            {cartCount > 0 && (
              <span className="text-white text-center absolute top-[-17px] right-[0px] bg-green-400 !w-[30px] !h-[30px] leading-[30px] !rounded-full">
                {cartCount}
              </span>
            )}
          </div>
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
        className={`z-20 fixed top-0 left-0 w-[50%] h-full bg-black transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <div className="p-4">
          <div className="text-right">
            <button onClick={toggleMenu} className="mb-4">
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
              <NavLink
                href="#"
                className="block text-white hover:text-black transition-all duration-300"
                onClick={toggleMenu}
              >
                {t("Dealer")}
              </NavLink>
            </li>
            <li className="!my-[30px]">
              <NavLink
                href="#"
                className="block text-white hover:text-black transition-all duration-300"
                onClick={toggleMenu}
              >
                {t("Base")}
              </NavLink>
            </li>
            <li className="!my-[30px]">
              <NavLink
                href="#"
                className="block text-white hover:text-black transition-all duration-300"
                onClick={toggleMenu}
              >
                {t("Fish")}
              </NavLink>
            </li>
            <li className="!my-[30px]">
              <NavLink
                href="#"
                className="block text-white hover:text-black transition-all duration-300"
                onClick={toggleMenu}
              >
                {t("Account")}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default HeaderManage;