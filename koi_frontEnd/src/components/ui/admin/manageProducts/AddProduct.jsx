import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Radio, 
  Button,
  message
} from "antd";
import { useFormik } from "formik";
import { usePostProducts } from "../../../../hooks/admin/manageProducts/usePostProducts";

const AddProduct = () => {
  const { TextArea } = Input;
  const mutation = usePostProducts();
  const [imgSrc, setImgSrc] = useState("");
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleChangeFile = (e) => {
    let file = e.target.files?.[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.type === "image/webp")
    ) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setImgSrc(e.target?.result);
      };
      formik.setFieldValue("image", file);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      price: 0,
      description: "",
      stock: 0,
      categoryId: 0,
      image: null,
    },
    onSubmit: (values) => {
      const formData = new FormData();
      const product = {
        name: values.name,
        price: values.price,
        description: values.description,
        stock: values.stock,
        categoryId: values.categoryId,
      };

      formData.append("product", JSON.stringify(product));

      if (values.image) {
        formData.append("image", values.image);
      }

      // Gửi request thông qua API
      mutation.mutate(formData, {
        onSuccess: (response) => {
          formik.resetForm()
          message.success("Product added successfully");
        },
        onError: (error) => {
          message.error("Error adding product");
        },
      });
    },
  });

  return (
    <div>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
        }}
        onSubmitCapture={formik.handleSubmit}
      >
        <Form.Item label="Category Id">
          <Radio.Group
            name="categoryId"
            onChange={(e) => formik.setFieldValue("categoryId", e.target.value)}
            value={formik.values.categoryId}
          >
            <Radio value={1}> Water Treatment </Radio>
            <Radio value={2}> Koi Treatment </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Name">
          <Input
            onChange={formik.handleChange}
            name="name"
            value={formik.values.name}
          />
        </Form.Item>
        <Form.Item label="Price">
          <InputNumber
            onChange={(value) => formik.setFieldValue("price", value)}
            value={formik.values.price}
          />
        </Form.Item>
        <Form.Item label="Stock">
          <InputNumber
            onChange={(value) => formik.setFieldValue("stock", value)}
            value={formik.values.stock}
          />
        </Form.Item>
        <Form.Item label="Description">
          <TextArea
            rows={4}
            onChange={formik.handleChange}
            name="description"
            value={formik.values.description}
          />
        </Form.Item>
        <Form.Item label="Image">
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
            onChange={handleChangeFile}
          />
          <img src={imgSrc} alt="Preview" />
        </Form.Item>
        <Form.Item label="Action">
        <Button
          htmlType="submit"
          className="bg-rose-500 rounded-[6px] p-0 !w-[160px] text-white"
          style={{ display: "block" }}
          loading={mutation.isPending}
        >
          Add Product
        </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
