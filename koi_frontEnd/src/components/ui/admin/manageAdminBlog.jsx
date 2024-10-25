import React, { useState } from 'react';
import { Table, Button, Spin, Tooltip, Modal, Image, Checkbox } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constant";
import { toast } from "react-toastify";
import { useGetAllBlogs } from "../../../hooks/blogs/useGetAllBlogs";
import { useDeleeteBlogById } from "../../../hooks/blogs/useDeleeteBlogById";

const ManageAdminBlog = () => {
  const { data: lstBlogs, isLoading, refetch } = useGetAllBlogs();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);
  const [viewingBlog, setViewingBlog] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const mutatetion = useDeleeteBlogById();

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleSelectAll = () => {
    setSelectAll(true);
    setSelectedRowKeys(lstBlogs.map(blog => blog.id));
  };

  const handleCancelSelection = () => {
    setSelectAll(false);
    setSelectedRowKeys([]);
  };

  const handleDeleteSelected = () => {
    Modal.confirm({
      title: 'Delete Selected Blogs',
      content: `Are you sure you want to delete ${selectedRowKeys.length} selected blog(s)?`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteSelectedBlogs();
      },
    });
  };

  const deleteSelectedBlogs = async () => {
    setIsDeletingSelected(true);
    try {
      for (const id of selectedRowKeys) {
        await mutatetion.mutateAsync(id);
      }
      toast.success("Selected blogs deleted successfully!");
      setSelectedRowKeys([]);
      refetch();
    } catch (error) {
      toast.error(`Error deleting blogs: ${error.message}`);
    } finally {
      setIsDeletingSelected(false);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

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

  const handleView = (blog) => {
    setViewingBlog(blog);
  };

  const truncateText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "45%",
      render: (text) => (
        <Tooltip title={text}>
          <div className="truncate">{truncateText(text, 50)}</div>
        </Tooltip>
      ),
    },
    {
      title: "Author",
      dataIndex: ["author", "username"],
      key: "author",
      width: "20%",
    },
    {
      title: "Actions",
      key: "actions",
      width: "20%",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            className="bg-blue-400 text-white hover:bg-blue-500 hover:text-white"
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Button
            onClick={() => handleDelete(record?.id)}
            loading={deletingId === record?.id}
            className="bg-red-600 text-white hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center top-0 bottom-0 left-0 right-0 items-center h-full">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <Button onClick={handleSelectAll} className="mr-2">Select All Pages</Button>
          <Button onClick={handleCancelSelection} className="mr-2">Cancel Selection</Button>
          <Button 
            onClick={handleDeleteSelected} 
            disabled={selectedRowKeys.length === 0}
            loading={isDeletingSelected}
            className="bg-red-600 text-white hover:bg-red-500 hover:text-white transition-all duration-300 ease-in-out"
          >
            Delete Selected
          </Button>
        </div>
        <span>{`Selected ${selectedRowKeys.length} items`}</span>
      </div>
      
      <Table 
        rowSelection={rowSelection}
        dataSource={lstBlogs} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
        className="shadow-lg rounded-lg overflow-hidden"
        bordered={false}
      />
      
      <Modal
        visible={!!viewingBlog}
        onCancel={() => setViewingBlog(null)}
        footer={null}
        width="80%"
        centered={true}
        style={{ top: 20 }}
      >
        {viewingBlog && (
          <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <div className="title">
              <h1 className="!mb-[10px] font-bold">{viewingBlog.title}</h1>
              <span className="text-gray-400">by {viewingBlog.author?.username}</span>
              <Image
                className="mt-[30px] w-full rounded-[12px]"
                src={viewingBlog.headerImageUrl}
                alt={viewingBlog.headerImageUrl}
              />
            </div>
            <div className="grid grid-cols-3 my-[40px] gap-[30px]">
              <div className="col-span-2">
                <h2 className="text-[24px] my-[30px] font-semibold">
                  {viewingBlog.headerTop}
                </h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: viewingBlog.contentTop?.replace(/\n/g, "<br />"),
                  }}
                ></div>
              </div>
              <div className="flex justify-end">
                <Image className="rounded-[12px] object-contain" src={viewingBlog.bodyImageUrl} alt="" />
              </div>
            </div>
            <div className="mb-[60px]">
              <h2 className="text-[24px] font-semibold mb-[30px] ">
                {viewingBlog.headerMiddle}
              </h2>
              <p>{viewingBlog.contentMiddle}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageAdminBlog;
