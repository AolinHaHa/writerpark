import axios from "axios";
import { urlHeader, AUTH_START, AUTH_FAIL, AUTH_SUCCESS } from "./types";
import CryptoJS from "crypto-js";

const requestStart = source => {
  return {
    type: AUTH_START,
    source
  };
};
const requestFail = (error, source) => {
  return {
    type: AUTH_FAIL,
    error,
    source
  };
};
const requestSuccess = (res, source) => {
  return {
    type: AUTH_SUCCESS,
    data: res.data,
    source
  };
};

export const login = e => {
  console.log("login - e -", e);
  var encryptedAccount = CryptoJS.AES.encrypt(e.account, "Secret Passphrase");
  var encryptedPassword = CryptoJS.AES.encrypt(e.password, "Secret Passphrase");
  const params = new URLSearchParams();
  params.append("account", encryptedAccount);
  params.append("password", encryptedPassword);
  //   console.log("login - encryptedAccount -", encryptedAccount);
  return dispatch => {
    dispatch(requestStart(AUTH_START));
    axios
      .post(urlHeader + "api/login", params)
      .then(res => {
        console.log("success", res);
        dispatch(requestSuccess(res, AUTH_SUCCESS));
      })
      .catch(err => {
        console.log("err", err);
        dispatch(requestFail(err, AUTH_FAIL));
      });
  };
};
