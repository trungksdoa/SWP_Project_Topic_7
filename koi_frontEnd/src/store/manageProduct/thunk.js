import { createAsyncThunk, } from "@reduxjs/toolkit";
import { manageProductsServices } from "../../services/manageProducrsServices";

export const getProductThunk = createAsyncThunk('manageProduct/get', async (id, {rejectWithValue}) => {
    try {
        const response = await manageProductsServices.getProductById(id)
        return response.data?.data?.data
    }
    catch(err) {
        return rejectWithValue(err)
    }
})