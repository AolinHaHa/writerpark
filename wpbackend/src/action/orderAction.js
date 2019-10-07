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
    type: source,
    source
  };
};
const requestFail = (error, source) => {
  return {
    type: source,
    error,
    source
  };
};
const requestSuccess = (res, source) => {
  return {
    type: source,
    data: res.data,
    source
  };
};

export const getOrderList = e => {
  console.log("getOrderList - e -", e);
  let query = (e && e.query) || {};
  let options = {};
  options.page = (e && e.page) || 1;
  options.limit = (e && e.limit) || 5;
  options.sort = (e && e.sort) || "";

  console.log("getOrderList - sending -", options, query);
  return dispatch => {
    dispatch(requestStart(ORDER_LIST_FETCH_START));
    axios
      .get(urlHeader + "api/orders", {
        params: {
          options,
          query
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

export const createOrderNewLog = requestBody => {
  console.log("createOrderNewLog - requestBody -", requestBody);
  const requestID = requestBody._id;
  return dispatch => {
    axios
      .put(urlHeader + "api/orders/log/" + requestID, requestBody)
      .then(res => {
        console.log("createOrderNewLog - success - res", res, requestID);
        // getOrderDetail(requestID);
        // dispatch(requestSuccess(res, ORDER_DETAIL_FETCH_SUCCESS));
      })
      .catch(err => {
        console.log("err", err);
        // dispatch(requestFail(err, ORDER_DETAIL_FETCH_FAIL));
      });
  };
};

export const createOrderNewMsg = requestBody => {
  console.log("createOrderNewMsg - requestBody -", requestBody);
  const requestID = requestBody.order_id;
  return dispatch => {
    axios
      .put(urlHeader + "api/orders/msg/" + requestID, requestBody)
      .then(res => {
        console.log("success", res);
        getOrderDetail(requestID);
        // dispatch(requestSuccess(res, ORDER_DETAIL_FETCH_SUCCESS));
      })
      .catch(err => {
        console.log("err", err);
        // dispatch(requestFail(err, ORDER_DETAIL_FETCH_FAIL));
      });
  };
};

//TODO: UPDATE ORDER
export const updateOrder = order => {
  console.log("updateOrder - order -", order);
  // return dispatch => {
  //   dispatch(ORDER_UPDATE_START);
  //   axios.put(urlHeader + "api/orders/" )
  // }
};
