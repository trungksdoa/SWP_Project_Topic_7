import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { useGetUserAll } from "../../../hooks/admin/UseGetUserAll";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDeleteUser } from "../../../hooks/admin/UseDeleteUser";
import { LOCAL_STORAGE_LOGIN_KEY } from "../../../constant/localStorage";
import { PATH } from "../../../constant";
import { toast } from "react-toastify";
import { Input, Space } from "antd";

const ManageUser = () => {
  const { data: lstUser, refetch } = useGetUserAll();
  const mutate = useDeleteUser();
  console.log(lstUser);

  useEffect(() => {
    refetch();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá người dùng này không?")) {
      mutate.mutate(id, {
        onSuccess: () => {
          toast.success("Delete User Successfully!");
          refetch();
        },
        onError: (error) => {
          toast.error("Delete User Failed!");
        },
      });
    }
  };
  const { Search } = Input;
  const [filteredName, setFilterdName] = useState([]);

  const onKeyUp = (e) => {
    const input = e?.target.value.toLowerCase();
    const filtered = lstUser?.filter((user) =>
      user.username.toLowerCase().includes(input)
    );
    setFilterdName(filtered || []);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      showSorterTooltip: {
        target: "full-header",
      },
      sorter: (a, b) => a.id - b.id,
      width: "10%"
    },
    {
      title: "User Name",
      dataIndex: "username",
      width: "10%"

    },
    {
      title: "Image",
      dataIndex: "avatarUrl",
      render: (avatarUrl) => (
        <img className="w-[100px]" src={avatarUrl} alt="user" />
      ),
      width: "10%"

    },
    {
      title: "Email",
      dataIndex: "email",
      width: "10%"

    },

    // {
    //   title: "Role",
    //   dataIndex: "roles",
    //   render: (roles) => Array.isArray(roles) ? roles.join(', ') : roles,
    // },
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
                <Button
                  onClick={() => handleDelete(user.id)}
                  loading={mutate.isPending}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        );
      },
      width: "10%"

    },
  ];

  const data = filteredName.length > 0 ? filteredName : lstUser;

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log("params", pagination, filters, sorter, extra);
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

export default ManageUser;
