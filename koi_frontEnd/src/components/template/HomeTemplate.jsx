import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { useTranslation } from 'react-i18next'
import { Button, Modal } from "antd";
import LoginForm from "../ui/auth/LoginForm";
import RegisterForm from "../ui/auth/RegisterForm";
import ForgotPassword from "../ui/auth/ForgotPassword";
import { useSelector } from "react-redux"; // Add this import

const AnimatedSection = ({ children, className }) => {
  const [isInitiallyVisible, setIsInitiallyVisible] = useState(false);
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    // Check if the element is initially visible
    if (isVisible && !isInitiallyVisible) {
      setIsInitiallyVisible(true);
    }
  }, [isVisible]);

  const fadeUp = useSpring({
    opacity: isInitiallyVisible || isVisible ? 1 : 0,
    transform: isInitiallyVisible || isVisible ? "translateY(0)" : "translateY(50px)",
    config: { duration: 1000 },
  });

  return (
    <animated.div ref={ref} style={fadeUp} className={className}>
      {children}
    </animated.div>
  );
};

const HomeTemplate = () => {
  const { t } = useTranslation();
  const [isModalLogin, setIsModalLogin] = useState(false);
  const [isModalRegister, setIsModalRegister] = useState(false);
  const [isModalForgotPassword, setIsModalForgotPassword] = useState(false);
  
  // Add this line to get the user's login status from Redux store
  const userLogin = useSelector((state) => state.manageUser.userLogin);

  const showModalLogin = () => {
    setIsModalRegister(false);
    setIsModalForgotPassword(false);
    setIsModalLogin(true);
  };

  const showModalRegister = () => {
    setIsModalLogin(false);
    setIsModalForgotPassword(false);
    setIsModalRegister(true);
  };

  const showModalForgotPassword = () => {
    setIsModalLogin(false);
    setIsModalRegister(false);
    setIsModalForgotPassword(true);
  };

  const handleOkLogin = () => {
    setIsModalLogin(false);
  };

  const handleCancelLogin = () => {
    setIsModalLogin(false);
  };

  const handleCancelRegister = () => {
    setIsModalRegister(false);
  };

  const handleCancelForgotPassword = () => {
    setIsModalForgotPassword(false);
  };

    return (
      <div className="container mx-auto">
        <AnimatedSection className="flex flex-col md:flex-row items-center justify-between text-right py-20">
          <div className="w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("KoiControl - The Koi Web For Your Pond")}
            </h1>
            <p className="text-xl text-gray-600">
              {t("Manage your water parameters, your koi and your ponds in our koi app!")}
            </p>
          </div>
          <div className="w-1/5">

          </div>
          <div className="w-1/2 flex justify-center">
            <img
              className="w-full max-w-md h-auto"
              src="../../images/image1.png"
              alt="KoiControl App"
            />
          </div>
        </AnimatedSection>
  
        <AnimatedSection className="flex flex-col md:flex-row-reverse items-center justify-between text-left py-20">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("Determine the ideal amount of food!")}
            </h1>
            <p className="text-xl text-gray-600">
              {t("How much food do your koi need to grow ideally? Based on your koi population and the water temperature, our food calculator automatically calculates the recommended amount of food for your koi.")}
            </p>
          </div>
          <div className="w-1/5">

          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              className="w-full max-w-md h-auto"
              src="../../images/image2.png"
              alt="Food Calculator"
            />
          </div>
        </AnimatedSection>
  
        <AnimatedSection className="flex flex-col md:flex-row items-center justify-between text-right py-20">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("Calculate the correct amount of salt!")}
            </h1>
            <p className="text-xl text-gray-600">
              {t("Salt is a popular tool for treating koi diseases, as it is both cheap and effective against some parasites or algae. With the salt calculator you can calculate the correct dosage for each of your managed ponds without errors and without calculators.")}
            </p>
          </div>
          <div className="w-1/5">

          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              className="w-full max-w-md h-auto"
              src="../../images/image3.png"
              alt="Salt Calculator"
            />
          </div>
        </AnimatedSection>

      {/* Conditionally render the "Ready to make a splash?" section */}
      {!userLogin && (
        <AnimatedSection className="flex items-center justify-center text-center py-20">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-5">
              {t("Ready to make a splash?")} 
            </h1>
            <Button 
              className="bg-black text-white py-8 rounded-md mb-6 text-4xl md:text-5xl font-bold"
              onClick={showModalLogin}
            >
              {t("Join us now!")}
            </Button>
          </div>
        </AnimatedSection>
      )}
      <div className="py-8"/>


      <Modal
        title=""
        open={isModalLogin}
        onOk={handleOkLogin}
        onCancel={handleCancelLogin}
      >
        <LoginForm
          showModalRegister={showModalRegister}
          handleOkLogin={handleOkLogin}
          showModalForgotPassword={showModalForgotPassword}
        />
      </Modal>
      <Modal
        title=""
        open={isModalRegister}
        onOk={handleCancelRegister}
        onCancel={handleCancelRegister}
      >
        <RegisterForm showModalLogin={showModalLogin} />
      </Modal>
      <Modal
        title=""
        open={isModalForgotPassword}
        onOk={handleCancelForgotPassword}
        onCancel={handleCancelForgotPassword}
      >
        <ForgotPassword showModalLogin={showModalLogin} />
      </Modal>
    </div>
  );
};

export default HomeTemplate;