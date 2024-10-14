import React, { useEffect, useState } from "react";
import { manageBlogsServicesH } from "../../../services/shop/manageBlogServicesH";
import { useSelector } from "react-redux";
import { useGetBlogsByAuthorId } from "../../../hooks/blogs/useGetBlogsByAuthorId";
import { Table, Button, Spin } from "antd"; // Import Table and Button from antd
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constant";
import { useDeleeteBlogById } from "../../../hooks/blogs/useDeleeteBlogById";

const ManageBlogs = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const authorId = userLogin?.id;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [deletingId, setDeletingId] = useState(null);
  const { data: lstBlogs, refetch, isFetching } = useGetBlogsByAuthorId(authorId);
  const mutatetion = useDeleeteBlogById();
  useEffect(() => {
    refetch();
  }, []);
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeletingId(id); // Set ID sản phẩm đang được xóa
      mutatetion.mutate(id, {
        onSuccess: () => {
          toast.success("Delete Product Successfully!");
          refetch();
          setDeletingId(null); // Xóa thành công, reset ID xóa
        },
        onError: () => {
          toast.error("Delete Product Failed!");
          setDeletingId(null); // Nếu lỗi, reset ID xóa
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

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "10%",
    },
    {
      title: "Header Top",
      dataIndex: "headerTop",
      key: "headerTop",
    },
    {
      title: "Header Middle",
      dataIndex: "headerMiddle",
      key: "headerMiddle",
    },
    {
      title: "Content Top",
      dataIndex: "contentTop",
      key: "contentTop",
      render: (text) => (
        <div>{text.length > 100 ? `${text.substring(0, 100)}... ` : text}</div>
      ),
    },
    {
      title: "Content Middle",
      dataIndex: "contentMiddle",
      key: "contentMiddle",
      render: (text) => (
        <div>{text.length > 100 ? `${text.substring(0, 100)}... ` : text}</div>
      ),
    },
    {
      title: "Body Image",
      dataIndex: "bodyImageUrl",
      key: "bodyImageUrl",
      render: (url) => <img src={url} alt="Body" style={{ width: "100px" }} />,
    },
    {
      title: "Header Image",
      dataIndex: "headerImageUrl",
      key: "headerImageUrl",
      render: (url) => (
        <img src={url} alt="Header" style={{ width: "100px" }} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        return ((
          <>
            <Button
              className="mr-[15px] bg-green-400 text-white hover:!bg-green-500 hover:!text-white w-20 h-8" 
              onClick={() => {
                navigate(`${PATH.EDIT_BLOG}/${record?.id}`);
              }}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                handleDelete(record?.id);
              }}
              loading={deletingId === record?.id}
              className="bg-red-600 text-white hover:!bg-red-500 hover:!text-white transition-all duration-300 ease-in-out w-20 h-8" 
            >
              Delete
            </Button>
          </>
        ))
      },
      width: "15%",
    },
  ];

  return (
    <div className="my-[60px]">
    <div className="flex justify-center items-center text-bold text-3xl h-2 mb-2">
        <strong>Manage Blog</strong>
      </div>      
      <button className="bg-black text-white px-[12px] py-[8px] rounded-[6px] mb-[30px]" onClick={() =>{
        navigate(PATH.ADD_BLOG)
      }}>Add Blogs</button>
      <Table dataSource={lstBlogs} columns={columns} rowKey="id" />
    </div>
  );
};

export default ManageBlogs;