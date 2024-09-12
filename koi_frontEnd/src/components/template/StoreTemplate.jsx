import React from "react";
import { Card } from "antd";
const { Meta } = Card;
import { useTranslation } from "react-i18next";

const StoreTemplate = () => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-4 my-[40px] gap-[30px]">
      <div className="col-span-1 border-[1px] rounded-[6px]"></div>
      <div className="col-span-3">
        <div className="flex justify-between items-center rounded-[6px] mb-[30px] bg-gray-100 px-[15px] py-[10px]">
          <h1 className="text-2xl m-0">{t("Products")}</h1>
          <p>{t("Sort")}</p>
        </div>
        <div className="grid grid-cols-3 gap-[30px]">
          {Array.from({ length: 10 }).map((_, index) => {
            return (
              <Card
                className="col-span-1"
                key={index}
                cover={
                  <img
                    alt="example"
                    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                  />
                }
              >
                <h1 className="text-[16px]">Electronic Salt Meter</h1>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoreTemplate;
