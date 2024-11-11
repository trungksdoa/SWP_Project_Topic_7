import { Card } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constant";

const StoreSearch = () => {
  const searchPrd = useSelector((state) => state.manageProduct.searchResult);
  const searchName = useSelector((state) => state.manageProduct.searchName);
  const navigate = useNavigate();
  return (
    <div className="m-[60px]">
      <h2 className="font-semibold mb-[30px] text-[24px]">
        Search product: <span className="text-orange-500">{searchName}</span>
      </h2>
      <div className="grid grid-cols-4 gap-6">
        {searchPrd?.map((prd) => {
          return (
            <Card
              key={prd?.id}
              hoverable
              className="w-full border-2 border-gray-200 shadow-lg"
              onClick={() => navigate(`${PATH.DETAIL_PRODUCT}/${prd?.slug}`)}
              cover={
                <img
                  alt={prd?.name}
                  className="relative z-0 h-48 w-full object-cover cursor-pointer"
                  src={`${prd?.imageUrl}?t=${new Date().getTime()}`}
                  loading="lazy"
                />
              }
            >
              <div className="p-[2px]">
                <h2 className="font-bold min-h-[44px] mb-[5px]">{prd?.name}</h2>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">
                    Price:{" "}
                    <span className="!font-normal text-[16px]">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(prd?.price)}
                    </span>
                  </p>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, index) => {
                      const ratingValue = index + 1;
                      return (
                        <span key={index} className="star-container">
                          {prd?.averageRating >= ratingValue ? (
                            <span className="full-star">★</span>
                          ) : prd?.averageRating >= ratingValue - 0.5 ? (
                            <span className="half-star">★</span>
                          ) : (
                            <span className="empty-star">☆</span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StoreSearch;
