import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { manageCatgegoryServiceAdmin } from "../../../../services/admin/manageCategoryServiceAdmin";
import { useFormik } from "formik";
import { Button, Form, Input, InputNumber, Radio } from "antd";
import { usePutCategory } from "../../../../hooks/admin/manageCategory/usePutCategory";
import { toast } from "react-toastify";


const EditCategory = () => {
  const { id: categoryId } = useParams();
  const parseId = parseInt(categoryId);
  const [category, setCategory] = useState(null);
  const mutation = usePutCategory()
  useEffect(() => {
    manageCatgegoryServiceAdmin
      .getCategoryById(parseId)
      .then((res) => {
        setCategory(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [parseId]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: parseId,
      name: category?.name || "",
      description: category?.description || "",
    },
    onSubmit: (values) => {
      mutation.mutate({id: parseId, payload: values}, {
        onSuccess: () => {
          toast.success("Update Category Successfully !")
        }
      })
    }
  });
  return <div>
          <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        onSubmitCapture={formik.handleSubmit}
      >
        <Form.Item label="Name">
          <Input
            onChange={formik.handleChange}
            name="name"
            value={formik.values.name}
          />
        </Form.Item>
        <Form.Item label="Description">
          <Input
            onChange={formik.handleChange}
            name="description"
            value={formik.values.description}
          />
        </Form.Item>
        <Form.Item label="Action">
          <Button
            loading={mutation.isPending}
            style={{
              backgroundColor: "#90c63f",
              padding: "10px 0",
              width: 140,
            }}
            htmlType="submit"
          >
            Update Package
          </Button>
        </Form.Item>
      </Form>
  </div>;
};

export default EditCategory;
