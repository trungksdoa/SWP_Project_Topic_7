import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spin, Checkbox, Row, Card, Select, Pagination, message } from "antd";
import { useTranslation } from "react-i18next";
import { useGetAllProducts } from "../../hooks/admin/manageProducts/UseGetAllProducts";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constant";
import { useGetCategory } from "../../hooks/admin/manageCategory/useGetCategory";
import BreadcrumbComponent from "../ui/BreadcrumbCoponent";

const StoreTemplate = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const { data: lstCategory } = useGetCategory();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: lstProducts, isFetching } = useGetAllProducts();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    if (lstProducts) {
      setFilteredProducts(lstProducts);
    }
  }, [lstProducts]);

  const addToCart = (product) => {
    if (!userLogin) {
      message.error("Please login to add to cart");
      return;
    }
    // Implement add to cart functionality here
  };

  const filterProducts = (
    products,
    isWaterTreatmentChecked,
    isKoiTreatmentChecked
  ) => {
    let filtered = products;
    if (isWaterTreatmentChecked && !isKoiTreatmentChecked) {
      filtered = products.filter((product) => product.categoryId === 1);
    } else if (!isWaterTreatmentChecked && isKoiTreatmentChecked) {
      filtered = products.filter((product) => product.categoryId === 2);
    }
    return filtered;
  };

  const onChange = (checkedValues) => {
    const filtered = filterProducts(
      lstProducts,
      checkedValues.includes(1),
      checkedValues.includes(2)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleSort = (value) => {
    const sorted = [...filteredProducts].sort((a, b) => {
      return value === "asc" ? a.price - b.price : b.price - a.price;
    });
    setFilteredProducts(sorted);
    setSortOrder(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[450px]">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
          <div className="grid grid-cols-4 gap-6">
            {paginatedProducts?.map((prd) => (
              <Card
                key={prd?.id}
                hoverable
                className="w-full border-2 border-gray-200 shadow-lg"
                onClick={() => navigate(`${PATH.DETAIL_PRODUCT}/${prd?.slug}`)}
                cover={
                  <img
                    alt={prd?.name}
                    className="relative z-0 h-48 w-full object-cover cursor-pointer"
                    src={`${prd?.imageUrl}?t=${new Date().getTime()}`}
                    loading="lazy"
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
                        {prd?.price} VND
                      </span>
                    </p>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, index) => {
                        const ratingValue = index + 1;
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
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Pagination
              current={currentPage}
              total={filteredProducts.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreTemplate;
