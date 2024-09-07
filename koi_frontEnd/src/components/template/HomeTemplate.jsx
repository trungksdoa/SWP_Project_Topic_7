import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { useTranslation } from 'react-i18next'

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

  return (
    <div>
      <AnimatedSection className="grid grid-cols-3">
        <div className="col-span-1 flex flex-col justify-center items-center ml-[100px]">
          <h1 className="text-[52px] font-bold">
            {t("KoiControl - The Koi Web For Your Pond")}
          </h1>
          <p className="text-[24px] text-gray-500">
            {t("Manage your water parameters, your koi and your ponds in our koi app!")}
          </p>
        </div>
        <div className="col-span-2 flex justify-center items-center">
          <img
            className="w-[100%] mb-[100px] h-auto"
            src="../../images/image1.png"
            alt="image1"
          />
        </div>
      </AnimatedSection>

      <AnimatedSection className="grid grid-cols-3 mb-[100px]">
        <div className="col-span-1 flex justify-center items-center">
          <img
            className="w-[70%] h-auto"
            src="../../images/image2.png"
            alt="image2"
          />
        </div>
        <div className="col-span-2 flex flex-col justify-center items-center ml-[100px]">
          <h1 className="text-[52px] font-bold">
            {t("Determine the ideal amount of food!")}
          </h1>
          <p className="text-[24px] text-gray-500">
            {t("How much food do your koi need to grow ideally? Our integrated food calculator provides you with the answer. Based on your koi population and the water temperature, our food calculator automatically calculates the recommended amount of food for your koi. KoiControl can determine the weight very accurately based on the length of the fish.")}
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="grid grid-cols-3 mb-[100px]">
        <div className="col-span-1 flex flex-col justify-center items-center ml-[100px]">
          <h1 className="text-[52px] font-bold">
            {t("Calculate the correct amount of salt for treatments!")}
          </h1>
          <p className="text-[24px] text-gray-500">
            {t("Salt is a popular tool for treating koi diseases, as it is both cheap and effective against some parasites or algae. However, meticulous care must be taken to achieve the correct concentration. With the salt calculator you can calculate the correct dosage for each of your managed ponds without errors and without calculators.")}
          </p>
        </div>
        <div className="col-span-2 flex justify-center items-center">
          <img
            className="w-[30%] h-auto"
            src="../../images/image3.png"
            alt="image3"
          />
        </div>
      </AnimatedSection>
    </div>
  );
};

export default HomeTemplate;
