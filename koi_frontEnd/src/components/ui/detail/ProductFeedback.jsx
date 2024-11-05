import { useState } from "react";
import { useGetFeedbackById } from "../../../hooks/feedback/useGetFeedbackById";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { usePostFeedBack } from "../../../hooks/feedback/usePostFeedback";
import { useUpdateFeedback } from "../../../hooks/feedback/useUpdateFeedback";
import { useGetFeedbackOrder } from "../../../hooks/order/useGetNonFeedbackOrder";
import { useTranslation } from "react-i18next";
import { message, Select, Spin, Tag } from "antd";
import PropTypes from "prop-types";
import FeedbackForm from "./FeedBackForm";

const ProductFeedback = ({ prdId, averageRating }) => {
  const { data: feedbacks, refetch: refreshFeedbacks } = useGetFeedbackById(prdId);
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const mutation = usePostFeedBack();
  const updateMutation = useUpdateFeedback();
  const { t } = useTranslation();
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const {
    data: nonFeedbackOrders,
    refetch: refetchNonFeedbackOrders,
    isFetching: isFetchingNonFeedbackOrders,
  } = useGetFeedbackOrder(prdId);

  const isNewOrder = (createdAt) => {
    const diffDays = Math.ceil(
      Math.abs(new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 7;
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmitSuccess = async (res = null) => {
    await Promise.all([refreshFeedbacks(), refetchNonFeedbackOrders()]);
    
    if (res) {
      const { comment, rating } = res.data.data;
      setSelectedFeedback(res.data.data);
      formik.setFieldValue("rating", rating);
      formik.setFieldValue("comment", comment);
      message.success("Update Feedback Successfully!");
    } else {
      formik.resetForm();
      message.success("Add Feedback Successfully!");
    }
  };

  const formik = useFormik({
    initialValues: {
      userId: userLogin?.id,
      productId: prdId,
      rating: 0,
      comment: "",
      orderId: null,
      isUpdate: false,
      id: null,
    },
    onSubmit: (values) => {
      if (!values.orderId) {
        message.error("Please select an order to review");
        return;
      }

      if(values.rating === 0) {
        message.error("Please rate the product");
        return;
      }

      if (values.comment.trim() === "") {
        message.error("Please write your feedback");
        return;
      }

      const mutationToUse = values.isUpdate ? updateMutation : mutation;
      mutationToUse.mutate(values, {
        onSuccess: (res) => handleSubmitSuccess(values.isUpdate ? res : null),
        onError: (error) => {
          console.log(error);
          message.error("Something went wrong!");
        },
      });
    },
  });

  if (!userLogin) {
    return (
      <div className="text-center p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Please login to leave a review
        </h1>
      </div>
    );
  }

  if (isFetchingNonFeedbackOrders) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  const handleOrderSelect = (orderId) => {
    const existingFeedback = feedbacks?.find((fb) => fb.orderId === orderId);
    setSelectedFeedback(existingFeedback);
    formik.setFieldValue("orderId", orderId);
    formik.setFieldValue("rating", existingFeedback?.rating || 0);
    formik.setFieldValue("comment", existingFeedback?.comment || "");
  };

  const renderStars = (rating) => (
    <div className="text-yellow-400 text-xl">
      {"★".repeat(rating)}
      <span className={`text-gray-${rating ? 300 : 200}`}>
        {"★".repeat(5 - rating)}
      </span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-200 pb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Customer Reviews
            </h2>
            <p className="text-gray-600 text-sm">
              Share your thoughts about this product
            </p>
          </div>
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
            <div className="flex items-center mr-3">
              {renderStars(Math.floor(averageRating))}
            </div>
            <span className="text-sm text-gray-500">Total rating</span>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-8 bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-sm">
          {nonFeedbackOrders?.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <label className="text-gray-800 font-semibold block mb-3">
                {t("Select Order")}
              </label>
              <Select
                className="w-full"
                placeholder={t("Select an order to review")}
                onChange={handleOrderSelect}
                value={formik.values.orderId}
                size="large"
                style={{ borderRadius: "0.75rem" }}
              >
                {nonFeedbackOrders.map((order) => (
                  <Select.Option key={order.id} value={order.id}>
                    <div className="flex items-center justify-between">
                      <span>{`Order ${order.id} - ${formatDate(order.createdAt)}`}</span>
                      {isNewOrder(order.createdAt) && (
                        <Tag color="success" className="ml-2 rounded-full px-3">
                          New
                        </Tag>
                      )}
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}

          {selectedFeedback ? (
            <>
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <label className="text-gray-800 font-semibold block mb-3">
                    {t("Your feedback")}
                  </label>
                  <p className="text-gray-600 italic">{selectedFeedback.comment}</p>
                  <div className="flex items-center mt-4">
                    <span className="text-gray-700 font-medium mr-3">
                      {t("Previous Rating")}:
                    </span>
                    {renderStars(selectedFeedback.rating)}
                  </div>
                </div>
              </div>
              <FeedbackForm
                title="Update Your Comment"
                formik={formik}
                mutation={updateMutation}
                isUpdate={true}
                id={selectedFeedback.id}
              />
            </>
          ) : (
            <FeedbackForm
              title="Your Comment"
              formik={formik}
              mutation={mutation}
            />
          )}
        </form>

        <div className="mt-12 space-y-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Previous Reviews
          </h3>

          {feedbacks?.map((fb, index) => (
            <div
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              key={index}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {fb?.user?.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {fb?.user?.username}
                    </h4>
                    <p className="text-sm text-gray-500">{formatDate(fb?.createdAt)}</p>
                  </div>
                </div>
                {renderStars(fb?.rating)}
              </div>
              <p className="text-gray-600 leading-relaxed">{fb?.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ProductFeedback.propTypes = {
  prdId: PropTypes.string.isRequired,
  averageRating: PropTypes.number.isRequired,
};

export default ProductFeedback;
