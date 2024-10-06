import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, InputNumber, Spin, Breadcrumb } from "antd";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { useGetProductBySlug } from "../../../hooks/product/useGetProductBySlug";
import { manageCartActions } from "../../../store/manageCart/slice"; // Redux slice
import { usePostCarts } from "../../../hooks/manageCart/usePostCarts"; // Hook post carts
import { useGetCartByUserId } from "../../../hooks/manageCart/useGetCartByUserId"; // Hook get cart
import ProductFeedback from "./ProductFeedback"; // Component Feedback
import { PATH } from "../../../constant";

const ProductDetail = () => {
  // const { id: prdId } = useParams();
  // const parseID = parseInt(prdId);
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1); // Mặc định là 1
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;

  const cart = useSelector((state) => state.manageCart.cart);
  const cartCount = useSelector((state) => state.manageCart.cartCount);

  const { data: product, refetch, isFetching } = useGetProductBySlug(slug);
  console.log(product);

  const prdId = product?.id;
  console.log(prdId);
  const { data: carts, refetch: refetchCart } = useGetCartByUserId(userId);

  const mutate = usePostCarts();

  useEffect(() => {
    refetch();
    refetchCart();

    // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
    const isProductInCart = carts?.find((item) => item.productId === product?.id);
    console.log(isProductInCart);

    if (isProductInCart) {
      setQuantity(isProductInCart.quantity); // Nếu có, thiết lập quantity từ giỏ hàng
    } else {
      setQuantity(1); // Nếu chưa có, mặc định là 1
    }
  }, [slug, userId, product?.id, carts]);

  const onChangeQuantity = (value) => {
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!userLogin) {
      toast.error("Please login to add to cart");
      return;
    }

    const payload = {
      userId: userLogin?.id,
      productId: product?.id,
      quantity: quantity,
    };

    console.log(payload);

    const isProductInCart = carts?.find((item) => item.productId === product.id);
    console.log(isProductInCart);

    if (isProductInCart) {
      const updatedQuantity = quantity;

      console.log("updatedQuantity", updatedQuantity);

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
            toast.success("Product quantity updated in cart");
          },
          onError: () => {
            toast.error("This product existed in cart");
          },
        }
      );
    } else {
      dispatch(manageCartActions.setCartCount(cartCount + 1));
      dispatch(manageCartActions.addToCart({ ...product, quantity }));

      mutate.mutate(payload, {
        onSuccess: () => {
          refetchCart();
          toast.success("Product added to cart");
        },
        onError: (error) => {
          console.log(error);
          toast.error(error?.response?.data?.message);
        },
      });
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center fixed top-0 bottom-0 left-0 right-0 items-center">
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
                value={quantity} // Thiết lập giá trị quantity từ state
                onChange={onChangeQuantity} // Thay đổi số lượng sản phẩm
                style={{
                  width: "60px",
                }}
              />
              <span className="mx-[10px]">|</span>
              {product?.disabled || product?.stock == 0 ? (
                <Button className="bg-gray-300 text-white px-[20px] py-[10px] hover:!bg-gray-300 hover:!border-none hover:!text-white rounded-md cursor-not-allowed">
                  Out of stock
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
