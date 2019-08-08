import {
  ORDER_LIST_FETCH_START,
  ORDER_DETAIL_FETCH_START,
  ORDER_LIST_FETCH_FAIL,
  ORDER_DETAIL_FETCH_FAIL,
  ORDER_LIST_FETCH_SUCCESS
} from "../action/types";

const initialState = {
  isFetching: false,
  err: null,
  orders: []
};

const order = (state = initialState, action) => {
  switch (action.type) {
    case ORDER_LIST_FETCH_START:
      return {
        ...state,
        isFetching: true
      };
    case ORDER_DETAIL_FETCH_START:
      return {
        ...state,
        isFetching: true
      };
    case ORDER_LIST_FETCH_FAIL:
      return {
        ...state,
        isFetching: false,
        err: action.error
      };
    case ORDER_DETAIL_FETCH_FAIL:
      return {
        ...state,
        isFetching: false,
        err: action.error
      };
    case ORDER_LIST_FETCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        orders: action.data
      };
    default:
      return state;
  }
};

export default order;
