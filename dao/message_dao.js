// mysql CRUD
var operater = module.exports;
var log = require('../common').log;
var mysqlClient = require('../routes/mysql/mysqlclient').init();
var common = require("../common.js");


operater.getMessageById = function(user_id,cb){
    var values = [user_id];
    var sql = "select * from message_table where receive_userid=? order by create_time desc ";
    console.log(sql);
    mysqlClient.query(sql, values, function (err,res) {
        cb(err,res);
    });
};