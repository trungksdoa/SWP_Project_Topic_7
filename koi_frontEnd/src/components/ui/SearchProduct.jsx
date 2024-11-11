import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { manageProductsServices } from "../../services/manageProducrsServices";
import { AutoComplete, Button } from "antd";
import { PATH } from "../../constant";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { manageProductAction } from "../../store/manageProduct/slice";

const SearchProduct = () => {
  const { t } = useTranslation();
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const navigate = useNavigate()
  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const dispatch = useDispatch()

  const onChange = (data) => {
    setValue(data);
    const filteredOptions = dataSearch.filter(item => 
      item.name.toLowerCase().includes(data.toLowerCase())
    );
    setOptions(filteredOptions.map(item => ({ value: item.name, slug: item.slug })));
  };

  const toggleSearchPopup = () => {
    setIsSearchPopupOpen(!isSearchPopupOpen);
    if (!isSearchPopupOpen) {
      manageProductsServices.getAllProducts().then((res) => {
        setDataSearch(res?.data?.data)
      });
    }
  };

  const onSelect = (_, data) => {
    navigate(`${PATH.DETAIL_PRODUCT}/${data.slug}`);
    toggleSearchPopup();
  };

  const handleSearch = (value) => {
    setIsSearchPopupOpen(!isSearchPopupOpen);
    manageProductsServices.searchProduct(value).then((res) => {
      console.log(res.data?.data)
      dispatch(manageProductAction.setSearchName(value))
      dispatch(manageProductAction.setSearchResult(res.data?.data))
    })
    navigate(PATH.STORE_SEARCH)
  }


  return (
    <>
      {isSearchPopupOpen && (
        <>
          <div
            className={`fixed z-10 top-0 left-0 w-full h-full bg-black opacity-50`}
            onClick={toggleSearchPopup}
          ></div>
          <div className="fixed inset-0 flex justify-center items-center z-20">
            <div className="w-[60%] max-w-[500px]">
              <div className="bg-white p-8 rounded-lg shadow-lg relative">
                <button
                  onClick={toggleSearchPopup}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition duration-200"
                >
                  &times;
                </button>
                <h2 className="font-semibold mb-4 text-lg text-center">
                  Search Product
                </h2>
                <AutoComplete
                  options={options}
                  style={{
                    width: "100%",
                  }}
                  allowClear
                  onSelect={onSelect}
                  onSearch={onChange}
                  placeholder="Input product name"
                  className="mb-4"
                />
                <Button 
                  style={{ backgroundColor: "rgb(249 115 22)", color: "white" }} 
                  onClick={() => handleSearch(value)} 
                  className="w-full"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      <SearchOutlined
        style={{
          color: "white",
          marginRight: "15px",
          fontSize: "24px",
          cursor: "pointer",
        }}
        onClick={toggleSearchPopup}
      />
    </>
  );
};

export default SearchProduct;
