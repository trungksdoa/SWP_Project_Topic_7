import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCartByUserId } from "../../../hooks/manageCart/useGetCartByUserId";
import { manageProductThunks } from "../../../store/manageProduct";
import { InputNumber, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDeleteProductsInCarts } from "../../../hooks/manageCart/useDeleteProductsInCarts";
import { toast } from "react-toastify";
import { usePutCarts } from "../../../hooks/manageCart/usePutCarts";
import { NavLink, useNavigate } from "react-router-dom";
import { PATH } from "../../../constant";

const Cart = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const {
    data: carts,
    refetch,
    isFetching,
  } = useGetCartByUserId(userLogin?.id);
  const dispatch = useDispatch();
  const [lstPrd, setLstPrd] = useState([]);
  const mutationPutCart = usePutCarts();
  const navigate = useNavigate();

  console.log(carts);
  const onChange = (value, productId) => {
    if (value && !isNaN(value)) {
      // Cập nhật số lượng trong lstPrd
      setLstPrd((prevLstPrd) =>
        prevLstPrd.map((prd) =>
          prd.id === productId ? { ...prd, quantity: value } : prd
        )
      );

      // Tìm sản phẩm với productId từ lstPrd để tạo payload
      const product = lstPrd.find((prd) => prd.id === productId);

      if (product) {
        const payload = {
          productId: productId,
          quantity: value,
        };

        mutationPutCart.mutate(
          {
            id: userLogin?.id, // Truyền userId thay vì productId
            payload, // Payload với productId và quantity
          },
          {
            onSuccess: () => {
              toast.success("Updated product quantity successfully!");
              refetch(); // Gọi refetch để cập nhật lại giỏ hàng
            },
            onError: (error) => {
              console.error("API Error:", error);
              toast.error("Failed to update product quantity.");
            },
          }
        );
      } else {
        console.error("Product not found for ID:", productId);
        toast.error("Product not found.");
      }
    } else {
      console.error("Invalid quantity value:", value);
      toast.error("Quantity must be a valid number.");
    }
  };

  const mutate = useDeleteProductsInCarts();

  const handleDeleteCart = (productId, quantity) => {
    console.log("productId", productId);
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?")) {
      mutate.mutate(
        { productId, userId: userLogin?.id, quantity },
        {
          onSuccess: (response) => {
            toast.success("Delete product in cart successfully!");
            refetch();
          },
          onError: (error) => {
            console.error("API delete Error:", error);
            toast.error("Failed to delete product from cart.");
          },
        }
      );
    }
  };

  let totalItems = 0;
  let totalPrice = 0;

  lstPrd?.map((prd) => {
    totalItems += prd?.quantity;
    totalPrice += prd?.quantity * prd?.price;
  });

  useEffect(() => {
    if (carts) {
      const productIdList = carts.map((prd) => prd?.productId);
      Promise.all(
        productIdList.map((id) =>
          dispatch(manageProductThunks.getProductThunk(id)).unwrap()
        )
      )
        .then((results) => {
          const updatedProducts = results.map((product, index) => ({
            ...product,
            quantity: carts[index]?.quantity, // Add quantity from carts
          }));
          setLstPrd(updatedProducts);
        })
        .catch((err) => {
          // Handle error
        });
    }
  }, [carts]);

  console.log(lstPrd);

  // if (lstPrd.length === 0) {
  //   return (
  //     <div>
  //       <div className="flex justify-center my-[60px]">
  //         <img
  //           src="../../../../images/cart-empty.png"
  //           className="w-[40%]"
  //           alt="empty"
  //         />
  //       </div>
  //       <div className="mb-[60px]">
  //         <h2 className="text-orange-500 text-center mb-[8px] text-[32px]">
  //           There are no products in the cart, please back to the store to
  //           select anything .
  //         </h2>
  //         <div className="flex justify-center">
  //           <NavLink
  //             className="underline hover:!text-orange-500 transition-all duration-300"
  //             to={PATH.STORE}
  //           >
  //             Go To Store
  //           </NavLink>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="w-[80%] my-[40px] mx-auto rounded-lg p-5">
      <h1 className="text-2xl font-bold text-center mb-5">Shopping Cart</h1>
      <div className="w-full justify-between items-center px-[20px] flex p-[15px] bg-white mb-[20px] rounded-lg shadow-sm">
        <h2 className="text-center w-[10%]">Image</h2>
        <h2 className="text-center w-[35%]">Name</h2>
        <h2 className="text-center w-[15%]">Price</h2>
        <h2 className="text-center w-[15%]">Quantity</h2>
        <h2 className="text-center w-[10%]">Action</h2>
      </div>
      {lstPrd?.map((product, index) => (
        <div
          key={index}
          className="w-full items-center justify-between px-[20px] flex p-[15px] bg-white mb-[20px] rounded-lg shadow-sm"
        >
          <img src={product?.imageUrl} className="w-20 h-20 rounded" alt="" />
          <h2 className="w-[40%] text-center font-semibold">{product?.name}</h2>
          <p className="w-[15%] text-center text-lg font-medium">${product?.price}</p>
          <InputNumber
            min={1}
            max={10}
            value={product?.quantity}
            disabled={mutate.isPending}
            onChange={(value) => onChange(value, product?.id)}
            style={{ width: "15%", textAlign: "center" }}
            className="border border-gray-300 rounded"
          />
          <DeleteOutlined
            style={{
              color: "red",
              cursor: "pointer",
              width: "10%",
              display: "inline-block",
            }}
            onClick={() => {
              handleDeleteCart(product?.id);
            }}
          />
        </div>
      ))}
      <div className="w-full justify-between items-center px-[20px] flex p-[15px] bg-white mb-[20px] rounded-lg shadow-sm">
        <p className="font-bold">Total: {totalItems} items</p>
        <div className="flex items-center">
          <p className="font-bold">
            Total Price:{" "}
            <span className="text-orange-600">
              $
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
              }).format(totalPrice)}
            </span>
          </p>
          <button
            className="rounded-lg ml-[30px] px-[30px] py-[10px] bg-black text-white hover:bg-gray-800 transition duration-300"
            onClick={() => {
              navigate(PATH.CHECKOUT);
            }}
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
