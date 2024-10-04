import React from "react";
import BlogComponent from "../components/ui/blogs/BlogComponent";
import BreadcrumbComponent from "../components/ui/BreadcrumbCoponent";

const BlogsPage = () => {
  return (
    <div>
      <BreadcrumbComponent
        items={[{ name: "Home", path: "/" }, { name: "Blog" }]}
      />
      <BlogComponent />
    </div>
  );
};

export default BlogsPage;
