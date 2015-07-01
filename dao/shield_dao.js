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

operater.getShieldConList = function(uid,cb){
    var sql = "select u.* from user_table u left join contracts_table c on c.uid=u.user_id left join talk_friend_table f on f.fid=u.user_id left join shield_table s on s.sid=u.user_id " +
        "where c.contracts_uid= "+uid+" or f.uid="+uid+" or s.uid="+uid+" group by u.user_id";
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

