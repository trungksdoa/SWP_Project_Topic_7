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
import { useGetCategory } from "../../hooks/admin/manageCategory/useGetCategory";
import BreadcrumbComponent from "../ui/BreadcrumbCoponent";

const StoreTemplate = () => {
  // State và hook dùng chung
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const { data: lstCategory } = useGetCategory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(lstCategory);

  const { data: lstProducts, isFetching } = useGetAllProducts();

  console.log(lstProducts);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (lstProducts) {
      console.log("Product list updated:", lstProducts);
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
  };

  // Function lọc sản phẩm dựa trên categoryId
  const filterProducts = (
    products,
    isWaterTreatmentChecked,
    isKoiTreatmentChecked
  ) => {
    let filteredProducts = products;

    if (isWaterTreatmentChecked && !isKoiTreatmentChecked) {
      filteredProducts = products.filter((product) => product.categoryId === 1);
    } else if (!isWaterTreatmentChecked && isKoiTreatmentChecked) {
      filteredProducts = products.filter((product) => product.categoryId === 2);
    }

    return filteredProducts;
  };

  const onChange = (checkedValues) => {
    const filteredProducts = filterProducts(
      lstProducts,
      checkedValues.includes(1),
      checkedValues.includes(2)
    );
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
    <div>
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, { name: "Store" }]}
      />
      <div className="grid grid-cols-4 my-[40px] gap-[30px]">
        <div>
          <div className="flex justify-between items-center rounded-[6px] mb-[30px] bg-gray-100 px-[15px] py-[10px]">
            <p className="text-2xl">Filter</p>
          </div>
          <div className="border-[1px] border-gray-300 rounded-[6px] px-[15px] py-[10px]">
            <Checkbox.Group style={{ width: "100%" }} onChange={onChange}>
              <Row className="flex flex-col">
                {lstCategory?.map((category) => (
                  <Row key={category.id} className="mb-[15px] !w-full" span={8}>
                    <Checkbox value={category.id}>{category.name}</Checkbox>
                  </Row>
                ))}
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
          <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-[30px] grid-cols-2">
            {filteredProducts?.map((prd, index) => {
              console.log(
                `Rendering product: ${prd?.id}, image: ${prd?.imageUrl}`
              );
              return (
                <Card
                  key={prd?.id}
                  hoverable
                  style={{
                    width: 240,
                    border: "1px solid #ccc",
                    overflow: "hidden",
                  }}
                  onClick={() => {
                    navigate(`${PATH.DETAIL_PRODUCT}/${prd?.slug}`);
                  }}
                  cover={
                    <img
                      alt={prd?.name}
                      className="relative z-0 max-h-[250px] object-contain cursor-pointer"
                      src={`${prd?.imageUrl}?t=${new Date().getTime()}`}
                    />
                  }
                >
                  <div className="p-[2px]">
                    <h2 className="font-bold min-h-[44px] mb-[5px]">
                      {prd?.name}
                    </h2>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">
                        Price:{" "}
                        <span className="!font-normal text-[16px]">
                          ${prd?.price}
                        </span>
                      </p>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }, (_, index) => {
                          const ratingValue = index + 1; // Tạo giá trị rating từ 1 đến 5
                          return (
                            <span key={index} className="star-container">
                              {prd?.averageRating >= ratingValue ? (
                                <span className="full-star">★</span>
                              ) : prd?.averageRating >= ratingValue - 0.5 ? (
                                <span className="half-star">★</span>
                              ) : (
                                <span className="empty-star">☆</span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
                // <Card
                //   className="flex flex-col justify-around col-span-1"
                //   key={index}
                //   onClick={() => {
                //     navigate(`${PATH.DETAIL_PRODUCT}/${prd?.id}`)
                //   }}
                //   cover={<img alt="example" className="max-h-[250px] object-contain mt-[10px] cursor-pointer" src={prd?.imageUrl} />}
                // >
                //   <div className="flex justify-center items-center">
                //     <h1 className="text-[16px]">{prd?.name}</h1>
                //   </div>
                //   <div>
                //     <p>Price: ${prd?.price}</p>
                //   </div>
                //   {/* <div className="flex justify-between items-center mt-[20px]">
                //     <button
                //       className="border-[1px] hover:bg-black hover:text-white transition-all duration-300 border-gray-300 rounded-[6px] px-[20px] py-[10px]"
                //       onClick={() => navigate(`${PATH.DETAIL_PRODUCT}/${prd?.id}`)}
                //     >
                //       View Detail
                //     </button>
                //     <button
                //       className="bg-black text-white rounded-[6px] px-[20px] py-[10px]"
                //       onClick={_}
                //     >
                //       Buy Now
                //     </button>
                //   </div> */}
                // </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreTemplate;
