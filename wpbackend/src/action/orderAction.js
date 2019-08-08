import axios from "axios";
import {
  urlHeader,
  ORDER_LIST_FETCH_START,
  //   ORDER_DETAIL_FETCH_START,
  ORDER_LIST_FETCH_FAIL,
  //   ORDER_DETAIL_FETCH_FAIL,
  ORDER_LIST_FETCH_SUCCESS
} from "./types";

const requestStart = source => {
  return {
    type: ORDER_LIST_FETCH_START,
    source
  };
};
const requestFail = (error, source) => {
  return {
    type: ORDER_LIST_FETCH_FAIL,
    error,
    source
  };
};
const requestSuccess = (res, source) => {
  return {
    type: ORDER_LIST_FETCH_SUCCESS,
    data: res.data,
    source
  };
};

export const getOrderList = e => {
  return dispatch => {
    dispatch(requestStart(ORDER_LIST_FETCH_START));
    axios
      .get(urlHeader + "api/orders")
      .then(res => {
        dispatch(requestSuccess(res, ORDER_LIST_FETCH_SUCCESS));
      })
      .catch(err => {
        dispatch(requestFail(err, ORDER_LIST_FETCH_FAIL));
      });
  };
};
