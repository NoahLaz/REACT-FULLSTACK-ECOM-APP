import { createSlice } from "@reduxjs/toolkit";

const productRedux = createSlice({
  name: "product",
  initialState: {
    products: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    productStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
    productFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },

    // GET PRODUCTS
    getProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products = action.payload;
    },

    // DELETE PRODUCTS
    deleteProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products.splice(
        state.products.findIndex((item) => item._id === action.payload),
        1
      );
    },

    // UPDATE PRODUCTS
    updateProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products[
        state.products.findIndex((item) => item._id === action.payload._id)
      ] = action.payload;
    },

    // ADD PRODUCTS
    addProductSuccess: (state, action) => {
      console.log(action.payload);
      state.isFetching = false;
      state.products.push(action.payload);
    },
  },
});

export const {
  productFailure,
  productStart,
  getProductSuccess,
  deleteProductSuccess,
  updateProductSuccess,
  addProductSuccess,
} = productRedux.actions;

export default productRedux.reducer;
