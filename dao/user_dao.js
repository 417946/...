// mysql CRUD
var operater = module.exports;
var log = require('../common').log;
var mysqlClient = require('../routes/mysql/mysqlclient').init();
var common = require("../common.js");


operater.getUserDetailById = function(user_id,cb){
    var values = [user_id];
    var sql = "select u.user_id uid,u.name,u.bless,u.sex,u.birthday,u.lotus,d.* from user_table u left join user_detail_table d on u.user_id=d.user_id where u.user_id=? ";
    console.log(sql);
    mysqlClient.query(sql, values, function (err,res) {
        cb(err,res);
    });
};

operater.getTipMusic = function(user_id,cb){
    var values = [user_id];
    var sql = "select tip_music from user_detail_table where user_id=? ";
    console.log(sql);
    mysqlClient.query(sql, values, function (err,res) {
        cb(err,res);
    });
};

operater.updateTipMusic = function(uid,tip_music,cb){
    var sql = "update user_detail_table set tip_music="+tip_music+" where user_id="+uid;
    console.log(sql);
    mysqlClient.update(sql, null, function (err,res) {
        cb(err);
    });
};

operater.updateFlower = function(uid,flower_num,cb){
    var sel_sql="select lotus from user_table where user_id="+uid;
    mysqlClient.query(sel_sql, null, function (err,res1) {
        if(parseInt(res1[0].lotus)+parseInt(flower_num)>=0){
            var sql = "update user_table set lotus=lotus+"+flower_num+" where user_id="+uid;
            console.log(sql);
            mysqlClient.update(sql, null, function (err,res) {
                cb(err);
            });
        }else{
            cb({code:"not enough"});
        }
    });
};