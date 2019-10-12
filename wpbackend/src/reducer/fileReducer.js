import {
  FILE_FETCH_START,
  FILE_FETCH_FAIL,
  FILE_FETCH_SUCCESS
} from "../action/types";

const initialState = {
  isFileFetching: false,
  err: null,
  currentOrderFiles: []
};

const file = (state = initialState, action) => {
  switch (action.type) {
    case FILE_FETCH_START:
      return {
        ...state,
        isFileFetching: true,
        currentOrderFiles: null
      };

    case FILE_FETCH_FAIL:
      return {
        ...state,
        isFileFetching: false,
        err: action.error
      };

    case FILE_FETCH_SUCCESS:
      console.log("FILE_FETCH_SUCCESS - ", action.data);
      return {
        ...state,
        isFileFetching: false,
        currentOrderFiles: action.data
      };

    default:
      return state;
  }
};

export default file;
