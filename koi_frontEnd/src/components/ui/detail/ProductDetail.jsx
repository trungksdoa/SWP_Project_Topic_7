import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, InputNumber, Spin, Breadcrumb, message } from "antd";
import { useTranslation } from "react-i18next";
import { useGetProductBySlug } from "../../../hooks/product/useGetProductBySlug";
import { manageCartActions } from "../../../store/manageCart/slice";
import { usePostCarts } from "../../../hooks/manageCart/usePostCarts";
import { useGetCartByUserId } from "../../../hooks/manageCart/useGetCartByUserId";
import ProductFeedback from "./ProductFeedback";
import { PATH } from "../../../constant";

const ProductDetail = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const cartCount = useSelector((state) => state.manageCart.cartCount);

  const { data: product, refetch, isFetching } = useGetProductBySlug(slug, {
    staleTime: 60000,
    cacheTime: 300000,
  });

  const { data: carts, refetch: refetchCart } = useGetCartByUserId(userId, {
    staleTime: 60000,
    cacheTime: 300000,
  });

  const mutate = usePostCarts();

  useEffect(() => {
    refetch();
    refetchCart();
    updateQuantityInCart();
  }, [slug, userId]);

  const updateQuantityInCart = () => {
    const isProductInCart = carts?.find((item) => item.productId === product?.id);
    setQuantity(isProductInCart ? isProductInCart.quantity : 1);
  };

  const onChangeQuantity = (value) => {
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!userLogin) {
      message.error("Please login to add to cart");
      return;
    }

    const payload = {
      userId: userLogin.id,
      productId: product.id,
      quantity,
    };

    const isProductInCart = carts?.find((item) => item.productId === product.id);

    if (isProductInCart) {
      updateCartQuantity(payload);
    } else {
      addToCart(payload);
    }
  };

  const updateCartQuantity = (payload) => {
    dispatch(manageCartActions.updateCartQuantity({
      productId: product.id,
      quantity,
    }));

    mutate.mutate(
      { ...payload, quantity },
      {
        onSuccess: () => {
          refetchCart();
          message.success("Product quantity updated in cart");
        },
        onError: () => {
          message.error("This product existed in cart");
          navigate(PATH.CART);
        },
      }
    );
  };

  const addToCart = (payload) => {
    dispatch(manageCartActions.setCartCount(cartCount + 1));
    dispatch(manageCartActions.addToCart({ ...product, quantity }));

    mutate.mutate(payload, {
      onSuccess: () => {
        refetchCart();
        message.success("Product added to cart");
      },
      onError: (error) => {
        message.error(error?.response?.data?.message);
      },
    });
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[450px]">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb className="mt-[15px]">
        <Breadcrumb.Item className="cursor-pointer" onClick={() => navigate(PATH.HOME)}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item className="cursor-pointer" onClick={() => navigate(PATH.STORE)}>
          Store
        </Breadcrumb.Item>
        <Breadcrumb.Item>Product Detail</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container w-[60%] mx-auto my-[60px]">
        <div className="grid grid-cols-2 gap-[60px]">
          <div className="col-span-1">
            <img src={product?.imageUrl} className="w-full" alt={product?.name} />
          </div>
          <div className="col-span-1">
            <h1 className="text-black font-bold text-3xl">{product?.name}</h1>
            <div className="flex">
              <p className="font-bold mr-[6px]">Price: </p>
              <p>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product?.price)}
              </p>
            </div>
            <div className="my-[20px]">
              <InputNumber
                min={1}
                max={100}
                value={quantity}
                onChange={onChangeQuantity}
                style={{ width: "60px" }}
              />
              <span className="mx-[10px]">|</span>
              {product?.disabled || product?.stock === 0 ? (
                <Button className="bg-gray-300 text-white px-[20px] py-[10px] hover:!bg-gray-300 hover:!border-none hover:!text-white rounded-md cursor-not-allowed">
                  Item is not available
                </Button>
              ) : (
                <Button
                  loading={mutate.isPending}
                  className="bg-black text-white px-[20px] py-[10px] rounded-md hover:bg-black transition-all duration-300"
                  onClick={handleAddToCart}
                >
                  Add to cart
                </Button>
              )}
            </div>
            <div className="my-[20px]">
              <span className="font-bold mr-[6px]">Description: </span>
              <span>{product?.description}</span>
            </div>
          </div>
        </div>
        <hr className="border-gray-600 my-[40px]" />
        <ProductFeedback prdId={product?.id} averageRating={product?.averageRating} />
      </div>
    </div>
  );
};

export default ProductDetail;
