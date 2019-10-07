import { combineReducers } from "redux";

import orderReducer from "./orderReducer";
import authReducer from "./authReducer";

export default combineReducers({
  order: orderReducer,
  auth: authReducer
});
