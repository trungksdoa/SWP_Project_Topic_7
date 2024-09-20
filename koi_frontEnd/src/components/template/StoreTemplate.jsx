import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import { Card } from "antd";
const { Meta } = Card;
import { useTranslation } from "react-i18next";
import { useGetAllProducts } from "../../hooks/admin/manageProducts/UseGetAllProducts";
import { Checkbox, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constant";
import { manageCartActions } from "../../store/manageCart/slice";
import { toast } from "react-toastify";
import { usePostCarts } from "../../hooks/manageCart/usePostCarts";
import { useGetCartByUserId } from "../../hooks/manageCart/useGetCartByUserId";

const StoreTemplate = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const mutate = usePostCarts();
  const { data: lstProducts, isLoading, isFetching } = useGetAllProducts();
  const { data: carts, refetch } = useGetCartByUserId(userId);
  console.log(carts)
  // console.log(carts);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const cart = useSelector((state) => state.manageCart.cart);
  const cartCount = useSelector((state) => state.manageCart.cartCount);

  // check prd has in cart

  const addToCart = (product) => {
    const payload = {
      userId: userLogin?.id,
      productId: product?.id,
      quantity: 1,
    };
    if (!userLogin) {
      toast.error("Please login to add to cart");
      return; 
    }
    
    const isProductInCart = cart.find((item) => item.id === product.id);
    
    if (isProductInCart) {
      const updatedQuantity = isProductInCart.quantity + 1;
      dispatch(manageCartActions.updateCartQuantity({ productId: product.id, quantity: updatedQuantity }));
      mutate.mutate({ ...payload, quantity: updatedQuantity }, {
        onSuccess: () => {
          refetch(); // Refetch cart data after updating
          toast.success("Product quantity updated in cart");
        },
        onError: () => {
          toast.error("Failed to update product quantity in cart");
        },
      });
    } else {
      dispatch(manageCartActions.setCartCount(cartCount + 1));
      dispatch(manageCartActions.addToCart({ ...product, quantity: 1 }));
      mutate.mutate(payload, {
        onSuccess: () => {
          refetch(); // Refetch cart data after adding
          toast.success("Product added to cart");
        },
        onError: () => {
          toast.error("Failed to add product to cart");
        },
      });
    }
  };

  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };

  if (isFetching) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large"></Spin>
      </div>
    );
  }

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
                    className="min-h-[340px] object-contain mt-[10px]"
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
                    className="border-[1px] hover:bg-black hover:text-white transition-all duration-300 border-gray-300 rounded-[6px] px-[20px] py-[10px]"
                    onClick={() =>
                      navigate(`${PATH.DETAIL_PRODUCT}/${prd?.id}`)
                    }
                  >
                    View Detail
                  </button>
                  <button
                    className="bg-black text-white rounded-[6px] px-[20px] py-[10px]"
                    onClick={() => {
                      addToCart(prd);
                    }}
                  >
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
