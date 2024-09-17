import React from "react";
import { Card } from "antd";
const { Meta } = Card;
import { useTranslation } from "react-i18next";
import { useGetAllProducts } from "../../hooks/admin/manageProducts/UseGetAllProducts";
import { Checkbox, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constant";

const StoreTemplate = () => {
  const { data: lstProducts } = useGetAllProducts();
  const { t } = useTranslation();
  console.log(lstProducts);
  const navigate = useNavigate();

  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };
  return (
    <div className="grid grid-cols-4 my-[40px] gap-[30px]">
      <div className="">
        <div className="flex justify-between items-center rounded-[6px] mb-[30px] bg-gray-100 px-[15px] py-[10px]">
          <p className="text-2xl">Filter</p>
        </div>
        <div className="border-[1px] border-gray-300 rounded-[6px] px-[15px] py-[10px]">
          <Checkbox.Group
            style={{
              width: "100%",
            }}
            onChange={onChange}
          >
            <Row className="flex flex-col">
              <Row className="mb-[15px] !w-full" span={8}>
                <Checkbox value="A">Water Treatment</Checkbox>
              </Row>
              <Row span={8}>
                <Checkbox value="B">Koi Treatment</Checkbox>
              </Row>
            </Row>
          </Checkbox.Group>
        </div>
      </div>
      <div className="col-span-3">
        <div className="flex justify-between items-center rounded-[6px] mb-[30px] bg-gray-100 px-[15px] py-[10px]">
          <h1 className="text-2xl m-0">{t("Products")}</h1>
          <p>{t("Sort")}</p>
        </div>
        <div className="grid grid-cols-3 gap-[30px]">
          {lstProducts?.map((prd, index) => {
            return (
              <Card
                className="col-span-1 p-[20px]"
                key={index}
                cover={
                  <img
                    alt="example"
                    className="max-h-[200px] object-contain mt-[10px]"
                    src={prd?.imageUrl}
                  />
                }
              >
                <div className="flex justify-center items-center">
                  <h1 className="text-[16px]">{prd?.name}</h1>
                </div>
                <div>
                  <p>Price: ${prd?.price}</p>
                </div>
                <div className="flex justify-between items-center mt-[20px]">
                  <button
                    className="border-[1px] border-gray-300 rounded-[6px] px-[20px] py-[10px]"
                    onClick={() =>
                      navigate(`${PATH.DETAIL_PRODUCT}/${prd?.id}`)
                    }
                  >
                    View Detail
                  </button>
                  <button className="bg-orange-500 text-white rounded-[6px] px-[20px] py-[10px]">
                    Add to Cart
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoreTemplate;
