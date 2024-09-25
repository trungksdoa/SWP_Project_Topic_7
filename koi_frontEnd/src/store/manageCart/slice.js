import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { manageCartService } from "../../services/manageCartServices";

const initialState = {
    cartCount: 0,
    cart: []
}

export const { reducer: manageCartReducer, actions: manageCartActions } = createSlice({
    name: "manageCart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            state.cart.push(action.payload)
        },
        setCartCount: (state, action) => {
            console.log(action.payload)
            state.cartCount = action.payload
        },
        updateCartQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const existingProduct = state.cart.find(item => item.id === productId);
            if (existingProduct) {
                existingProduct.quantity = quantity; // Update quantity
            }
        }
    },

});

