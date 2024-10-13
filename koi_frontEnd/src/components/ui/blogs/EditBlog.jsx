import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input, Button, Form } from "antd";
import { useGetBlogById } from "../../../hooks/blogs/useGetBlogById";
import { usePutBlog } from "../../../hooks/blogs/usePutBlogs";
import { useFormik } from "formik";

const EditBlog = () => {
  const { id: blogId } = useParams();
  const parseId = parseInt(blogId);
  const { data: blog, refetch, isPending } = useGetBlogById(parseId);
  const [imgSrc, setImgSrc] = useState("");
  const mutation = usePutBlog();
  console.log(blog?.id);
  const formik = useFormik({
    initialValues: {
      title: blog?.title || "",
      headerTop: blog?.headerTop || "",
      contentTop: blog?.contentTop || "",
      headerMiddle: blog?.headerMiddle || "",
      contentMiddle: blog?.contentMiddle || "",
      headerImage: blog?.headerImage || null,
      bodyImage: blog?.bodyImage || null,
    },
    onSubmit: (values) => {
      console.log(values);
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

      // Debug to see FormData
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]); // Debugging purpose
      }

      // Gửi mutation hoặc gọi API tại đây
      mutation.mutate(
        { id: parseId, payload: formData },
        {
          onSuccess: (response) => {
            formik.resetForm();
            toast.success("Product added successfully");
          },
          onError: (error) => {
            toast.error("Error adding product");
          },
        }
      );
    },
  });
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
      formik.setFieldValue(fieldName, file); // Set giá trị cho field tương ứng (headerImage hoặc bodyImage)
    }
  };

  useEffect(() => {
    refetch();
  }, [parseId]);
  return (
    <div>
      <div className="flex justify-center items-center text-bold text-3xl h-full m-8 mb-3">
        <strong>Blogs Editors</strong>
      </div>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        onSubmitCapture={formik.handleSubmit}
        className="p-4"
      >
        <Form.Item label="Title">
          <Input
            placeholder="Title"
            className="mb-4 w-full"
            onChange={formik.handleChange}
            name="title"
            value={formik.values.title}
          />
        </Form.Item>
        <Form.Item label="Header 1">
          <Input
            placeholder="Header_1"
            onChange={formik.handleChange}
            name="headerTop"
            value={formik.values.headerTop}
          />
        </Form.Item>
        <Form.Item label="Header 2">
          <Input
            placeholder="Header_2"
            onChange={formik.handleChange}
            name="headerMiddle"
            value={formik.values.headerMiddle}
          />
        </Form.Item>

        <Form.Item label="Content 1">
          <Input.TextArea
            placeholder="Content_1"
            className="mb-4 w-full"
            onChange={formik.handleChange}
            name="contentTop"
            value={formik.values.contentTop}
          />
        </Form.Item>
        <Form.Item label="Content 2">
          <Input.TextArea
            placeholder="Content_2"
            className="mb-4 w-full"
            onChange={formik.handleChange}
            name="contentMiddle"
            value={formik.values.contentMiddle}
          />
        </Form.Item>
        <Form.Item label="Header Image">
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
            onChange={(e) => handleChangeFile(e, "headerImage")} // Truyền thêm tên field
          />
        </Form.Item>

        <Form.Item label="Body Image">
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
            onChange={(e) => handleChangeFile(e, "bodyImage")} // Truyền thêm tên field
          />
        </Form.Item>

        <Form.Item className="flex justify-center items-center">
          <div className="">
            <Button
              htmlType="submit"
              type="primary"
              loading={mutation.isPending}
              className="text-xl text-white bg-black px-40 py-4"
            >
              Update
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditBlog;
