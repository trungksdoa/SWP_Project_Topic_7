import React, { useEffect, useState } from "react";
import { Button, Table, Spin } from "antd";
import { useGetPackage } from "../../../../hooks/admin/managePackages/useGetPackage";
import { PATH } from "../../../../constant";
import { useNavigate } from "react-router-dom";
import { useDeletePackage } from "../../../../hooks/admin/managePackages/useDeletePackage";
const ManagePackage = () => {
  const { data: lstPackage, refetch, isFetching } = useGetPackage();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);
  const mutate = useDeletePackage();

  useEffect(() => {
    refetch();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
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
            onClick={() => {
              navigate(`${PATH.EDIT_PACKAGE}/${pkg?.id}`);
            }}
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
