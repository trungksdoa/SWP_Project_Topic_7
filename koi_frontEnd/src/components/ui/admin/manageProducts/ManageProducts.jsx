import React, { useState } from "react";
import { Table, Input } from "antd";
import { useGetAllProducts } from "../../../../hooks/admin/manageProducts/UseGetAllProducts";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useGetImagesProduct } from "../../../../hooks/admin/manageProducts/UseGetImagesProduct";
import { useDeleteProduct } from "../../../../hooks/admin/manageProducts/UseDeleteProduct";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../constant";

const ManageProducts = () => {
  const { data: lstProducts, refetch } = useGetAllProducts();
  const lstImg = [];
  const mutate = useDeleteProduct();
  const navigate = useNavigate();

  const handleDelete = (id) => {
   if(window.confirm("Are you sure you want to delete this product?")) {
    mutate.mutate(id, {
      onSuccess: () => {
        toast.success("Delete Product Successfully!");
        refetch();
      },
      onError: () => {
        toast.error("Delete Product Failed!");
      }
    })
   }  
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      showSorterTooltip: {
        target: "full-header",
      },
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Name",
      dataIndex: "name",
      showSorterTooltip: {
        target: "full-header",
      },
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Price",
      dataIndex: "price",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (imageUrl) => <img className="w-[100px]" src={imageUrl} alt="product" />,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "categoryId",
      dataIndex: "categoryId",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.categoryId - b.categoryId,
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, prd) => {
        return (
          <div key={prd.id}>
              <>
                <EditOutlined className="mr-[15px]" style={{ color: "blue" }} />
                <DeleteOutlined
                  onClick={() => handleDelete(prd.id)}
                  className="mr-[15px]"
                  style={{ color: "red" }}
                />
              </>
            
          </div>
        );
      },
    },
  ];

  //Search by name product
  const { Search } = Input;
  const [filteredName, setFilterdName] = useState([]);
  const onKeyUp = (e) => {
    const input = e?.target.value.toLowerCase();
    console.log(input);
    const filtered = lstProducts?.filter((product) =>
      product.name.toLowerCase().includes(input)
    );
    setFilterdName(filtered || []);
  };

  const data = filteredName.length > 0 ? filteredName : lstProducts;

  //Sort by name product
  const onChange = (pagination, filters, sorter, extra) => {
  };
  return (
    <div>
      <Search 
        style={{ marginBottom: "20px" }}
        placeholder="input search text"
        allowClear
        enterButton="Search"
        size="large"
        onKeyUp={onKeyUp}
      />
      <button className="bg-orange-500 mb-[20px] text-white px-4 py-2 rounded-md" 
        onClick={() => navigate(PATH.ADD_PRODUCT)}
      >Add new product</button>
      <Table
        columns={columns}
        dataSource={data}
        onChange={onChange}
        showSorterTooltip={{
          target: "sorter-icon",
        }}
      />
    </div>
  );
};

export default ManageProducts;
