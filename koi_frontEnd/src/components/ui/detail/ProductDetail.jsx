import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, InputNumber, Spin, Breadcrumb, message } from "antd";
import { useTranslation } from "react-i18next";
import { useGetProductBySlug } from "../../../hooks/product/useGetProductBySlug";
import { manageCartActions } from "../../../store/manageCart/slice"; // Redux slice
import { usePostCarts } from "../../../hooks/manageCart/usePostCarts"; // Hook post carts
import { useGetCartByUserId } from "../../../hooks/manageCart/useGetCartByUserId"; // Hook get cart
import ProductFeedback from "./ProductFeedback"; // Component Feedback
import { PATH } from "../../../constant";

const ProductDetail = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1); // Mặc định là 1
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;

  const cartCount = useSelector((state) => state.manageCart.cartCount);

  // Lấy sản phẩm dựa trên slug và sử dụng staleTime để tránh gọi lại API không cần thiết
  const { data: product, refetch, isFetching } = useGetProductBySlug(slug, {
    staleTime: 60000, // Dữ liệu không stale trong 60 giây
    cacheTime: 300000, // Giữ dữ liệu trong cache 5 phút
  });

  const prdId = product?.id;

  // Lấy giỏ hàng dựa trên userId và cache lại
  const { data: carts, refetch: refetchCart } = useGetCartByUserId(userId, {
    staleTime: 60000,
    cacheTime: 300000,
  });

  const mutate = usePostCarts();

  useEffect(() => {
    // Gọi refetch chỉ khi cần thiết (slug hoặc userId thay đổi)
    refetch();
    refetchCart();

    // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
    const isProductInCart = carts?.find((item) => item.productId === product?.id);
    if (isProductInCart) {
      setQuantity(isProductInCart.quantity); // Nếu có, thiết lập quantity từ giỏ hàng
    } else {
      setQuantity(1); // Nếu chưa có, mặc định là 1
    }
  }, [slug, userId]); // Chỉ phụ thuộc vào slug và userId

  const onChangeQuantity = (value) => {
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!userLogin) {
      message.error("Please login to add to cart");
      return;
    }

    const payload = {
      userId: userLogin?.id,
      productId: product?.id,
      quantity: quantity,
    };

    const isProductInCart = carts?.find((item) => item.productId === product.id);

    if (isProductInCart) {
      const updatedQuantity = quantity;

      dispatch(
        manageCartActions.updateCartQuantity({
          productId: product.id,
          quantity: updatedQuantity,
        })
      );

      mutate.mutate(
        { ...payload, quantity: updatedQuantity },
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
    } else {
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
    }
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
        <Breadcrumb.Item
          className="cursor-pointer"
          onClick={() => {
            navigate(PATH.HOME);
          }}
        >
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item
          className="cursor-pointer"
          onClick={() => {
            navigate(PATH.STORE);
          }}
        >
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
                style={{
                  width: "60px",
                }}
              />
              <span className="mx-[10px]">|</span>
              {product?.disabled || product?.stock == 0 ? (
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

        {/* Component Feedback */}
        <ProductFeedback prdId={prdId} />
      </div>
    </div>
  );
};

export default ProductDetail;
