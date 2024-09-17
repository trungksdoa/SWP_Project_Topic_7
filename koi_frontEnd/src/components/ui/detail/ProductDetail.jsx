import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetProductById } from "../../../hooks/user/UserGetProductById";
import { InputNumber } from "antd";

const ProductDetail = () => {
  const onChange = (value) => {
    console.log("changed", value);
  };

  const { id: prdId } = useParams();
  const parseID = parseInt(prdId);
  const { data: product, refetch } = useGetProductById(parseID);
  console.log(product);
  useEffect(() => {
    refetch();
  }, [parseID]);
  return (
    <div className="container w-[80%] mx-auto my-[60px]">
      <div className="grid grid-cols-2 gap-[60px]">
        <div className="col-span-1">
          <img src={product?.imageUrl} className="w-full" alt={product?.name} />
        </div>
        <div className="col-span-1">
          <h1 className="text-orange-500 font-semibold">{product?.name}</h1>
          <div className="mb-[20px]">
            <InputNumber
              min={1}
              max={100}
              defaultValue={1}
              onChange={onChange}
            />
            <span className="mx-[10px]">|</span>
            <button className="bg-orange-500 text-white px-[20px] py-[10px] rounded-md hover:bg-orange-600 transition-all duration-300">
              Add to cart
            </button>
          </div>
          <div className="flex">
            <p className="font-bold mr-[10px]">Price: </p>
            <p>{product?.price}</p>
          </div>
          <div className="my-[20px]">
            <span className="font-bold  mr-[10px]">Description: </span>
            <span>{product?.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
