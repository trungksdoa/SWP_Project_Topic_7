import React, { useEffect, useState } from "react";
import { Table, Input, Button, Spin, message } from "antd";
import { useGetAllProducts } from "../../../../hooks/admin/manageProducts/UseGetAllProducts";
import { useRecoverProduct } from "../../../../hooks/admin/manageProducts/UseDeleteProduct";
import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const ManageProductRecovery  = () => {
  const { data: lstProducts, refetch, isFetching } = useGetAllProducts();
  const recoverMutate = useRecoverProduct();
  const [filteredName, setFilteredName] = useState([]);


  const handleRecover = (id) => {
    Modal.confirm({
      title: 'Recover Product',
      icon: <ExclamationCircleFilled className="text-green-500" />,
      content: 'This will recover the disabled product. Do you want to continue?',
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk() {
        recoverMutate.mutate({id: id}, {
          onSuccess: () => {
            message.success("Product recovered successfully!");
            refetch();
          },
          onError: () => {
            message.error("Failed to recover product!");
          }
        });
      },
      cancelButtonProps: {
        style: { float: 'left' }
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
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      width: "30%",
    },
    {
      title: "Action",
      render: (_, prd) => (
        <div key={prd.id}>
          <Button
            className="w-[90px] bg-green-600 text-white hover:!bg-green-500 hover:!text-white transition-all duration-300 ease-in-out"
            onClick={() => {
              handleRecover(prd?.id);
            }}
          >
            Recovery
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

  const data = (filteredName.length > 0 ? filteredName : lstProducts)?.filter(product => product.disabled);

  if (isFetching) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Search
        style={{ marginBottom: "20px" }}
        placeholder="input search text"
        allowClear
        size="large"
        onKeyUp={onKeyUp}
      />
      <Table
        columns={columns}
        dataSource={data}
        showSorterTooltip={{ target: "sorter-icon" }}
        className="shadow-lg rounded-lg overflow-hidden"
        bordered={false}
      />
    </div>
  );
};

export default ManageProductRecovery;
