import React from "react";
import BlogsDetail from "../components/ui/blogs/BlogsDetail";
import BreadcrumbComponent from "../components/ui/BreadcrumbCoponent";

const DetailBlogPage = () => {
  return (
    <div>
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, {name: "Blog", path: '/blogs'},  { name: "Blog Detail" }]}
      />
      <BlogsDetail />
    </div>
  );
};

export default DetailBlogPage;
