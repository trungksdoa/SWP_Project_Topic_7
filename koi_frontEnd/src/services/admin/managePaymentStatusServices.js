import { MANAGE_PAYMENT_STATUS_API } from "../../constant/api";
import { apiInstanceHeader } from "../../constant/apiInstanceHeader";

const api = apiInstanceHeader.create({
    baseURL: MANAGE_PAYMENT_STATUS_API
})

export const managePaymentStatusServices = {
    getAllStatus: () => api.get('')
}