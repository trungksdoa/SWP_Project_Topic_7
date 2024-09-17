import { combineReducers } from "redux";
import { manageUserReducer } from "./manageUser/slice";


export const rootReducer = combineReducers({
    manageUser: manageUserReducer
})