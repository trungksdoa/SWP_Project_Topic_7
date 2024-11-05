import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StarRating } from "./StarRating";
import { Button } from "antd";
import PropTypes from "prop-types";

// Create reusable components
const FeedbackForm = ({ title, formik, isUpdate = false, mutation, id }) => {
  const { t } = useTranslation();

  useEffect(() => {
    formik.setFieldValue("rating", formik.values.rating);
    formik.setFieldValue("comment", formik.values.comment);
    formik.setFieldValue("isUpdate", isUpdate);
    formik.setFieldValue("id", id);
  }, [isUpdate]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <div>
        <label className="text-gray-800 font-semibold block mb-3">
          {t(title)}
        </label>
        <textarea
          onChange={formik.handleChange}
          className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          placeholder={t(
            isUpdate ? "Update your experience..." : "Share your experience..."
          )}
          name="comment"
          rows="5"
          value={formik.values.comment}
        />
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <span className="text-gray-800 font-semibold block mb-3">
          {t(isUpdate ? "Update Rating" : "Rating")}
        </span>
        <StarRating
          value={formik.values.rating}
          onChange={(value) => formik.setFieldValue("rating", value)}
        />
      </div>

      <Button
        htmlType="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 w-full"
        loading={mutation.isPending}
      >
        {t(isUpdate ? "Update Review" : "Submit Review")}
      </Button>
    </div>
  );
};

FeedbackForm.propTypes = {
  title: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  isUpdate: PropTypes.bool,
  mutation: PropTypes.object.isRequired,
  id: PropTypes.number,
};

export default FeedbackForm;
