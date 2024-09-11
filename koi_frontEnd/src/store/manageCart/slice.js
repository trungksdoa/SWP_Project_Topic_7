import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: []
}

const manageCartSlice = createSlice({
    name: "manageCart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.cart.push(action.payload)
        }
    }
})

export const { addToCart } = manageCartSlice.actions

export const manageCartReducer = manageCartSlice.reducer