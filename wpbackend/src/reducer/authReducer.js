import { AUTH_START, AUTH_FAIL, AUTH_SUCCESS } from "../action/types";

const initialState = {
  isFetching: false,
  err: null,
  passAuth: false,
  currentUser: null
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        isFetching: true,
        passAuth: false,
        currentUser: null
      };

    case AUTH_FAIL:
      return {
        ...state,
        isFetching: false,
        err: action.error
      };

    case AUTH_SUCCESS:
      console.log("AUTH_SUCCESS - ", action.data);
      return {
        ...state,
        isFetching: false,
        passAuth: true,
        currentUser: action.data
      };

    default:
      return state;
  }
};

export default auth;
