import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetBlogBySlug } from "../../../hooks/blogs/useGetBlogBySlug";
import { Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const BlogsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: blog, isLoading, isError, refetch } = useGetBlogBySlug(slug);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    setIsTransitioning(true);
    refetch().then(() => {
      window.scrollTo(0, 0);
      setIsTransitioning(false);
    });
  }, [slug, refetch]);

  if (isError || !blog) {
    return (
      <div className="text-center py-10">
        <p>Blog not found</p>
        <Link to="/blogs">
          <Button icon={<ArrowLeftOutlined />}>Return to Blogs</Button>
        </Link>
      </div>
    );
  }

  const formatContent = (content) => {
    if (!content) return null;
    
    // Replace literal '\n' with actual newlines
    const processedContent = content.replace(/\\n/g, '\n');
    
    // Split by double newlines to separate paragraphs
    return processedContent
      .split(/\n\n+/)
      .map((paragraph, index) => {
        // Handle single newlines within paragraphs
        const formattedParagraph = paragraph
          .trim()
          .split(/\n/)
          .map((line, lineIndex) => (
            <React.Fragment key={`line-${lineIndex}`}>
              {line}
              {lineIndex !== paragraph.split(/\n/).length - 1 && <br />}
            </React.Fragment>
          ));

        return (
          <p key={`paragraph-${index}`} className="mb-6 text-lg text-gray-700">
            {formattedParagraph}
          </p>
        );
      });
  };

  return (
    <div className="min-h-[450px]">
      {(isLoading || isTransitioning) ? (
        <div className="flex justify-center items-center min-h-[450px]">
          <Spin tip="Loading" size="large" />
        </div>
      ) : (
        <article className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Return Button */}
          <Link to="/blogs" className="mb-8 inline-block">
            <Button icon={<ArrowLeftOutlined />}>Return</Button>
          </Link>

          {/* Header Section */}
          <header className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {blog?.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mb-8">
              <span className="text-sm">By</span>
              <span className="font-medium text-gray-900">{blog?.author?.username}</span>
            </div>
            <div className="max-w-3xl mx-auto aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
              <img
                className="w-full h-full object-cover"
                src={blog?.headerImageUrl}
                alt={blog?.title}
                loading="lazy"
              />
            </div>
          </header>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                {blog?.headerTop}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {formatContent(blog?.contentTop)}
              </div>
            </div>

            {/* Side Image */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    className="w-full h-full object-cover"
                    src={blog?.bodyImageUrl}
                    alt="Article illustration"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <section className="max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
              {blog?.headerMiddle}
            </h2>
            <div className="text-lg text-gray-700 leading-relaxed">
              {formatContent(blog?.contentMiddle)}
            </div>
          </section>
        </article>
      )}
    </div>
  );
};

export default BlogsDetail;
