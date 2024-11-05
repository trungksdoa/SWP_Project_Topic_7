import { MANAGE_FEEDBACK_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader";

const api = apiInstanceHeader.create({
  baseURL: MANAGE_FEEDBACK_API,
});

export const manageFeedbackService = {
  postFeedback: (payload) => api.post("", payload),
  getFeedbacById: (id) => api.get(`/product/${id}`),
  putFeedback: (payload) => api.put("", payload),
};
