import { MANAGE_IMAGES_API } from "../constant/api";
import { apiInstance } from "../constant/apiInstance";
const api = apiInstance.create({
    baseURL: MANAGE_IMAGES_API
})

export const manageImagesServices = {

    getImageProduct: (payload) => {
        return api.get(`/${payload}`)
    },
}

//https://koi-controls-e5hxekcpd0cmgjg2.eastasia-01.azurewebsites.net/api/image/1726246172190_Design1.png
//https://koi-controls-e5hxekcpd0cmgjg2.eastasia-01.azurewebsites.net/api/image/1726246172190_Design1.png