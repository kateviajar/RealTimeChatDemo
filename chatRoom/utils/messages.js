// 2-import the moment module for formatting the time
const moment = require('moment');

// 1-create a function to format a message
function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a') // use moment to format time (hour:minutes AM/PM)
  };
}

module.exports = formatMessage;
