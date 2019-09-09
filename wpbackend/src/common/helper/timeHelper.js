import moment from "moment";

export const TimeHelper = {
  FormatTimeStamp: function(timestamp, format) {
    return moment(timestamp).format(format);
  }
};

export default TimeHelper;
