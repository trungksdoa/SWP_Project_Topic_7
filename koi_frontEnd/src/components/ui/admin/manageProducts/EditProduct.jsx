import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProductById } from "../../../../hooks/user/UserGetProductById";
import { Button, Form, Input, InputNumber, Radio } from "antd";
import { useFormik } from "formik";
import { usePutProduct } from "../../../../hooks/admin/manageProducts/usePutProduct";
import { toast } from "react-toastify";
import { manageProductServiceH } from "../../../../services/admin/manageProductServiceH";
import { manageProductsServices } from "../../../../services/manageProducrsServices";

const EditProduct = () => {
  const { TextArea } = Input;
  const { id } = useParams();
  const parseId = parseInt(id);
  const mutation = usePutProduct();
  const [imgSrc, setImgSrc] = useState("");

  const [product, setProduct] = useState(null)

  useEffect(() => {
    manageProductsServices.getProductById(parseId).then((res) => {
      setProduct(res?.data?.data)
    })
    .catch((res) => {
    })
  }, [parseId])
  

  // Khởi tạo formik sau khi dữ liệu sản phẩm được tải
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: product?.name || "",
      price: product?.price || 0,
      description: product?.description || "",
      stock: product?.stock || 0,
      categoryId: product?.categoryId || 1,
      imageUrl: product?.imageUrl || "",
      image: null,
    },
    onSubmit: (values) => {
      const formData = new FormData();
      const updatedProduct = {
        name: values.name,
        price: values.price,
        description: values.description,
        stock: values.stock,
        categoryId: values.categoryId,
        imageUrl: values.imageUrl, // giữ imageUrl nếu không đổi ảnh
      };

      // Nếu có file ảnh mới, thêm vào formData
      if (values.image) {
        formData.append("image", values.image);
      }
      formData.append("product", JSON.stringify(updatedProduct));

      // Gửi request PUT với formData và id
      mutation.mutate({ id: parseId, payload: formData }, {
        onSuccess: (response) => {
          toast.success("Product updated successfully");
        },
        onError: (error) => {
          toast.error("Error updating product");
        },
      });
    },
  });

  const handleChangeFile = (e) => {
    let file = e.target.files?.[0];
    if (file && ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        setImgSrc(e.target?.result);
      };
      formik.setFieldValue("image", file);
    }
  };

  return (
    <div>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        onSubmitCapture={formik.handleSubmit}
      >
        <Form.Item label="Category Id">
          <Radio.Group
            name="categoryId"
            onChange={(e) => formik.setFieldValue("categoryId", e.target.value)}
            value={formik.values.categoryId}
          >
            <Radio value={1}>Water Treatment</Radio>
            <Radio value={2}>Koi Treatment</Radio>
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
          <img
            src={imgSrc || product?.imageUrl}
            alt="Preview"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        </Form.Item>
        <Form.Item label="Action">
          <Button
            style={{
              backgroundColor: "#90c63f",
              padding: "10px 0",
              width: 140,
            }}
            htmlType="submit"
            loading={mutation.isPending}
          >
            Update Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProduct;
