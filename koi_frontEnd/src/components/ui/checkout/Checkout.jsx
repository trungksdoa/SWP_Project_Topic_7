import React, { useEffect, useState } from "react";
import { Form, Input, Button, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useGetCartByUserId } from "../../../hooks/manageCart/useGetCartByUserId";
import { manageProductThunks } from "../../../store/manageProduct";
import FormCheckout from "./FormCheckout";

const Checkout = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const { data: carts, refetch } = useGetCartByUserId(userLogin?.id);
  const dispatch = useDispatch();
  const [lstPrd, setLstPrd] = useState([]);
  let totalItems = 0;
  lstPrd?.map((prd) => {
    totalItems += prd?.quantity;
  });

  console.log(lstPrd);
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

  const columns = [
    {
      title: "Ordered Products",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  // Update data to use lstPrd
  const data = lstPrd.map((product, index) => ({
    key: index + 1, // Unique key for each product
    product: (
      <div className="flex items-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-[100px]  mr-2"
        />{" "}
        {/* Added image */}
        {product.name}
      </div>
    ),
    price: `${product.price}$`, // Format price
    amount: product.quantity,
  }));

  return (
    <div className="w-[60%] my-[40px] mx-auto">
      <h2 className="text-lg font-bold">Ordered Products</h2>
      <Table columns={columns} dataSource={data} pagination={false} />
      <FormCheckout totalItems={totalItems} />
    </div>
  );
};

export default Checkout;
