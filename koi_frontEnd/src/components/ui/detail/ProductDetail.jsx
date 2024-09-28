import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductById } from "../../../hooks/user/UserGetProductById";
import { InputNumber, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { StarRating } from "./StarRating";
import { useSelector } from "react-redux";
import { usePostFeedBack } from "../../../hooks/feedback/usePostFeedback";
import { useGetFeedbackById } from "../../../hooks/feedback/useGetFeedbackById";
import ProductFeedback from "./ProductFeedback";

const ProductDetail = () => {
  const [productId, setProductId] = useState(null); // New state for product ID
  const onChange = (value) => {};
  const { t } = useTranslation();
  const { id: prdId } = useParams();
  const parseID = parseInt(prdId);
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const {
    data: product,
    refetch,
    isLoading,
    isFetching,
  } = useGetProductById(productId || parseID);
  const formik = useFormik({
    initialValues: {
      userId: userLogin?.id,
      productId: product?.id || parseID,
      rating: 0,
      comment: "",
    },
    onSubmit: (values) => {
      mutation.mutate(values, {
        onSuccess: () => {
          formik.resetForm();
          toast.success("Add Feedback Successfully !");
        },
      });
    },
  });

  useEffect(() => {
    setProductId(parseID); // Set productId when prdId changes
    refetch(); // Refetch when productId changes
  }, [parseID]);

  useEffect(() => {
    if (product) {
      formik.setValues({
        userId: userLogin?.id,
        productId: product.id,
        rating: 0,
        comment: "",
      });
    }
  }, [product]); // Update formik values when product changes

  if (isFetching) {
    return (
      <div className="flex justify-center fixed top-0 bottom-0 left-0 right-0 items-center">
        <Spin tip="Loading" size="large"></Spin>
      </div>
    );
  }

  return (
    <div className="container w-[60%] mx-auto my-[60px]">
      <div className="grid grid-cols-2 gap-[60px]">
        <div className="col-span-1">
          <img
            src={product?.imageUrl}
            className="w-[80%]"
            alt={product?.name}
          />
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
      <hr className="border-gray-600 my-[40px]" />

      <ProductFeedback parseID={parseID} />

    </div>
  );
};

export default ProductDetail;
