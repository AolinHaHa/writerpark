import axios from "axios";
import {
  urlHeader,
  FILE_FETCH_START,
  FILE_FETCH_FAIL,
  FILE_FETCH_SUCCESS
} from "./types";

const requestStart = source => {
  return {
    type: FILE_FETCH_START,
    source
  };
};
const requestFail = (error, source) => {
  return {
    type: FILE_FETCH_FAIL,
    error,
    source
  };
};
const requestSuccess = (res, source) => {
  return {
    type: FILE_FETCH_SUCCESS,
    data: res.data,
    source
  };
};

export const getOrderFiles = order_id => {
  console.log("getOrderFiles - order_id -", order_id);

  return dispatch => {
    dispatch(requestStart(FILE_FETCH_START));
    axios
      .get(urlHeader + "api/files/" + order_id)
      .then(res => {
        console.log("success", res);
        dispatch(requestSuccess(res, FILE_FETCH_SUCCESS));
      })
      .catch(err => {
        console.log("err", err);
        dispatch(requestFail(err, FILE_FETCH_FAIL));
      });
  };
};

export const newFile = file => {
  console.log("newFile - file -", file);
  // return dispatch => {
  //   axios
  //     .post(urlHeader + "api/newfile/", file)
  //     .then(res => {
  //       console.log("newFile - success", res);
  //       // dispatch(requestSuccess(res, ORDER_DETAIL_FETCH_SUCCESS));
  //       alert(file.fileName + " upload success");
  //     })
  //     .catch(err => {
  //       console.log("err", err);
  //       alert("upload error");
  //       // dispatch(requestFail(err, ORDER_DETAIL_FETCH_FAIL));
  //     });
  // };
  return dispatch => {};
};

// export const newFile = file => {
//   //   console.log("newFile - file -", file);
//   return dispatch => {
//     axios
//       .post(urlHeader + "api/newfile/", file)
//       .then(res => {
//         console.log("newFile - success", res);
//         // dispatch(requestSuccess(res, ORDER_DETAIL_FETCH_SUCCESS));
//         alert(file.fileName + " upload success");
//       })
//       .catch(err => {
//         console.log("err", err);
//         alert("upload error");
//         // dispatch(requestFail(err, ORDER_DETAIL_FETCH_FAIL));
//       });
//   };
// };
