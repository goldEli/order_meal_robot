const utils = require("./utils")
const config = require("./configForServer")


function sendOrderNoticeToWechat(endTime) {
  utils.sendMsgToWechat(`开始订午餐， ${endTime}截止。\n${config.serverAddress}`)
}

function sendStatsOrdersToWechat(orderList){
  utils.sendMsgToWechat(`订餐结束，${orderList.length} 人订餐。\n${orderList.map(item => item.name).join("，")}`)
}

module.exports = {sendOrderNoticeToWechat, sendStatsOrdersToWechat};





