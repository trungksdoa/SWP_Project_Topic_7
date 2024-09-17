import React, { useState } from "react";
import { Table, Input } from "antd";
import { useGetAllProducts } from "../../../../hooks/admin/manageProducts/UseGetAllProducts";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useGetImagesProduct } from "../../../../hooks/admin/manageProducts/UseGetImagesProduct";

const ManageProducts = () => {
  const { data: lstProducts, refetch } = useGetAllProducts();
  const lstImg = [];
  const { data: lstImages } = useGetImagesProduct("1726246172190_Design1.png");

  lstImg.map((item) => {
  });

  const handleDelete = (id) => {
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
      render: (_, user) => {
        return (
          <div key={user.id}>
            {user.roles === "ADMIN" ? (
              <EditOutlined className="mr-[15px]" style={{ color: "blue" }} />
            ) : (
              <>
                <EditOutlined className="mr-[15px]" style={{ color: "blue" }} />
                <DeleteOutlined
                  // onClick={() => handleDelete(user.id)}
                  className="mr-[15px]"
                  style={{ color: "red" }}
                />
              </>
            )}
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
