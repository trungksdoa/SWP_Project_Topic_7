import React, { useEffect, useState } from "react";
import { Table, Input, Button, Spin, message, Tag, Tabs } from "antd";
import { useGetAllProducts } from "../../../../hooks/admin/manageProducts/UseGetAllProducts";
import { useDeleteProduct, useSoftDeleteProduct } from "../../../../hooks/admin/manageProducts/UseDeleteProduct";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../../constant";
import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import ManageProductRecovery from "./ManageProductRecovery";

const ManageProducts = () => {
  const { data: lstProducts, refetch, isFetching } = useGetAllProducts();
  const mutate = useDeleteProduct();
  const softMutate = useSoftDeleteProduct();
  const navigate = useNavigate();
  const [filteredName, setFilteredName] = useState([]);
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    refetch();
  }, []);

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Product',
      icon: <ExclamationCircleFilled className="text-red-500" />,
      content: '(DANGEROUS WARNING) This will delete all information related to this product. Do you want to continue?',
      okText: 'Yes',
      okType: 'danger', 
      cancelText: 'No',
      onOk() {
        mutate.mutate(id, {
          onSuccess: () => {
            message.success("Delete Product Successfully!");
            refetch();
          },
          onError: () => {
            message.error("Delete Product Failed!");
          }
        });
      },
      cancelButtonProps: {
        style: { float: 'left' }
      }
    });     
  };

  const handleSoftDelete = (id) => {
    softMutate.mutate(id, {
      onSuccess: () => {
        message.success("Product soft deleted successfully!");
        refetch();
        setActiveTab('2'); // Switch to disabled products tab after soft delete
      },
      onError: () => {
        message.error("Failed to soft delete product!");
      }
    });
  }

  const columns = [
    {
      title: "Id",
      dataIndex: "id", 
      defaultSortOrder: "ascend",
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["ascend", "descend"],
      width: "5%",
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "15%",
    },
    {
      title: "Price", 
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      width: "5%",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (imageUrl) => (
        <img className="w-[100px]" src={imageUrl} alt="product" />
      ),
      width: "10%",
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a, b) => a.stock - b.stock,
      width: "30%",
    },
    {
      title: "Stock",
      dataIndex: "stock", 
      sorter: (a, b) => a.stock - b.stock,
      width: "5%",
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      render: (categoryId) => {
        if (categoryId === 1) return "Water management";
        if (categoryId === 2) return "Koi management";
        return "Unknown";
      },
      sorter: (a, b) => a.categoryId - b.categoryId,
      width: "10%",
    },
    {
      title: "Action",
      render: (_, prd) => (
        <div key={prd.id}>
          <Button
            onClick={() => {
              navigate(`${PATH.EDIT_PRODUCT}/${prd?.id}`);
            }}
            className="w-[70px] mr-[30px] bg-green-400 text-white hover:!bg-green-500 hover:!text-white mb-2"
          >
            Edit
          </Button>
          <Button
            className="w-[90px] bg-yellow-600 text-white hover:!bg-yellow-500 hover:!text-white mb-2 transition-all duration-300 ease-in-out"
            onClick={() => {
              Modal.confirm({
                title: 'Soft Delete Product',
                icon: <ExclamationCircleFilled className="text-yellow-500" />,
                content: 'This will disable the product. Do you want to continue?',
                okText: 'Yes',
                okType: 'warning',
                cancelText: 'No',
                onOk() {
                  console.log(prd?.id);
                  handleSoftDelete(prd?.id);
                },
                cancelButtonProps: {
                  style: { float: 'left' }
                }
              });
            }}
          >
            Soft Delete
          </Button>
          <Button
            className="w-[90px] bg-red-600 text-white hover:!bg-red-500 hover:!text-white transition-all duration-300 ease-in-out"
            onClick={() => {
              handleDelete(prd?.id);
            }}
          >
            Force Delete
          </Button>
        </div>
      ),
      width: "20%",
    },
  ];

  const { Search } = Input;
  const onKeyUp = (e) => {
    const input = e?.target.value.toLowerCase();
    const filtered = lstProducts?.filter((product) =>
      product.name.toLowerCase().includes(input)
    );
    setFilteredName(filtered || []);
  };

  const data = (filteredName.length > 0 ? filteredName : lstProducts)?.filter(product => !product.disabled);

  if (isFetching) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  const items = [
    {
      key: '1',
      label: 'Active Products',
      children: (
        <>
          <Search
            style={{ marginBottom: "20px" }}
            placeholder="input search text"
            allowClear
            size="large"
            onKeyUp={onKeyUp}
          />
          <button
            className="bg-orange-500 mb-[20px] text-white px-4 py-2 rounded-md"
            onClick={() => navigate(PATH.ADD_PRODUCT)}
          >
            Add new product
          </button>
          <Table
            columns={columns}
            dataSource={data}
            showSorterTooltip={{ target: "sorter-icon" }}
            className="shadow-lg rounded-lg overflow-hidden"
            bordered={false}
          />
        </>
      ),
    },
    {
      key: '2',
      label: 'Recovery Products',
      children: <ManageProductRecovery />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  );
};

export default ManageProducts;
