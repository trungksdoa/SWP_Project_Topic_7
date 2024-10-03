import React from "react";
import { Spin, Checkbox, Col, Row, Card, Select } from "antd";
import { useGetAllBlogs } from "../../../hooks/blogs/useGetAllBlogs";
import { PATH } from "../../../constant";
import { useNavigate } from "react-router-dom";

const BlogComponent = () => {
  const { data: lstBlogs } = useGetAllBlogs();
  const navigate = useNavigate()
  console.log(lstBlogs);
  return (
    <div className="my-[60px] container mx-auto">
      <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-[30px] grid-cols-2">
        {lstBlogs?.map((blogs, index) => {
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
                <img
                  alt={blogs?.title}
                  className="relative z-0 max-h-[250px] object-contain cursor-pointer"
                  src={`${blogs?.headerImageUrl}?t=${new Date().getTime()}`}
                />
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
    </div>
  );
};

export default BlogComponent;
