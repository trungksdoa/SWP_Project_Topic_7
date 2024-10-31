import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spin, Checkbox, Row, Card, Select, Pagination, Input, Slider } from "antd";
import { useTranslation } from "react-i18next";
import { useGetAllProducts } from "../../hooks/admin/manageProducts/UseGetAllProducts";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constant";
import { toast } from "react-toastify";
import { useGetCategory } from "../../hooks/admin/manageCategory/useGetCategory";
import BreadcrumbComponent from "../ui/BreadcrumbCoponent";
import Title from "antd/es/skeleton/Title";

const StoreTemplate = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const { data: lstCategory } = useGetCategory();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: lstProducts, isFetching } = useGetAllProducts();

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFields, setSearchFields] = useState(['name']);
  const [priceRange, setPriceRange] = useState([0, 1000000]); // Default price range in VND
  const pageSize = 12;

  useEffect(() => {
    if (lstProducts) {
      let filtered = lstProducts;
      
      // If no search fields are selected, default to searching by name
      const effectiveSearchFields = searchFields.length === 0 ? ['name'] : searchFields;
      
      // Filter by search term for name and description
      if (effectiveSearchFields.includes('name') || effectiveSearchFields.includes('description')) {
        filtered = filtered.filter(product => 
          effectiveSearchFields.some(field => 
            field !== 'price' && product[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }

      // Filter by price range if price search is enabled
      if (effectiveSearchFields.includes('price')) {
        filtered = filtered.filter(product => 
          product.price >= priceRange[0] && product.price <= priceRange[1]
        );
      }

      setFilteredProducts(filtered);
    }
  }, [lstProducts, searchTerm, searchFields, priceRange]);

  const addToCart = (product) => {
    if (!userLogin) {
      toast.error("Please login to add to cart");
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
    // If no search fields are selected, default to searching by name
    const effectiveSearchFields = searchFields.length === 0 ? ['name'] : searchFields;
    
    const filtered = filterProducts(
      lstProducts.filter(product => 
        effectiveSearchFields.some(field => 
          field !== 'price' && product[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchFieldsChange = (checkedValues) => {
    setSearchFields(checkedValues);
  };

  const handlePriceRangeChange = (value) => {
    setPriceRange(value);
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
  const NoProductFound = () => {
    return (
      <div className="flex justify-center items-center min-h-[450px] flex-col gap-4">
        <img 
          src="https://cdn.dribbble.com/users/1449854/screenshots/4136663/no_data_found.png" 
          alt="No products found"
          className="w-[200px] opacity-50"
        />
        <p className="text-xl text-gray-500">No products found</p>
        <p className="text-gray-400">Try adjusting your search or filter criteria</p>
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
          <div className="border-[1px] border-gray-300 rounded-[6px] px-[15px] py-[10px] mb-[20px]">
            <Input 
              placeholder="Search products..." 
              onChange={handleSearch}
              value={searchTerm}
              className="mb-[15px]"
            />
            <Checkbox.Group 
              value={searchFields}
              onChange={handleSearchFieldsChange}
              className="flex flex-col gap-2"
            >
              <Checkbox value="name">Search by Name</Checkbox>
              <Checkbox value="description">Search by Description</Checkbox>
              <Checkbox value="price">Search by Price</Checkbox>
            </Checkbox.Group>
            {searchFields.includes('price') && (
              <div className="mt-4">
                <p className="mb-2">Price Range (VND):</p>
                <Slider
                  range
                  min={0}
                  max={1000000}
                  step={10000}
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  tooltip={{
                    formatter: value => `${value.toLocaleString()} VND`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{priceRange[0].toLocaleString()} VND</span>
                  <span>{priceRange[1].toLocaleString()} VND</span>
                </div>
              </div>
            )}
          </div>
          <Title>Sort</Title>
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
            {paginatedProducts.length === 0 && <NoProductFound />}
            {paginatedProducts.length > 0 && paginatedProducts?.map((prd) => (
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
