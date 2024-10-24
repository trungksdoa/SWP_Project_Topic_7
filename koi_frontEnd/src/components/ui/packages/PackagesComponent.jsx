import React from "react";
import { useGetPackage } from "../../../hooks/admin/managePackages/useGetPackage";
import { useGetUserById } from "../../../hooks/user/useGetUserById";
import { useSelector } from "react-redux";
import { usePostPackage } from "../../../hooks/user/usePostPackage";
import { Button, Spin } from "antd";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const PackagesComponent = () => {
  const { data: lstPackage, refetch, isFetching } = useGetPackage();
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const { data: user } = useGetUserById(userLogin?.id);
  const mutation = usePostPackage();
  const userPackage = user?.userPackage;
  const userPackageId = userPackage?.id;

  //Màn hình chờ phải đẹp
  if(isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    )
  }

  // Hàm xử lý khi nhấn nút "Buy Now"
  const handleBuyNow = (packageId) => {
    const payload = {
      packageId: packageId // Cập nhật packageId vào payload
    };
    console.log(payload)
    // Gọi mutation để post package
    mutation.mutate(payload, {
      onSuccess: (res) => {
        console.log(res)
        window.location.href = res?.data?.data?.shortLink
      },
      onError:(res) => {
        console.log(res)
      }
    });
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  
  return (
    <div className="my-[150px]">
      <div className="pricing-container">
        {lstPackage?.map((packages, index) => {
          const isUserPackage = userPackageId === packages?.id;
          const isDisabled = index === 0 || packages?.id < userPackageId;

          return (
            <div
              className={`pricing-card card-${index + 1} ${
                isUserPackage ? "user-package" : ""
              }`}
              key={index}
            >
              <div className="wave-container">
                <svg
                  className="wave"
                  viewBox="0 0 1440 320"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#fff"
                    fillOpacity="1"
                    d="M0,64L48,58.7C96,53,192,43,288,64C384,85,480,139,576,154.7C672,171,768,149,864,154.7C960,160,1056,192,1152,186.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  ></path>
                </svg>
              </div>
              <div
                className={`circle-header ${
                  isUserPackage ? "!bg-gray-500" : ""
                }`}
              >
                <h2>{packages?.name}</h2>
                <p>${packages?.price}</p>
              </div>
              <ul className="features !mt-[100px]">
                <li>Fish Slot: {packages?.fishSlots}</li>
                <li>Pond Slot: {packages?.pondSlots}</li>
              </ul>
              <Button
              loading={mutation.isPending}
                className={`buy-btn ${
                  isDisabled ? "!bg-gray-500 !cursor-no-drop" : "cursor-pointer"
                } ${isUserPackage ? "!bg-gray-500 !cursor-no-drop" : ""}`}
                onClick={() => {
                  if (!isDisabled && !isUserPackage) {
                    handleBuyNow(packages?.id); // Gọi hàm handleBuyNow khi click
                  }
                }} 
              >
                {index === 0 ? "Default" : isUserPackage ? "In Use" : "Buy Now"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PackagesComponent;
