var mysql = require("mysql");
var config = require("./configForServer")
var pool = mysql.createPool(config.dbInfo);

var handleMysql=function(sql,options,callback){  
  pool.getConnection(function(err,conn){  
      if(err){  
          callback(err,null,null);  
      }else{  
          conn.query(sql,options,function(err,results,fields){  
              //释放连接  
              conn.release();  
              //事件驱动回调  
              callback(err,results,fields);  
          });  
      }  
  });  
}; 

function query(sql, params) {
  return new Promise((resolve, reject) => {
    handleMysql(sql, params, function(err,results,fields){  
      if (err) {
        console.error(err)
      } else {
        resolve(results)
      }
      
    });
  })
}

module.exports = query;
