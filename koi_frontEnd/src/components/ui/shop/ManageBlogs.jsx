import React from "react";
import { manageBlogsServicesH } from "../../../services/shop/manageBlogServicesH";
import { useSelector } from "react-redux";
import { useGetBlogsByAuthorId } from "../../../hooks/blogs/useGetBlogsByAuthorId";
import { Table, Button } from "antd"; // Import Table and Button from antd
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constant";

const ManageBlogs = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const authorId = userLogin?.id;
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data: lstBlogs } = useGetBlogsByAuthorId(authorId);
  console.log(lstBlogs);

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
      render: (_, record) => (
        <>
          <Button className="mr-[15px] bg-green-400 text-white hover:!bg-green-500 hover:!text-white" onClick={() => {
            navigate(`${PATH.EDIT_BLOG}/${record?.id}`)
          }}>
            Edit
          </Button>
          <Button className="bg-red-600 text-white hover:!bg-red-500 hover:!text-white  transition-all duration-300 ease-in-out">
            Delete
          </Button>
        </>
      ),
      width: "15%",
    },
  ];

  return (
    <div className="my-[60px]">
      <h1>{t("Manage Blog")}</h1>
      <Table dataSource={lstBlogs} columns={columns} rowKey="id" />
    </div>
  );
};

export default ManageBlogs;
