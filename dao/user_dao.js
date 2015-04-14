// mysql CRUD
var operater = module.exports;
var log = require('../common').log;
var mysqlClient = require('../routes/mysql/mysqlclient').init();
var common = require("../common.js");


operater.getUserDetailById = function(user_id,cb){
    var values = [user_id];
    var sql = "select u.name,u.bless,d.* from user_table u left join user_detail_table d on u.user_id=d.user_id where u.user_id=? ";
    console.log(sql);
    mysqlClient.query(sql, values, function (err,res) {
        cb(err,res);
    });
};