import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCartByUserId } from "../../../hooks/manageCart/useGetCartByUserId";
import { manageProductThunks } from "../../../store/manageProduct";
import { InputNumber } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useDeleteProductsInCarts } from "../../../hooks/manageCart/useDeleteProductsInCarts";
import { toast } from "react-toastify";
import { usePutCarts } from "../../../hooks/manageCart/usePutCarts";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constant";

const Cart = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const { data: carts, refetch } = useGetCartByUserId(userLogin?.id);
  const dispatch = useDispatch();
  const [lstPrd, setLstPrd] = useState([]);
  const mutationPutCart = usePutCarts()
  const navigate = useNavigate()


  console.log(lstPrd)
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
            id: userLogin?.id,  // Truyền userId thay vì productId
            payload,  // Payload với productId và quantity
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
            console.log("API Response:", response);
            toast.success("Delete product in cart successfully!");
            refetch();
          },
          onError: (error) => {
            console.error("API Error:", error);
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

  return (
    <div className="w-[60%] my-[40px] mx-auto">
      <div className="w-full justify-between items-center px-[40px] flex p-[15px] bg-white mb-[30px] rounded-[12px]">
        <h2 className="text-center w-[20%]">Image</h2>
        <h2 className="text-center w-[40%]">Name</h2>
        <h2 className="text-center w-[15%]">Price</h2>
        <h2 className="text-center w-[15%]">Quantity</h2>
        <h2 className="text-center w-[10%]">Action</h2>
      </div>
      {lstPrd?.map((product, index) => (
        <div
          key={index}
          className="w-full items-center justify-between px-[40px] flex p-[15px] bg-white mb-[30px] rounded-[12px]"
        >
          <img src={product?.imageUrl} className="w-[20%]" alt="" />
          <h2 className="w-[40%] text-center">{product?.name}</h2>
          <p className="w-[15%] text-center">${product?.price}</p>
          <InputNumber
            min={1}
            max={10}
            value={product?.quantity}
            onChange={(value) => onChange(value, product?.id)}
            style={{ width: "15%", textAlign: "center" }}
          />
          <DeleteOutlined
            style={{ color: "red", cursor: "pointer",width: "10%", display: "inline-block" }}
            onClick={() => {
              handleDeleteCart(product?.id);
            }}
          />
        </div>
      ))}
      <div className="w-full justify-between items-center px-[40px] flex p-[15px] bg-white mb-[30px] rounded-[12px]">
        <p>Total: {totalItems} items</p>
        <div className="flex items-center">
          <p>
            Total Price:{" "}
            <span className="text-orange-600">
              $
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
              }).format(totalPrice)}
            </span>
          </p>
          <button className="rounded-[6px] ml-[30px] px-[30px] py-[10px] bg-black text-white" onClick={() => {
            navigate(PATH.CHECKOUT)
          }}>
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
