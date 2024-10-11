import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button, Checkbox, Form, Input } from "antd";
import { useUpdateUser } from "../../../hooks/user/useUpdateUser";
import { useDispatch, useSelector } from "react-redux";
import { manageUserActions } from "../../../store/manageUser/slice";
import { toast } from "react-toastify";
import { LOCAL_STORAGE_LOGIN_KEY } from "../../../constant/localStorage";

const FormUserUpdate = ({ user, refetch }) => {
  const mutation = useUpdateUser();
  const [imgSrc, setImgSrc] = useState("");
  const [componentDisabled, setComponentDisabled] = useState(true); 
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.manageUser.userLogin)
  console.log(userLogin)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: user?.username || "",
      email: user?.email || "",
      address: user?.address || "",
      phoneNumber: user?.phoneNumber || "",
      avatar: null,
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
      };
      if (values.avatar) {
        formData.append("avatar", values.avatar);
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
              password: values.password,
              active: "true",
            };
            dispatch(
              manageUserActions.updateUserLogin({
                ...user,
              })
            );
            localStorage.setItem(LOCAL_STORAGE_LOGIN_KEY, JSON.stringify(user));
            setComponentDisabled(true);
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
      setComponentDisabled(false); 
    } else {
      setComponentDisabled(true); 
    }
  };

  return (
    <div className="!w-[100%] mx-[auto] flex flex-col">
      <>
        <Checkbox
          checked={!componentDisabled}
          onChange={(e) => setComponentDisabled(!e.target.checked)}
          className="mt-[15px] text-gray-600 underline cursor-pointer hover:text-orange-500 transition-all duration-300"
        >
          Update Info
        </Checkbox>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          layout="horizontal"
          disabled={componentDisabled}
          style={{ width: "100%", marginTop: "40px" }} // Đã thay đổi từ maxWidth thành width
          onSubmitCapture={formik.handleSubmit}
        >
          <Form.Item label="Name">
            <Input
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} 
              value={formik.values.username}
              disabled={componentDisabled} 
            />
          </Form.Item>
          <Form.Item label="Address">
            <Input
              name="address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
              disabled={componentDisabled}
            />
          </Form.Item>
          <Form.Item label="Phone">
            <Input
              name="phoneNumber"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phoneNumber}
              disabled={componentDisabled}
            />
          </Form.Item>
          <Form.Item label="Avatar">
            <input
              disabled={componentDisabled}
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
              onChange={handleChangeFile}
            />
            {imgSrc || user?.avatar ? (
              <img
                src={imgSrc}
                alt="Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  marginTop: "10px",
                }}
              />
            ) : null}
          </Form.Item>
          <Form.Item label="Button">
            <Button
              loading={mutation.isPending}
              htmlType="submit"
              style={{
                backgroundColor: componentDisabled ? "#ccc" : "#000",
                color: "#fff",
              }}
              disabled={componentDisabled}
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </>
    </div>
  );
};

export default FormUserUpdate;
