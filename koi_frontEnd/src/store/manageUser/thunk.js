import { createAsyncThunk } from "@reduxjs/toolkit";
import { manageUserServices } from "../../services/manageUserServices";

export const loginThunk = createAsyncThunk("manageUser/login", async (payload, {rejectWithValue}) => {
    try {
        const response = await manageUserServices.login(payload)
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const registerThunk = createAsyncThunk("manageUser/register", async (payload, {rejectWithValue}) => {
    try {
        const response = await manageUserServices.register(payload)
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const forgotPasswordThunk = createAsyncThunk("manageUser/forgot-password", async(payload, {rejectWithValue}) => {
    try {
        const response = await manageUserServices.forgotPassword(payload)
        return response.data
    }
    catch(err) {
        return rejectWithValue(err)
    }
})