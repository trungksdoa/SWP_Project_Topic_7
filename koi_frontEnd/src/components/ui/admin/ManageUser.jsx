import React, { useEffect, useState } from "react";
import { Button, Table, Spin } from "antd";
import { useGetUserAll } from "../../../hooks/admin/UseGetUserAll";
import { EditOutlined } from "@ant-design/icons";
import { useDeleteUser } from "../../../hooks/admin/UseDeleteUser";
import { useGetAllUserByPage } from "../../../hooks/admin/UseGetAllUserByPage";
import { LOCAL_STORAGE_LOGIN_KEY } from "../../../constant/localStorage";
import { PATH } from "../../../constant";
import { toast } from "react-toastify";
import { Input, Space, Tag } from "antd";
import { filter } from "@chakra-ui/react";

const { Search } = Input;

const ManageUser = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const {
    data: lstUser,
    refetch,
    isFetching,
  } = useGetAllUserByPage(currentPage - 1, pageSize);

  const mutate = useDeleteUser();
  const [filteredName, setFilteredName] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    refetch();
  }, []);

  console.log(lstUser?.data?.content);

  // console.log(users)
  useEffect(() => {
    if (lstUser) {
      setTotalElements(lstUser?.data?.totalElements);
      setCurrentPage(lstUser?.data?.number + 1);
    }
  }, [lstUser]);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá người dùng này không?")) {
      setLoadingId(id);
      mutate.mutate(id, {
        onSuccess: () => {
          toast.success("Delete User Successfully!");
          refetch();
          setLoadingId(null);
        },
        onError: (error) => {
          toast.error("Delete User Failed!");
          setLoadingId(null);
        },
      });
    }
  };

  // const filteredUsers = lstUser?.filter((user) =>
  //   user.roles.some((role) => role.name === "ROLE_MEMBER")
  // );

  const onKeyUp = (e) => {
    const input = e?.target.value.toLowerCase();
    const filtered = lstUser?.data?.content?.filter((user) =>
      user.username.toLowerCase().includes(input)
    );
    setFilteredName(filtered || []);
    setCurrentPage(1); // Reset to first page when searching
  };

  const columns = [
    {
      title: "User Name",
      dataIndex: "username",
      width: "10%",
    },
    {
      title: "Address",
      dataIndex: "address",
      width: "10%",
      render: (address) => {
        if (address) {
          return <Tag color="blue">{address}</Tag>;
        }
        return <Tag color="red">Not Set</Tag>;
      },
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
      title: "ROLE",
      dataIndex: "id",
      showSorterTooltip: {
        target: "full-header",
      },
      render: (_, record) => {
        // const hasRoleMember = record?.roles.includes("ROLE_MEMBER"); // true
        const hasRoleAdmin = record?.roles.some(
          (role) => role.name === "ROLE_ADMIN"
        );
        const hasRoleMember = record?.roles.some(
          (role) => role.name === "ROLE_MEMBER"
        );
        if (hasRoleAdmin) {
          return <Tag color="red">ADMIN</Tag>;
        }
        if (hasRoleMember) {
          return <Tag color="green">MEMBER</Tag>;
        }
        return <Tag color="gray">SHOP</Tag>;
      },
      width: "10%",
    },
    {
      title: "Action",
      dataIndex: "",
      key: "x",
      render: (_, user) => {
        return (
          <div key={user.id}>
            {user.roles.some((role) => role.name === "ROLE_ADMIN") ? (
              <EditOutlined
                className="mr-[15px]"
                // onClick={() => {
                //   navigate(`${PATH.editNguoiDung}/${nguoiDung.id}`);
                // }}
                style={{ color: "blue" }}
              />
            ) : (
              <Button
                className="bg-red-600 text-white hover:!bg-red-500 hover:!text-white transition-all duration-300 ease-in-out"
                onClick={() => handleDelete(user.id)}
                loading={loadingId === user.id}
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

  const data = filteredName.length > 0 ? filteredName : lstUser?.data?.content;

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log("params", pagination, filters, sorter, extra);
  };

  // if (isFetching) {
  //   return (
  //     <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
  //       <Spin tip="Loading" size="large" />
  //     </div>
  //   );
  // }

  return (
    <div>
      <Button
        onClick={() => refetch()}
      >
        Refresh Data
      </Button>
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
        onChange={onChange}
        showSorterTooltip={{
          target: "sorter-icon",
        }}
        loading={isFetching}
        pagination={{
          current: currentPage,
          pageSize: 5,
          total: totalElements,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
      />
    </div>
  );
};

export default ManageUser;
