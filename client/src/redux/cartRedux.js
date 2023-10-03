import {createSlice} from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        products: [],
        total: 0
    },
    reducers: {
        addProductToCart:(state, action) => {
            const _id = state.products.length;
            state.products.push({_id, ...action.payload});
            state.total += action.payload.price.unit_amount;
        },
        removeProductFromCart:(state, action) => {
            const index = state.products.findIndex(item => item._id === action.payload);
            state.total = state.total - (state.products[index].price.unit_amount * state.products[index].quantity);
            state.products = state.products.filter(item => item._id !== action.payload);
        },
        changeProductQuantity:(state, action) => {
            const index = state.products.findIndex(item => item._id === action.payload.id);
            const baseTotal = state.total - (state.products[index].quantity * state.products[index].price.unit_amount)
            state.products[index].quantity = action.payload.quantity;
            state.total = baseTotal + (action.payload.quantity * state.products[index].price.unit_amount);
        },
        changeProductSize:(state, action) => {
            const index = state.products.findIndex(item => item._id === action.payload.id);
            state.products[index].size = action.payload.size;
        }
    },
});

export const {addProductToCart, removeProductFromCart, changeProductQuantity, changeProductSize} = cartSlice.actions;
export default cartSlice.reducer;