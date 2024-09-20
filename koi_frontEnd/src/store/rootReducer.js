import { combineReducers } from "redux";
import { manageUserReducer } from "./manageUser/slice";
import { manageCartReducer } from "./manageCart/slice";
import { manageProductReducer } from "./manageProduct/slice";


export const rootReducer = combineReducers({
    manageUser: manageUserReducer,
    manageCart: manageCartReducer,
    manageProduct: manageProductReducer
})