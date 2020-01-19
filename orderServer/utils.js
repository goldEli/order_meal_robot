const moment = require("moment")
require("twix")
const fetch = require("node-fetch");
const config = require("./configForServer")

const md = {}

md.isOrdertime = function (startTime, endTime) {
  const s = `${moment().format("MM-DD-YYYY")} ${startTime}`
  const e = `${moment().format("MM-DD-YYYY")} ${endTime}`

  var t = moment(s).twix(e);
  console.log("isCurrent: ", t.isCurrent(), s, e)
  return t.isCurrent()
}

md.timeEqual = function (time) {
  return moment().format("HH:mm") === time
}

md.sleep = function(interval) {
  return new Promise((reslove, reject) => {
    setTimeout(reslove, interval)
  })
}

md.responseData = function ({type, data, msg}) {
  switch(type) {
    case "error":
      return {
        status: 0,
        msg: msg || "error",
        data: data || ""
      }
    case "success":  
    return {
      status: 1,
      msg: msg || "success",
      data: data || ""
    }
    default:
      return null
  }
}

// Example POST method implementation:
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json"
      // 'Authorization': `key=${token}`,
    },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

md.sendMsgToWechat= function (content) {
  postData(
    `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${config.token}`,
    {
      msgtype: "text",
      text: {
        content
      },
      mentioned_list: ["@all"]
    }
  ).then(data => {
    console.log(data); // JSON data parsed by `response.json()` call
  });
}

module.exports = md