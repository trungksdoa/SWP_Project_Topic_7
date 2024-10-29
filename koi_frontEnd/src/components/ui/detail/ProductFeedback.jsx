import React, { useEffect } from "react";
import { useGetFeedbackById } from "../../../hooks/feedback/useGetFeedbackById";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { usePostFeedBack } from "../../../hooks/feedback/usePostFeedback";
import { useTranslation } from "react-i18next";
import { StarRating } from "./StarRating";
import { toast } from "react-toastify";
import { Button } from "antd";

const ProductFeedback = ({ prdId }) => {
  const { data: feedbacks, refetch } = useGetFeedbackById(prdId);
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const mutation = usePostFeedBack();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      userId: userLogin?.id,
      productId: prdId,
      rating: 0,
      comment: "",
    },
    onSubmit: (values) => {
      mutation.mutate(values, {
        onSuccess: () => {
          formik.resetForm();
          toast.success("Add Feedback Successfully !");
          refetch();
        },
        onError: (error) => {
          console.error("Error adding feedback:", error);
          toast.error("Failed to add feedback.");
        },
      });
    },
  });

  return (
    <div>
      <div>
        <h2 className="font-semibold text-[24px] mb-[30px]">
          Customer Feedback
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <textarea
            onChange={formik.handleChange}
            className="mb-[20px] w-full border-[1px] border-black pl-[10px] pt-2 rounded-[10px] h-20"
            placeholder={t("Comment here")}
            name="comment" // Đổi từ 'rating' thành 'comment'
            cols="30"
            rows="7"
            value={formik.values.comment} // Đảm bảo giá trị được liên kết với formik
          ></textarea>

          <div className="flex mb-[20px] items-center">
            <span className="mr-[10px]">{t("Số sao")}: </span>
            <StarRating
              value={formik.values.rating}
              onChange={(value) => formik.setFieldValue("rating", value)}
            />
          </div>
          <Button
            htmlType="submit"
            className="bg-black mb-[30px] rounded-[6px] p-0 !w-[160px] text-white text-xl"
            style={{ display: "block" }}
            loading={mutation.isPending}
          >
            <strong>{t("Send Now")}</strong>
          </Button>
        </form>
        {feedbacks?.map((fb, index) => {
          const formattedDate = fb?.createdAt
            ? new Date(fb.createdAt)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
                .replace(/-/g, "/")
            : "";
          return (
            <div
              className="mb-[30px] border p-[10px] rounded-md shadow-md"
              key={index}
            >
              <div className="flex items-center">
                <span className="font-semibold">{fb?.user?.username}</span>
                <span className="ml-auto text-yellow-500">
                  {"★".repeat(fb?.rating)}
                </span>
              </div>
              <p className="text-gray-600">{formattedDate}</p>
              <p className="mt-[10px]">{fb?.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductFeedback;
