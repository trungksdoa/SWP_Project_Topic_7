import { MANAGE_KOI_API } from "../../constant/api";
import {apiInstanceHeader} from "../../constant/apiInstanceHeader.js";
const api = apiInstanceHeader.create({
    baseURL: MANAGE_KOI_API
})

export const manageKoiFishServices = {
    getAllKoi: () => api.get("/listkoi")
}