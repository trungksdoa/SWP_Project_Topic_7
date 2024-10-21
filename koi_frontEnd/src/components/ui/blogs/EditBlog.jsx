import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input, Button, Form, message, Spin } from "antd";
import { useGetBlogById } from "../../../hooks/blogs/useGetBlogById";
import { usePutBlog } from "../../../hooks/blogs/usePutBlogs";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

const EditBlog = () => {
  const { id: blogId } = useParams();
  const parseId = parseInt(blogId);
  const { data: blog, refetch, isPending } = useGetBlogById(parseId);
  const [imgSrc, setImgSrc] = useState("");
  const mutation = usePutBlog();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      headerTop: "",
      contentTop: "",
      headerMiddle: "",
      contentMiddle: "",
      headerImage: null,
      bodyImage: null,
    },
    onSubmit: (values) => {
      setIsLoading(true);
      const formData = new FormData();

      // Convert blog data to JSON and append to formData
      const blog = {
        title: values.title,
        headerTop: values.headerTop,
        contentTop: values.contentTop,
        headerMiddle: values.headerMiddle,
        contentMiddle: values.contentMiddle,
      };
      formData.append("blog", JSON.stringify(blog));

      // Append headerImage to formData if it exists
      if (values.headerImage) {
        formData.append("headerImage", values.headerImage);
      }

      // Append bodyImage to formData if it exists
      if (values.bodyImage) {
        formData.append("bodyImage", values.bodyImage);
      }

      mutation.mutate(
        { id: parseId, payload: formData },
        {
          onSuccess: (response) => {
            setIsLoading(false);
            formik.resetForm();
            message.success("Blog updated successfully");
            navigate('/blogs/manageblogs');
          },
          onError: (error) => {
            setIsLoading(false);
            message.error("Error updating blog");
          },
        }
      );
    },
  });

  useEffect(() => {
    if (blog) {
      formik.setValues({
        title: blog.title || "",
        headerTop: blog.headerTop || "",
        contentTop: blog.contentTop || "",
        headerMiddle: blog.headerMiddle || "",
        contentMiddle: blog.contentMiddle || "",
        headerImage: null,
        bodyImage: null,
      });
    }
  }, [blog]);

  const handleChangeFile = (e, fieldName) => {
    let file = e.target.files?.[0];
    if (
      file &&
      [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ].includes(file.type)
    ) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setImgSrc(e.target?.result);
      };
      formik.setFieldValue(fieldName, file);
    }
  };

  const textAreaStyle = {
    resize: 'none',
    padding: '8px',
    minHeight: '150px',
    maxHeight: '300px',
    overflowY: 'auto',
  };

  useEffect(() => {
    refetch();
  }, [parseId, refetch]);

  if (isPending || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin tip="Loading" size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-10">
      <Button 
        onClick={() => navigate('/blogs/manageblogs')}
        className="bg-gray-200 hover:bg-gray-300 ml-4 mt-4 self-start"
      >
        Return
      </Button>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        onSubmitCapture={formik.handleSubmit}
        className="p-4 flex-grow flex flex-col"
      >
        <div className="text-center text-3xl font-bold mb-6">
          Edit Blog
        </div>
        <div className="flex-grow space-y-4">
          <Form.Item label="Title">
            <Input
              placeholder="Title"
              className="w-full"
              onChange={formik.handleChange}
              name="title"
              value={formik.values.title}
            />
          </Form.Item>
          <Form.Item label="Header 1">
            <Input.TextArea
              onChange={formik.handleChange}
              name="headerTop"
              value={formik.values.headerTop}
              style={{...textAreaStyle, minHeight: '100px', maxHeight: '400px'}}
            />
          </Form.Item>
          <Form.Item label="Header 2">
            <Input.TextArea
              onChange={formik.handleChange}
              name="headerMiddle"
              value={formik.values.headerMiddle}
              style={{...textAreaStyle, minHeight: '100px', maxHeight: '400px'}}
            />
          </Form.Item>
          <Form.Item label="Content 1">
            <Input.TextArea
              onChange={formik.handleChange}
              name="contentTop"
              value={formik.values.contentTop}
              style={{...textAreaStyle, minHeight: '200px', maxHeight: '400px'}}
            />
          </Form.Item>
          <Form.Item label="Content 2">
            <Input.TextArea
              onChange={formik.handleChange}
              name="contentMiddle"
              value={formik.values.contentMiddle}
              style={{...textAreaStyle, minHeight: '200px', maxHeight: '400px'}}
            />
          </Form.Item>
          <Form.Item label="Header Image">
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
              onChange={(e) => handleChangeFile(e, "headerImage")}
            />
          </Form.Item>
          <Form.Item label="Body Image">
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
              onChange={(e) => handleChangeFile(e, "bodyImage")}
            />
          </Form.Item>
        </div>
        <Form.Item className="mt-8 flex justify-center">
          <Button
            htmlType="submit"
            type="primary"
            loading={mutation.isPending}
            className="text-xl text-white bg-black px-20 py-4 w-64"
          >
            <strong>Update Blog</strong>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditBlog;
