import React, { useEffect } from "react";
import { Table } from "antd";
import { useGetUserAll } from "../../../hooks/admin/UseGetUserAll";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDeleteUser } from "../../../hooks/admin/UseDeleteUser";
import { LOCAL_STORAGE_LOGIN_KEY } from "../../../constant/localStorage";
import { PATH } from "../../../constant";

const ManageUser = () => {
  const { data: lstUser, refetch } = useGetUserAll();
  const mutate = useDeleteUser()

  useEffect(() => {
    refetch()
  }, [])


  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá người dùng này không?")) {
        mutate.mutate(id, {
          onSuccess: () => {
            toast.success("Xoá Thành Công!");
            refetch();
          },
          onError: (error) => {
            console.log(error);
            toast.error("Xoá Thất Bại!");
          },
        });
      }

  };

  console.log(lstUser);
  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      showSorterTooltip: {
        target: "full-header",
      },
    },
    {
      title: "User Name",
      dataIndex: "username",
      showSorterTooltip: {
        target: "full-header",
      },
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Role",
      dataIndex: "roles",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, user) => {
        return (
          <div key={user.id}>
            {user.roles === "ADMIN" ? (
              <EditOutlined
                className="mr-[15px]"
                // onClick={() => {
                //   navigate(`${PATH.editNguoiDung}/${nguoiDung.id}`);
                // }}
                style={{ color: "blue" }}
              />
            ) : (
              <>
                <EditOutlined
                  className="mr-[15px]"
                //   onClick={() => {
                //     navigate(`${PATH.editNguoiDung}/${nguoiDung.id}`);
                //   }}
                  style={{ color: "blue" }}
                />
                <DeleteOutlined
                  onClick={() => handleDelete(user.id)}
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

  const data = lstUser;
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return (
    <div>
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

export default ManageUser;
