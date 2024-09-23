import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Checkbox, Col, Row, Card, Select } from "antd";
const { Meta } = Card;
import { useTranslation } from "react-i18next";
import { useGetAllProducts } from "../../hooks/admin/manageProducts/UseGetAllProducts";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constant";
import { manageCartActions } from "../../store/manageCart/slice";
import { toast } from "react-toastify";
import { usePostCarts } from "../../hooks/manageCart/usePostCarts";
import { useGetCartByUserId } from "../../hooks/manageCart/useGetCartByUserId";

const StoreTemplate = () => {
  // State và hook dùng chung
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const cart = useSelector((state) => state.manageCart.cart);
  const cartCount = useSelector((state) => state.manageCart.cartCount);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: lstProducts, isFetching } = useGetAllProducts();
  const { data: carts, refetch } = useGetCartByUserId(userId);
  const mutate = usePostCarts();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (lstProducts) {
      setFilteredProducts(lstProducts); 
    }
  }, [lstProducts]);

  const addToCart = (product) => {
    if (!userLogin) {
      toast.error("Please login to add to cart");
      return;
    }

    const payload = {
      userId: userLogin?.id,
      productId: product?.id,
      quantity: 1,
    };

    const isProductInCart = cart.find((item) => item.id === product.id);

    if (isProductInCart) {
      const updatedQuantity = isProductInCart.quantity + 1;
      dispatch(manageCartActions.updateCartQuantity({ productId: product.id, quantity: updatedQuantity }));
      mutate.mutate({ ...payload, quantity: updatedQuantity }, {
        onSuccess: () => {
          refetch();
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
          refetch(); 
          toast.success("Product added to cart");
        },
        onError: () => {
          toast.error("Failed to add product to cart");
        },
      });
    }
  };

  // Function lọc sản phẩm dựa trên categoryId
  const filterProducts = (products, isWaterTreatmentChecked, isKoiTreatmentChecked) => {
    let filteredProducts = products;

    if (isWaterTreatmentChecked && !isKoiTreatmentChecked) {
      filteredProducts = products.filter(product => product.categoryId === 1);
    } else if (!isWaterTreatmentChecked && isKoiTreatmentChecked) {
      filteredProducts = products.filter(product => product.categoryId === 2);
    }

    return filteredProducts;
  };

  const onChange = (checkedValues) => {
    const isWaterTreatmentChecked = checkedValues.includes("A");
    const isKoiTreatmentChecked = checkedValues.includes("B");
    const filteredProducts = filterProducts(lstProducts, isWaterTreatmentChecked, isKoiTreatmentChecked);
    setFilteredProducts(filteredProducts);
  };

  const handleSort = (value) => {
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      return value === "asc" ? a.price - b.price : b.price - a.price;
    });
    setFilteredProducts(sortedProducts);
    setSortOrder(value);
  };

  if (isFetching) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 my-[40px] gap-[30px]">
      <div>
        <div className="flex justify-between items-center rounded-[6px] mb-[30px] bg-gray-100 px-[15px] py-[10px]">
          <p className="text-2xl">Filter</p>
        </div>
        <div className="border-[1px] border-gray-300 rounded-[6px] px-[15px] py-[10px]">
          <Checkbox.Group
            style={{ width: "100%" }}
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
          <div>
            <span className="mr-[8px]">Sort by Price: </span>
            <Select
              defaultValue="asc"
              style={{ width: 120 }}
              onChange={handleSort}
            >
              <Select.Option value="asc">Low To High</Select.Option>
              <Select.Option value="desc">High To Low</Select.Option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-[30px]">
          {filteredProducts?.map((prd, index) => (
            <Card
              className="col-span-1 p-[20px]"
              key={index}
              cover={<img alt="example" className="min-h-[340px] object-contain mt-[10px]" src={prd?.imageUrl} />}
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
                  onClick={() => navigate(`${PATH.DETAIL_PRODUCT}/${prd?.id}`)}
                >
                  View Detail
                </button>
                <button
                  className="bg-black text-white rounded-[6px] px-[20px] py-[10px]"
                  onClick={() => addToCart(prd)}
                >
                  Add to Cart
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreTemplate;
