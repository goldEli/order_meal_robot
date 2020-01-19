const express = require('express')
const app = express()
const port = 8899
const query = require("./db")
const {sendOrderNoticeToWechat, sendStatsOrdersToWechat} = require("./robot")
const utils = require("./utils")

const startTime = "08:40"
const endTime = "09:20"
const resetTime = "01:00"

app.use(express.static('build'))
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile('build/index.html', {root: __dirname })
})

app.use(function(req, res, next) {
  if (!utils.isOrdertime(startTime, endTime)) {
    res.send(utils.responseData({type: "error", msg: "未到订餐时间！"}))  
    return
  }
  next();
});

app.post("/order", async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const {name} = req.body

  const findNameFormMiner = await query(sql.FIND_NAME_MINER, [name])

  if (findNameFormMiner.length === 0 ) {
    res.send(utils.responseData({type: "error", msg: "名单查无此人，请联系管理员！"}))  
    return
  } 

  const orderedName = await query(sql.FIND_NAME, [name])
  if (orderedName.length !== 0 ) {
    res.send(utils.responseData({type: "error", msg: "已订餐，请勿重复订餐！"}))  
    return
  } 
  await query(sql.INSERT_NAME, [name, ip])
  res.send(utils.responseData({type: "success", msg: "订餐成功！"}))  
})

app.post("/cancel", async (req, res) => {
  const {name} = req.body
  const data = await query(sql.FIND_NAME, [name])
  if (data.length === 0 ) {
    res.send(utils.responseData({type: "error", msg: "该名字无订餐记录！"}))  
    return
  } 
  await query(sql.DELETE_NAME, [name])
  res.send(utils.responseData({type: "success", msg: "取消成功！"}))  
})

app.post("/all", async (req, res) => {
  const data = await query(sql.QUERY_ALL)
  res.send(utils.responseData({type: "success", data}))  
})

app.post("/clearAll", async (req, res) => {
  await query(sql.DELETE_ALL)
  res.send(utils.responseData({type: "success"}))  
})

app.listen(port, () => console.log(`order app listening on port ${port}! 订餐时间：${startTime} - ${endTime}`))

const sql = {
  INSERT_NAME: `INSERT INTO order_list(name, ip_address) VALUES(?,?)`,
  DELETE_NAME: `DELETE FROM order_list WHERE name=?`,
  DELETE_ALL: `TRUNCATE TABLE order_list`,
  FIND_NAME: "select * from order_list where name=?",
  QUERY_ALL: "select * from order_list",
  FIND_NAME_MINER: "select * from miner where name=?"
}

async function main() {

  utils.timeEqual(startTime) && sendOrderNoticeToWechat(endTime)
  utils.timeEqual(endTime) && sendStatsOrdersToWechat(await query(sql.QUERY_ALL))
  utils.timeEqual(resetTime) && query(sql.DELETE_ALL)

  await utils.sleep(1000*60)

  main()
}

main()