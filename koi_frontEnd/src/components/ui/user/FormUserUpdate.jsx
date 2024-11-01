import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button, Checkbox, Form, Input } from "antd";
import { useUpdateUser } from "../../../hooks/user/useUpdateUser";
import { useDispatch, useSelector } from "react-redux";
import { manageUserActions } from "../../../store/manageUser/slice";
import { toast } from "react-toastify";
import { LOCAL_STORAGE_LOGIN_KEY } from "../../../constant/localStorage";
import { UserOutlined } from "@ant-design/icons";

const FormUserUpdate = ({ user, refetch }) => {
  const mutation = useUpdateUser();
  const [imgSrc, setImgSrc] = useState("");
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.manageUser.userLogin);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: user?.username || "",
      email: user?.email || "",
      address: user?.address || "",
      phoneNumber: user?.phoneNumber || "",
      image: user?.avatar || null,
    },
    onSubmit: (values) => {
      const accessToken = userLogin?.accessToken 
      const roles = userLogin?.roles
      const id = userLogin?.id
      const formData = new FormData();
      const updateUser = {
        username: values.username,
        email: values.email,
        address: values.address,
        phoneNumber: values.phoneNumber,
        image: values.avatar,
      };
      if (values.image) {
        formData.append("image", values.image);
      }
      formData.append("user", JSON.stringify(updateUser));
      mutation.mutate(
        { id: user?.id, payload: formData },
        {
          onSuccess: () => {
            const user = {
              accessToken,
              roles,
              id, 
              username: values.username,
              email: values.email,
              address: values.address,
              phoneNumber: values.phoneNumber,
              avatar: values.avatar,
              active: "true",
            };
            dispatch(
              manageUserActions.updateUserLogin({
                ...user,
              })
            );
            localStorage.setItem(LOCAL_STORAGE_LOGIN_KEY, JSON.stringify(user));
            refetch();
            toast.success("User updated successfully");
          },
          onError: () => {
            toast.error("Error updating user");
          },
        }
      );
    },
  });

  const handleChangeFile = (e) => {
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
      formik.setFieldValue("image", file);
    }
  };

  return (
    <div className="flex gap-8">
      {/* Left Column - Avatar and Welcome */}
      <div className="w-1/3 flex flex-col items-center">
        <div className="mb-6">
          {imgSrc || user?.avatar ? (
            <div className="h-[150px] w-[150px] rounded-full border border-black overflow-hidden">
              <img 
                src={imgSrc || user?.avatar} 
                alt="Image" 
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-[150px] w-[150px] rounded-full border border-black flex justify-center items-center">
              <UserOutlined style={{ fontSize: "80px" }} />
            </div>
          )}
        </div>
        
        <h2 className="text-[32px] text-center">
          Welcome,{" "}
          <span className="font-bold text-orange-500">
            {userLogin?.username}
          </span>
        </h2>
      </div>

      {/* Right Column - Form Fields */}
      <div className="w-2/3">
        <Form
          layout="vertical"
          className="w-full"
          onSubmitCapture={formik.handleSubmit}
        >
          <Form.Item 
            label="Name"
            className="mb-6"
          >
            <Input
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} 
              value={formik.values.username}
              className="py-2"
            />
          </Form.Item>

          <Form.Item 
            label="Address"
            className="mb-6"
          >
            <Input
              name="address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
              className="py-2"
            />
          </Form.Item>

          <Form.Item 
            label="Phone"
            className="mb-6"
            validateStatus={formik.values.phoneNumber && /[^\d+\-\s()]/g.test(formik.values.phoneNumber) ? "error" : ""}
            help={formik.values.phoneNumber && /[^\d+\-\s()]/g.test(formik.values.phoneNumber) ? "Please enter numbers only" : ""}
          >
            <Input
              name="phoneNumber"
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d+\-\s()]/g, '');
                formik.setFieldValue('phoneNumber', value);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.phoneNumber}
              className="py-2"
            />
          </Form.Item>

          {/* Package Information */}
          <Form.Item 
            label="Current Package"
            className="mb-6"
          >
            <Input
              value={user?.userPackage?.name || 'No Package'}
              disabled
              className="py-2 !text-black"
            />
          </Form.Item>

            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
              onChange={handleChangeFile}
            className="mb-4 w-[200px]"
          />
          <Form.Item className="flex justify-center">
            <Button
              loading={mutation.isPending}
              htmlType="submit"
              className="bg-black text-white hover:bg-gray-800 transition-colors duration-300 px-8 mb-8 font-bold text-lg"
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default FormUserUpdate;
