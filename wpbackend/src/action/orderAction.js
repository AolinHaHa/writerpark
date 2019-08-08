import axios from "axios";
import {
  urlHeader,
  ORDER_LIST_FETCH_START,
  ORDER_DETAIL_FETCH_START,
  ORDER_LIST_FETCH_FAIL,
  ORDER_DETAIL_FETCH_FAIL,
  ORDER_LIST_FETCH_SUCCESS,
  ORDER_DETAIL_FETCH_SUCCESS
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
  console.log("getOrderList - e -", e);
  let options = { limit: 5 }; //20 per page
  options.page = (e && e.page) || 1;
  console.log("getOrderList - sending -", options);
  return dispatch => {
    dispatch(requestStart(ORDER_LIST_FETCH_START));
    axios
      .get(urlHeader + "api/orders", {
        params: {
          options
        }
      })
      .then(res => {
        console.log("success", res);
        dispatch(requestSuccess(res, ORDER_LIST_FETCH_SUCCESS));
      })
      .catch(err => {
        console.log("err", err);
        dispatch(requestFail(err, ORDER_LIST_FETCH_FAIL));
      });
  };
};

export const getOrderDetail = e => {
  console.log("getOrderDetail - e -", e);

  // let options = { limit: 5 }; //20 per page
  // options.page = (e && e.page) || 1;
  // console.log("getOrderDetail - sending -", options);
  return dispatch => {
    dispatch(requestStart(ORDER_DETAIL_FETCH_START));
    axios
      .get(urlHeader + "api/orders/" + e)
      .then(res => {
        console.log("success", res);
        dispatch(requestSuccess(res, ORDER_DETAIL_FETCH_SUCCESS));
      })
      .catch(err => {
        console.log("err", err);
        dispatch(requestFail(err, ORDER_DETAIL_FETCH_FAIL));
      });
  };
};
