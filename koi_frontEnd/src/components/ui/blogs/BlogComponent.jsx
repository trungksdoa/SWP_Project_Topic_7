import React, { useState } from "react";
import { Card, Pagination } from "antd";
import { useGetAllBlogs } from "../../../hooks/blogs/useGetAllBlogs";
import { PATH } from "../../../constant";
import { useNavigate } from "react-router-dom";

const BlogComponent = () => {
  const { data: lstBlogs } = useGetAllBlogs();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = lstBlogs?.slice(indexOfFirstBlog, indexOfLastBlog);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto mb-10 min-h-[450px]">
      <div className="flex justify-center items-center text-bold text-3xl h-full m-4 mb-6">
        <strong>Blogs</strong>
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-[30px] grid-cols-2">
        {currentBlogs?.map((blogs) => {
          return (
            <Card
              key={blogs?.id}
              hoverable
              style={{
                width: 240,
                border: "1px solid #ccc",
                overflow: "hidden",
              }}
              onClick={() => {
                navigate(`${PATH.BLOG_DETAIL}/${blogs?.slug}`);
              }}
              cover={
                <div className="h-[200px] overflow-hidden">
                  <img
                    alt={blogs?.title}
                    className="w-full h-full object-cover cursor-pointer"
                    src={`${blogs?.headerImageUrl}?t=${new Date().getTime()}`}
                  />
                </div>
              }
            >
              <div className="p-[2px]">
                <h2 className="font-bold min-h-[44px] mb-[5px]">
                  {blogs?.title}
                </h2>
                <p>
                  {blogs?.contentTop?.length > 100
                    ? `${blogs.contentTop.substring(0, 100)}... see more`
                    : blogs?.contentTop}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="flex justify-center mt-8">
        <Pagination
          current={currentPage}
          total={lstBlogs?.length || 0}
          pageSize={blogsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default BlogComponent;
