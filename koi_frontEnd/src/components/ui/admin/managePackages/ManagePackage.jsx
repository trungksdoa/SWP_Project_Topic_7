import React, { useEffect, useState } from "react";
import { Button, Table, Spin, Modal } from "antd";
import { useGetPackage } from "../../../../hooks/admin/managePackages/useGetPackage";
import { useDeletePackage } from "../../../../hooks/admin/managePackages/useDeletePackage";
import EditPackages from "./EditPackages";
import AddPackage from "../managePackages/AddPackage";

const ManagePackage = () => {
  const { data: lstPackage, refetch, isFetching } = useGetPackage();
  const [deletingId, setDeletingId] = useState(null);
  const mutate = useDeletePackage();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (lstPackage && lstPackage.length > 0) {
      const maxId = Math.max(...lstPackage.map((pkg) => pkg.id));
      setNextId(maxId + 1);
    }
  }, [lstPackage]);

  // const handleDelete = (id) => {
  //   Modal.confirm({
  //       title: 'Delete Package',
  //       content: 'Are you sure you want to delete this package?',
  //       okText: 'Yes',
  //       okType: 'danger',
  //       cancelText: 'No',
  //       onOk() {
  //           setDeletingId(id);
  //           mutate.mutate(id, {
  //               onSuccess: () => {
  //                   toast.success("Delete package successfully!");
  //                   refetch();
  //                   setDeletingId(null);
  //               },
  //               onError: () => {
  //                   toast.error("Delete package failed!");
  //                   setDeletingId(null);
  //               },
  //           });
  //       },
  //   });
  // }

  const handleEdit = (packageId) => {
    setEditingPackageId(packageId);
    setEditModalVisible(true);
  };

  const handleEditSuccess = () => {
    refetch();
  };

  const handleAddSuccess = () => {
    refetch();
    setAddModalVisible(false);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
      width: "10%",
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => {
        let bgColor = "";
        switch (record.name.toLowerCase()) {
          case "advanced":
            bgColor = "#FAF3E1";
            break;
          case "professional":
            bgColor = "#F5E7C6";
            break;
          case "vip":
            bgColor = "#FF6D1F";
            break;
          case "svip":
            bgColor = "#222222";
            break;
          default:
            bgColor = "transparent";
        }

        return (
          <div
            style={{
              border: "1px solid #d9d9d9",
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor: bgColor,
              color: record.name.toLowerCase() === "svip" ? "white" : "inherit",
              display: "inline-block",
              width: "110px",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: "bold",
            }}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: "Fish Slots",
      dataIndex: "fishSlots",
    },
    {
      title: "Pond Slots",
      dataIndex: "pondSlots",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Action",
      render: (_, pkg) => (
        <div key={pkg.id}>
          <Button
            onClick={() => handleEdit(pkg?.id)}
            className="w-[70px] mr-[30px] bg-green-400 text-white hover:!bg-green-500 hover:!text-white mb-2"
          >
            Edit
          </Button>
        </div>
      ),
      width: "15%",
    },
  ];
  const data = lstPackage;
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
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
      {/* <Button
        className="bg-orange-500 mb-4 text-white px-4 py-2 rounded-md"
        onClick={() => setAddModalVisible(true)}
      >
        Add new package
      </Button> */}
      <Table
        columns={columns}
        dataSource={data}
        onChange={onChange}
        showSorterTooltip={{
          target: "sorter-icon",
        }}
        size="small"
        className="compact-table"
      />
      <EditPackages
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        packageId={editingPackageId}
        onSuccess={handleEditSuccess}
      />
      <AddPackage
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onSuccess={handleAddSuccess}
        nextId={nextId}
      />
    </div>
  );
};

export default ManagePackage;

// Add this at the end of the file or in a separate CSS file
const styles = `
  .compact-table .ant-table-tbody > tr > td {
    padding: 8px 16px;
  }
`;

if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}
