// mysql CRUD
var operater = module.exports;
var log = require('../common').log;
var mysqlClient = require('../routes/mysql/mysqlclient').init();
var common = require("../common.js");


operater.addFriend = function(name,user_id,sex,birthday,cb){
    var sql = "insert friends_table (name,user_id,sex,birthday) value('" + name + "','" + user_id + "','"+sex+"','"+birthday+"')";
    console.log(sql);
    mysqlClient.insert(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};


operater.delFriend = function(fid,cb){
    var sql = "delete from friends_table where id="+fid;
    console.log(sql);

    mysqlClient.insert(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};


operater.getFriendList = function(uid,index,cb){
    var sql = "select * from friends_table where user_id="+uid+" order by id asc limit 0,"+index;
    console.log(sql);
    mysqlClient.query(sql,null, function (err,res) {
        cb(err,res);
    });
};

operater.getFriendById = function(fid,cb){
    var sql = "select * from friends_table where fid="+fid;
    console.log(sql);
    mysqlClient.query(sql,null, function (err,res) {
        cb(err,res);
    });
};