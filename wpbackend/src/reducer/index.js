import { combineReducers } from "redux";

import orderReducer from "./orderReducer";
import authReducer from "./authReducer";
import fileReducer from "./fileReducer";

export default combineReducers({
  order: orderReducer,
  auth: authReducer,
  file: fileReducer
});
