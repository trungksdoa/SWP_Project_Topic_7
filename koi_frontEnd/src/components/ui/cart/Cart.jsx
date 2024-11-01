import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCartByUserId } from "../../../hooks/manageCart/useGetCartByUserId";
// import { manageProductThunks } from "../../../store/manageProduct";
import { InputNumber, Spin, Skeleton, Space, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDeleteProductsInCarts } from "../../../hooks/manageCart/useDeleteProductsInCarts";
import { usePutCarts } from "../../../hooks/manageCart/usePutCarts";
import { NavLink, useNavigate } from "react-router-dom";
import { PATH } from "../../../constant";
import LoadingSpinner from "../../layouts/LoadingSpinner";

const Cart = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const { data: carts, refetch, isFetching } = useGetCartByUserId(userLogin?.id);
  const mutationPutCart = usePutCarts();
  const navigate = useNavigate();

  const [isUpdating, setIsUpdating] = useState(false);

  const [hasInvalidQuantity, setHasInvalidQuantity] = useState(false);

  const checkQuantities = useCallback(() => {
    if (carts) {
      const invalid = carts.some((product) => product.quantityChanged);
      setHasInvalidQuantity(invalid);
    }
  }, [carts]);

  useEffect(() => {
    checkQuantities();
  }, [carts, checkQuantities]);

  const onChange = (value, productId) => {
    if (value && !isNaN(value)) {
      setIsUpdating(true);
      mutationPutCart.mutate(
        {
          id: userLogin?.id,
          payload: { productId, quantity: value },
        },
        {
          onSuccess: (res) => {
            if (res && res.data) {
              const { mess } = res.data;
              message.success(
                mess || "Updated product quantity successfully!"
              );
              refetch(); // Refetch cart data after successful update
            }
            setIsUpdating(false);
          },
          onError: (error) => {
            message.error(
              error?.response?.data?.mess ||
                "Failed to update product quantity."
            );
            setIsUpdating(false);
          },
        }
      );
    }
  };

  const mutate = useDeleteProductsInCarts();

  const handleDeleteCart = (productId, quantity) => {
    Modal.confirm({
      title: "Delete Item",
      content: "Are you sure you want to remove this item from your cart?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteCartItem(productId, quantity);
      },
    });
  };

  const deleteCartItem = async (productId, quantity) => {
    try {
      await mutate.mutateAsync(
        { productId, userId: userLogin?.id, quantity },
        {
          onSuccess: (response) => {
            message.success("Delete product in cart successfully!");
            refetch();
          },
          onError: (error) => {
            console.error("API Error:", error);
            message.error("Failed to delete product from cart.");
          },
        }
      );
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item from cart.");
    }
  };

  const totalItems = carts?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice =
    carts?.reduce((sum, item) => sum + item.quantity * item.price, 0) || 0;

  if (isFetching) {
    return <LoadingSpinner />;
  }

  if (carts?.length === 0) {
    return (
      <div className="h-[450px]">
        <div className="flex justify-center items-center">
          <img
            src="../../../../images/cart-empty.png"
            className="w-[30%] h-[30%]"
            alt="empty"
          />
        </div>
        <div className="mb-[60px]">
          <h2 className="text-orange-500 text-center mb-[8px] text-[32px]">
            Your cart is empty. Please visit our store to add some items.
          </h2>
          <div className="flex justify-center">
            <NavLink
              className="underline hover:!text-orange-500 transition-all duration-300"
              to={PATH.STORE}
            >
              Go To Store
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[60%] my-[40px] mx-auto">
      <div className="w-full justify-between items-center px-[40px] flex p-[15px] bg-white mb-[30px] rounded-[12px]">
        <h2 className="text-center w-[20%]">Image</h2>
        <h2 className="text-center w-[40%]">Name</h2>
        <h2 className="text-center w-[15%]">Price</h2>
        <h2 className="text-center w-[15%]">Quantity</h2>
        <h2 className="text-center w-[10%]">Action</h2>
      </div>
      {carts?.map((product, index) => {
        // setIsAvailable(product?.stock < product?.quantity);
        return (
          <div key={index} className="mb-[30px]">
            <div className="w-full items-center justify-between px-[40px] flex p-[15px] bg-white rounded-t-[12px]">
              <div className="w-[20%] flex justify-center">
                <img
                  src={product?.imageUrl}
                  className="w-20 h-20 object-contain"
                  alt=""
                />
              </div>
              <h2 className="w-[40%] text-center">{product?.name}</h2>
              <p className="w-[15%] text-center">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product?.price)}
              </p>
              <div className="w-[15%] flex justify-center">
                <InputNumber
                  min={1}
                  max={product?.stock}
                  className={`${product.quantityChanged ? "" : "text-red-500"}`}
                  type="number"
                  value={product?.quantity}
                  disabled={mutate.isPending}
                  onChange={(value) => onChange(value, product?.productId)}
                  style={{
                    width: "100%",
                    textAlign: "center",
                  }}
                />
              </div>
              <div className="w-[10%] flex justify-center">
                <DeleteOutlined
                  style={{
                    color: "red",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDeleteCart(product?.productId)}
                />
              </div>
            </div>
            {product?.message && (
              <div className="w-full px-[40px] py-[10px] bg-yellow-100 text-yellow-700 rounded-b-[12px]">
                {product.message}
              </div>
            )}
          </div>
        );
      })}
      <div className="w-full justify-between items-center px-[40px] flex p-[15px] bg-white mb-[30px] rounded-[12px]">
        <p>
          Total: <Space />
          {isUpdating ? (
            <Skeleton.Button
              active={true}
              size="small"
              shape="round"
              style={{ width: 5 }}
            />
          ) : (
            <span> {totalItems} items</span>
          )}
        </p>
        <div className="flex items-center">
          <p>
            Total Price:{" "}
            {isUpdating ? (
              <Skeleton.Button
                active={true}
                size="small"
                shape="round"
                style={{ width: 100 }}
              />
            ) : (
              <span className="text-orange-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice)}
              </span>
            )}
          </p>
          <button
            disabled={isUpdating || hasInvalidQuantity}
            className={`rounded-[6px] ml-[30px] px-[30px] py-[10px] ${
              isUpdating || hasInvalidQuantity ? "bg-gray-400" : "bg-black"
            } text-white`}
            onClick={() => {
              navigate(PATH.CHECKOUT);
            }}
          >
            {isUpdating ? <Spin /> : "Check Out"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
