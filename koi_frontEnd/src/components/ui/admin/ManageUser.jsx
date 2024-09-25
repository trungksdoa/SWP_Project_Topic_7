import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { useGetUserAll } from "../../../hooks/admin/UseGetUserAll";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDeleteUser } from "../../../hooks/admin/UseDeleteUser";
import { toast } from "react-toastify";
import { Input, Spin } from "antd";

const ManageUser = () => {
  const { data: lstUser, refetch, isFetching } = useGetUserAll();
  const mutate = useDeleteUser();
  const [filteredName, setFilteredName] = useState([]);
  const [loadingId, setLoadingId] = useState(null); // Thêm state để theo dõi ID đang loading

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá người dùng này không?")) {
      setLoadingId(id); // Đặt ID đang loading
      mutate.mutate(id, {
        onSuccess: () => {
          toast.success("Delete User Successfully!");
          refetch();
          setLoadingId(null); // Reset ID khi xóa thành công
        },
        onError: (error) => {
          toast.error("Delete User Failed!");
          setLoadingId(null); // Reset ID khi xóa thất bại
        },
      });
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  const { Search } = Input;

  // Lọc danh sách người dùng có role là "ROLE_MEMBER"
  const filteredUsers = lstUser?.filter((user) =>
    user.roles.some((role) => role.name === "ROLE_MEMBER")
  );

  const onKeyUp = (e) => {
    const input = e?.target.value.toLowerCase();
    const filtered = filteredUsers?.filter((user) =>
      user.username.toLowerCase().includes(input)
    );
    setFilteredName(filtered || []);
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      showSorterTooltip: {
        target: "full-header",
      },
      sorter: (a, b) => a.id - b.id,
      width: "10%",
    },
    {
      title: "User Name",
      dataIndex: "username",
      width: "10%",
    },
    {
      title: "Image",
      dataIndex: "avatarUrl",
      render: (avatarUrl) => (
        <img className="w-[100px]" src={avatarUrl} alt="user" />
      ),
      width: "10%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "10%",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, user) => {
        return (
          <div key={user.id}>
            {user.roles.some((role) => role.name === "ADMIN") ? (
              <EditOutlined className="mr-[15px]" style={{ color: "blue" }} />
            ) : (
              <Button
                className="bg-red-600 text-white hover:!bg-red-500 hover:!text-white transition-all duration-300 ease-in-out"
                onClick={() => handleDelete(user.id)}
                loading={loadingId === user.id} // Chỉ hiển thị loading cho ID đang xóa
              >
                Delete
              </Button>
            )}
          </div>
        );
      },
      width: "10%",
    },
  ];

  // Nếu có dữ liệu từ ô tìm kiếm, dùng filteredName, nếu không thì dùng filteredUsers
  const data = filteredName.length > 0 ? filteredName : filteredUsers;
  const onChange = (pagination, filters, sorter, extra) => {
    // Xử lý các thay đổi trong bảng
  };

  return (
    <div>
      <Search
        style={{ marginBottom: "20px" }}
        placeholder="Tìm kiếm người dùng"
        allowClear
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
