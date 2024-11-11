import { createSlice } from "@reduxjs/toolkit"
import { manageProductThunks } from "."

const initialState = {
    isFetchingProductById: false,
    product: [],
    searchResult: [],
    searchName: []
}

export const { reducer: manageProductReducer, actions: manageProductAction} = createSlice({
    name: 'manageProduct',
    initialState,
    reducers: {
        setSearchResult: (state, action) => {
            state.searchResult = action.payload;
        },
        setSearchName: (state, action) => {
            state.searchName = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(manageProductThunks.getProductThunk.pending, (state) => {
            state.isFetchingProductById = true
        })
        .addCase(manageProductThunks.getProductThunk.fulfilled, (state) => {
            state.isFetchingLogin = true
        })
        .addCase(manageProductThunks.getProductThunk.rejected, (state) => {
            state.isFetchingLogin = true
        })
    }
})