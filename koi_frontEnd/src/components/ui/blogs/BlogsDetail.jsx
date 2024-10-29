import React from "react";
import { useParams } from "react-router-dom";
import { useGetBlogBySlug } from "../../../hooks/blogs/useGetBlogBySlug";

const BlogsDetail = () => {
  const { slug } = useParams();
  const { data: blog } = useGetBlogBySlug(slug);

  return (
    <div
      classname="!mx-auto !w-[80%] 
    !mb-[60px]"
    >
      <div className="title">
        <h1 className="!mb-[10px] font-bold">{blog?.title}</h1>
        <span className="text-gray-400">by {blog?.author?.username}</span>
        <img
          className="mt-[30px] w-full rounded-[12px]"
          src={blog?.headerImageUrl}
          alt={blog?.headerImageUrl}
        />
      </div>
      <div className="grid grid-cols-3 my-[40px] gap-[30px]">
        <div className="col-span-2">
          <h2 className="text-[24px] my-[30px] font-semibold">
            {blog?.headerTop}
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html: blog?.contentTop?.replace(/\n/g, "<br />"),
            }}
          ></div>
        </div>
        <div className="flex justify-end">
          <img
            className="rounded-[12px] object-contain"
            src={blog?.bodyImageUrl}
            alt=""
          />
        </div>
      </div>
      <div className="mb-[60px]">
        <h2 className="text-[24px] font-semibold mb-[30px] ">
          {blog?.headerMiddle}
        </h2>
        <p>{blog?.contentMiddle}</p>
      </div>
    </div>
  );
};

export default BlogsDetail;
