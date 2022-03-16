import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import { publicRequest, userRequest } from "../requestMethods";
import {
  productStart,
  productFailure,
  getProductSuccess,
  deleteProductSuccess,
  updateProductSuccess,
  addProductSuccess,
} from "./productRedux";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res.data));
  } catch (error) {
    dispatch(loginFailure());
  }
};

export const getProducts = async (dispatch) => {
  dispatch(productStart());
  try {
    const res = await publicRequest.get("/products/find");
    dispatch(getProductSuccess(res.data));
  } catch (error) {
    dispatch(productFailure());
  }
};

export const deleteProduct = async (dispatch, id) => {
  dispatch(productStart());
  try {
    await userRequest.delete(`/products/delete/${id}`);
    dispatch(deleteProductSuccess(id));
  } catch (error) {
    dispatch(productFailure());
  }
};

export const updateProduct = async (dispatch, product, id) => {
  dispatch(productStart());
  try {
    const res = await userRequest.put(`/products/update/${id}`, product);
    console.log(res.data);
    dispatch(updateProductSuccess(res.data));
  } catch (error) {
    dispatch(productFailure());
  }
};

export const addProduct = async (product, dispatch) => {
  dispatch(productStart());
  try {
    const res = await userRequest.post(`/products/create`, product);
    dispatch(addProductSuccess(res.data));
  } catch (error) {
    console.log(error);
    dispatch(productFailure());
  }
};
