import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductById } from "../../../hooks/user/UserGetProductById";
import { InputNumber } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";

const ProductDetail = () => {
  const [productId, setProductId] = useState(null); // New state for product ID
  const onChange = (value) => {
    console.log("changed", value);
  };

  const { id: prdId } = useParams();
  const parseID = parseInt(prdId);
  const {
    data: product,
    refetch,
    isLoading,
    isFetching,
  } = useGetProductById(productId || parseID); // Use productId state

  useEffect(() => {
    setProductId(parseID); // Set productId when prdId changes
    refetch(); // Refetch when productId changes
  }, [parseID]);

  if (isFetching) {
    return (
      <div className="flex justify-center fixed top-0 bottom-0 left-0 right-0 items-center">
        <Spin tip="Loading" size="large"></Spin>
      </div>
    );
  }

  return (
    <div className="container w-[80%] mx-auto my-[60px]">
      <div className="grid grid-cols-2 gap-[60px]">
        <div className="col-span-1">
          <img src={product?.imageUrl} className="w-[80%]" alt={product?.name} />
        </div>
        <div className="col-span-1">
          <h1 className="text-black font-semibold">{product?.name}</h1>

          <div className="flex">
            <p className="font-bold mr-[6px]">Price: </p>
            <p>${product?.price}</p>
          </div>
          <div className="my-[20px]">
            <InputNumber
              min={1}
              max={100}
              defaultValue={1}
              onChange={onChange}
              style={{
                width: "60px",
              }}
            />
            <span className="mx-[10px]">|</span>
            <button className="bg-black text-white px-[20px] py-[10px] rounded-md hover:bg-black transition-all duration-300">
              Add to cart
            </button>
          </div>
          <div className="my-[20px]">
            <span className="font-bold  mr-[6px]">Description: </span>
            <span>{product?.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
