import { createSlice } from "@reduxjs/toolkit";
import { manageUserActionThunks } from ".";
import { LOCAL_STORAGE_LOGIN_KEY } from "../../constant/localStorage";
import { getUserLogin } from "../../utils/getUserLogin";

const initialState = {
  isFetchingLogin: false,
  userLogin: getUserLogin(),
};

export const { reducer: manageUserReducer, actions: manageUserActions } =
  createSlice({
    name: 'manageUser',
    initialState,
    reducers: {
      updateUserLogin: (state, { payload }) => {
        state.userLogin = payload
      }
    },

    extraReducers: (builder) => {
        builder
        .addCase(manageUserActionThunks.loginThunk.pending, (state) => {
            state.isFetchingLogin = true
        })
        .addCase(manageUserActionThunks.loginThunk.fulfilled, (state, { payload }) => {
            state.isFetchingLogin = false
            localStorage.setItem(LOCAL_STORAGE_LOGIN_KEY, JSON.stringify(payload.data))
            state.userLogin = payload.data
        })
        .addCase(manageUserActionThunks.loginThunk.rejected, (state) => {
            state.isFetchingLogin = false
        })
        .addCase(manageUserActionThunks.registerThunk.pending, (state) => {
            state.isFetchingRegister = true
        })
        .addCase(manageUserActionThunks.registerThunk.fulfilled, (state, { payload }) => {
            state.isFetchingRegister = false
            state.userLogin = payload.data
        })
        .addCase(manageUserActionThunks.registerThunk.rejected, (state) => {
            state.isFetchingRegister = false
        })
    }
  });
