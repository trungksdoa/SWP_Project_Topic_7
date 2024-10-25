import React, { useEffect, useState } from "react";
import { Button, Table, Spin, Modal } from "antd";
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
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    refetch();
  }, []);


  useEffect(() => {
    if (lstUser) {
      setTotalElements(lstUser?.data?.totalElements);
      setCurrentPage(lstUser?.data?.number + 1);
    }
  }, [lstUser]);

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete User',
      content: 'Are you sure you want to delete this user?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteUser(id);
      },
    });
  };

  const deleteUser = async (id) => {
    setIsDeleting(true);
    setLoadingId(id);
    try {
      await mutate.mutateAsync(id);
      toast.success("User deleted successfully!");
      refetch();
    } catch (error) {
      toast.error(`Error deleting user: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setLoadingId(null);
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
      title: <div style={{ textAlign: 'center' }}>User Name</div>,
      dataIndex: "username",
      width: "10%",
    },
    {
      title: <div style={{ textAlign: 'center' }}>Address</div>,
      dataIndex: "address",
      width: "10%",
      render: (address) => (
        <div style={{ textAlign: 'center' }}>
          {address ? (
            <Tag color="blue">{address}</Tag>
          ) : (
            <Tag color="red">Not Set</Tag>
          )}
        </div>
      ),
    },
    {
      title: <div style={{ textAlign: 'center' }}>Email</div>,
      dataIndex: "email",
      width: "10%",
    },
    {
      title: <div style={{ textAlign: 'center' }}>ROLE</div>,
      width: "70px",
      dataIndex: "id",
      showSorterTooltip: {
        target: "full-header",
      },
      render: (_, record) => {
        const hasRoleAdmin = record?.roles.some(
          (role) => role.name === "ROLE_ADMIN"
        );
        const hasRoleMember = record?.roles.some(
          (role) => role.name === "ROLE_MEMBER"
        );
        
        return (
          <div style={{ textAlign: 'center' }}>
            <Tag
              color={hasRoleAdmin ? "red" : hasRoleMember ? "green" : "gray"}
              style={{ width: '70px', textAlign: 'center' }}
            >
              {hasRoleAdmin ? "ADMIN" : hasRoleMember ? "MEMBER" : "SHOP"}
            </Tag>
          </div>
        );
      },
      width: "10%",
    },
    {
      title: <div style={{ textAlign: 'center' }}>Package</div>,
      dataIndex: "auserPackage",
      width: "10%",
      render: (auserPackage) => {
        if (!auserPackage?.name) {
          return <div style={{ textAlign: 'center' }}>No Package</div>;
        }

        let bgColor = '';
        switch (auserPackage.name.toLowerCase()) {
          case 'advanced':
            bgColor = '#FAF3E1';
            break;
          case 'professional':
            bgColor = '#F5E7C6';
            break;
          case 'vip':
            bgColor = '#FF6D1F';
            break;
          case 'svip':
            bgColor = '#222222';
            break;
          default:
            bgColor = 'transparent';
        }

        return (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                border: '1px solid #d9d9d9',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: bgColor,
                color: auserPackage.name.toLowerCase() === 'svip' ? 'white' : 'inherit',
                display: 'inline-block',
                width: '110px',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 'bold',
              }}
            >
              {auserPackage.name}
            </div>
          </div>
        );
      },
    },
    {
      title: <div style={{ textAlign: 'center' }}>Action</div>,
      dataIndex: "",
      key: "x",
      render: (_, user) => {
        return (
          <div style={{ textAlign: 'center' }}>
            {user.roles.some((role) => role.name === "ROLE_ADMIN") ? (
              <EditOutlined
                className="mr-[15px]"
                style={{ color: "blue" }}
              />
            ) : (
              <Button
                className="bg-red-600 text-white hover:!bg-red-500 hover:!text-white transition-all duration-300 ease-in-out"
                onClick={() => handleDelete(user.id)}
                loading={loadingId === user.id}
                disabled={isDeleting}
              >
                {isDeleting && loadingId === user.id ? "Deleting..." : "Delete"}
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
        className="bg-blue-600 mb-[15px] text-white hover:!bg-blue-500 hover:!text-white transition-all duration-300 ease-in-out"
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
        columns={columns.map(column => {
          if (column.title === "Action") {
            return {
              ...column,
              render: (_, user) => (
                <div key={user.id}>
                  {user.roles.some((role) => role.name === "ROLE_ADMIN") ? (
                    <EditOutlined
                      className="mr-[15px]"
                      style={{ color: "blue" }}
                    />
                  ) : (
                    <Button
                      className="bg-red-600 text-white hover:!bg-red-500 hover:!text-white transition-all duration-300 ease-in-out"
                      onClick={() => handleDelete(user.id)}
                      loading={loadingId === user.id}
                      disabled={isDeleting}
                    >
                      {isDeleting && loadingId === user.id ? "Deleting..." : "Delete"}
                    </Button>
                  )}
                </div>
              ),
            };
          }
          return column;
        })}
        dataSource={data}
        onChange={onChange}
        showSorterTooltip={{
          target: "sorter-icon",
        }}
        loading={isFetching}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
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
