import React, { useEffect, useState } from "react";
import { manageBlogsServicesH } from "../../../services/shop/manageBlogServicesH";
import { useSelector } from "react-redux";
import { useGetBlogsByAuthorId } from "../../../hooks/blogs/useGetBlogsByAuthorId";
import { Table, Button, Spin, Tooltip, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constant";
import { useDeleeteBlogById } from "../../../hooks/blogs/useDeleeteBlogById";
import { toast } from "react-toastify";

const ManageBlogs = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const authorId = userLogin?.id;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [deletingId, setDeletingId] = useState(null);
  const {
    data: lstBlogs,
    refetch,
    isFetching,
  } = useGetBlogsByAuthorId(authorId);
  const mutatetion = useDeleeteBlogById();
  useEffect(() => {
    refetch();
  }, []);
  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Delete Blog',
      content: 'Are you sure you want to delete this blog?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteBlog(id);
      },
    });
  };

  const deleteBlog = async (id) => {
    setDeletingId(id);
    try {
      await mutatetion.mutateAsync(id);
      toast.success("Blog deleted successfully!");
      refetch();
    } catch (error) {
      toast.error(`Error deleting blog: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // if (isFetching) {
  //   return (
  //     <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
  //       <Spin tip="Loading" size="large" />
  //     </div>
  //   );
  // }

  const truncateText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate">{truncateText(text, 30)}</div>
        </Tooltip>
      ),
    },
    {
      title: "Header",
      dataIndex: "headerTop",
      key: "headerTop",
      width: "20%",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate">{truncateText(text, 30)}</div>
        </Tooltip>
      ),
    },
    {
      title: "Content",
      dataIndex: "contentTop",
      key: "contentTop",
      width: "30%",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate">{truncateText(text, 50)}</div>
        </Tooltip>
      ),
    },
    {
      title: "Image",
      dataIndex: "bodyImageUrl",
      key: "bodyImageUrl",
      width: "10%",
      render: (url) => (
        <img 
          src={url} 
          alt="Body" 
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (_, record) => {
        return (
          <div className="flex space-x-2">
            <Button
              className="bg-green-400 text-white hover:bg-green-500 hover:text-white"
              onClick={() => navigate(`${PATH.EDIT_BLOG}/${record?.id}`)}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDelete(record?.id)}
              loading={deletingId === record?.id}
              className="bg-red-600 text-white hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out"
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button
          className="bg-black text-white hover:bg-gray-800"
          onClick={() => navigate(PATH.ADD_BLOG)}
        >
          Add Blog
        </Button>
        <h1 className="text-3xl font-bold absolute left-1/2 transform -translate-x-1/2">Manage Blogs</h1>
        <div className="w-[100px]"></div> {/* Spacer to balance the layout */}
      </div>
      <Table 
        dataSource={lstBlogs} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
        className="shadow-lg rounded-lg overflow-hidden"
        bordered={false} // Remove the border
      />
    </div>
  );
};

export default ManageBlogs;
