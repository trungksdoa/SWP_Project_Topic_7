import { LOCAL_STORAGE_LOGIN_KEY } from "../constant/localStorage"

export const getUserLogin = () => {
    const userLogin = localStorage.getItem(LOCAL_STORAGE_LOGIN_KEY)
    if(!userLogin) return
    return JSON.parse(userLogin)
}