// mysql CRUD
var operater = module.exports;
var log = require('../common').log;
var mysqlClient = require('../routes/mysql/mysqlclient').init();
var common = require("../common.js");


operater.addShield = function(uid,sid,cb){
    sql = "insert shield_table (uid,sid) value('" + uid + "','" +sid+"')";
    console.log(sql);
    mysqlClient.insert(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};


operater.delShield = function(uid,sid,cb){
    var sql = "delete from shield_table where uid="+uid+" and sid="+sid;
    console.log(sql);
    mysqlClient.insert(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};


operater.getShieldList = function(uid,cb){
    var sql = "select * from shield_table where uid="+uid;
    console.log(sql);
    mysqlClient.query(sql,null, function (err,res) {
        cb(err,res);
    });
};

operater.getShieldById = function(uid,sid,cb){
    var sql = "select * from shield_table where uid="+uid+" and sid = "+sid;
    console.log(sql);
    mysqlClient.query(sql,null, function (err,res) {
        cb(err,res);
    });
};

