import React from "react";
import { useGetPackage } from "../../../hooks/admin/managePackages/useGetPackage";
import { useGetUserById } from "../../../hooks/user/useGetUserById";
import { useSelector } from "react-redux";
import { usePostPackage } from "../../../hooks/user/usePostPackage";
import { Spin } from "antd";

const PackagesComponent = () => {
  const { data: lstPackage, isFetching } = useGetPackage();
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const { data: user } = useGetUserById(userLogin?.id);
  const mutation = usePostPackage();
  const userPackage = user?.userPackage;
  const userPackageId = userPackage?.id;

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const handleBuyNow = (packageId) => {
    const payload = { packageId };
    mutation.mutate(payload, {
      onSuccess: (res) => {
        window.location.href = res?.data?.data?.shortLink;
      },
      onError: () => {},
    });
  };

  const firstRow = lstPackage?.slice(0, 3) || [];
  const secondRow = lstPackage?.slice(3) || [];

  const getPackageStyle = (packageName) => {
    const name = packageName.toLowerCase();
    switch (name) {
      case 'advanced':
        return { header: 'bg-[#FAF3E1]', text: 'text-gray-800' };
      case 'professional':
        return { header: 'bg-[#F5E7C6]', text: 'text-gray-800' };
      case 'vip':
        return { header: 'bg-[#FF6D1F]', text: 'text-white' };
      case 'svip':
        return { header: 'bg-[#222222]', text: 'text-white' };
      default:
        return { header: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const PackageCard = ({ pkg, index, isFirstRow }) => {
    const isUserPackage = userPackageId === pkg?.id;
    const isDisabled = (isFirstRow && index === 0) || pkg?.id < userPackageId;
    const style = getPackageStyle(pkg?.name);
    const isLoading = mutation.isPending && mutation.variables?.packageId === pkg?.id;

    return (
      <div
        className={`
          relative overflow-hidden rounded-lg bg-white shadow-lg transform transition-all duration-300 hover:-translate-y-2
          ${isUserPackage ? 'ring-4 ring-blue-500' : ''}
        `}
      >
        {isUserPackage && (
          <div className="absolute top-2 right-2">
            <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              Current Plan
            </span>
          </div>
        )}
        
        <div className={`px-4 py-4 text-center ${style.header}`}>
          <h3 className={`text-xl font-bold mb-1 ${style.text}`}>
            {pkg?.name}
          </h3>
          <div className={`text-2xl font-bold mb-2 ${style.text}`}>
            {new Intl.NumberFormat('vi-VN', { 
              style: 'currency', 
              currency: 'VND' 
            }).format(pkg?.price)}
          </div>
        </div>

        <div className="px-4 py-4 bg-white">
          <ul className="space-y-2 mb-4">
            <li className="flex items-center text-gray-600 text-sm">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Fish Slots: {pkg?.fishSlots}
            </li>
            <li className="flex items-center text-gray-600 text-sm">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Pond Slots: {pkg?.pondSlots}
            </li>
          </ul>

          <button
            onClick={() => {
              if (!isDisabled && !isUserPackage) {
                handleBuyNow(pkg?.id);
              }
            }}
            className={`
              w-full py-2 px-4 rounded-md font-semibold transition-all duration-200 text-sm
              ${isFirstRow && index === 0 
                ? `${style.header} ${style.text} cursor-not-allowed`
                : isUserPackage
                  ? `${style.header} ${style.text} cursor-not-allowed`
                  : isDisabled
                    ? `${style.header} ${style.text} cursor-not-allowed`
                    : `${style.header} ${style.text} hover:opacity-90`
              }
            `}
            disabled={isDisabled || isUserPackage || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Spin size="small" />
                <span className="ml-2">Processing...</span>
              </div>
            ) : (
              isFirstRow && index === 0 ? "Default" : isUserPackage ? "Current Plan" : "Upgrade Now"
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Choose Your Package
        </h1>
        
        {/* First Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {firstRow.map((pkg, index) => (
            <PackageCard key={index} pkg={pkg} index={index} isFirstRow={true} />
          ))}
        </div>

        {/* Second Row - Centered */}
        {secondRow.length > 0 && (
          <div className="flex justify-center w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[600px]">
              {secondRow.map((pkg, index) => (
                <PackageCard key={index} pkg={pkg} index={index} isFirstRow={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagesComponent;