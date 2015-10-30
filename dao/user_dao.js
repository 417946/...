// mysql CRUD
var operater = module.exports;
var log = require('../common').log;
var mysqlClient = require('../routes/mysql/mysqlclient').init();
var common = require("../common.js");
var crypto = require('crypto');


operater.getUserDetailById = function(user_id,date,cb){
    var values = [date,user_id];
    var sql = "select u.user_id uid,u.name,u.bless,u.sex,u.birthday,u.lotus,u.colour,u.colour_index,d.*,sum(b.bless) tazhu,f.detail " +
        "from user_table u left join user_detail_table d on u.user_id=d.user_id " +
        "left join bless_table b on u.user_id=b.target_uid " +
        "left join free_flower_table f on u.user_id=f.uid and f.date=? and f.type='color' " +
        "where u.user_id=? ";
    console.log(sql);
    mysqlClient.query(sql, values, function (err,res) {
        cb(err,res);
    });
};

operater.getAllUser = function(cb){
    var sql = "select * from user_table where flystar is not null and birthday!='' ";
    mysqlClient.query(sql, null, function (err,res) {
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

operater.getHeadImg = function(user_id,date,cb){
    var values = [date,user_id];
    var sql = "select d.head_img,d.head_url,u.colour,u.colour_index,u.name,u.sex,f.detail from user_detail_table d left join user_table u on d.user_id=u.user_id" +
        " left join free_flower_table f on u.user_id=f.uid and f.date=? and f.type='color' where d.user_id=? ";
    console.log(sql);
    mysqlClient.query(sql, values, function (err,res) {
        cb(err,res);
    });
};

operater.updateHeadImg = function(uid,head_img,head_url,cb){
    var sql = "update user_detail_table set head_img=?,head_url=? where user_id=?";
    console.log(sql);
    mysqlClient.update(sql, [head_img,head_url,uid], function (err,res) {
        cb(err);
    });
};

operater.updateTipMusic = function(uid,tip_music,cb){
    var sql = "update user_detail_table set tip_music=? where user_id=?";
    console.log(sql);
    mysqlClient.update(sql, [tip_music,uid], function (err,res) {
        cb(err);
    });
};

operater.updateColour = function(uid,colour,colour_index,cb){
    var sql = "update user_table set colour=?,colour_index=? where user_id=?";
    console.log(sql);
    mysqlClient.update(sql, [colour,colour_index,uid], function (err,res) {
        cb(err);
    });
};

operater.updateFlower = function(uid,flower_num,cb){
    var sel_sql="select lotus from user_table where user_id=?";
    mysqlClient.query(sel_sql, [uid], function (err,res1) {
        console.log(res1);
        if(parseInt(res1[0].lotus)+parseInt(flower_num)>=0){
            var sql = "update user_table set lotus=lotus+? where user_id=?";
            console.log(sql);
            mysqlClient.update(sql, [flower_num,uid], function (err,res) {
                cb(err);
            });
        }else{
            cb({code:"not enough"});
        }
    });
};

operater.updatePwd = function(uid,pwd,cb){
    var  md5 = crypto.createHash('md5');
    var newPasswd = md5.update(pwd).digest('base64');
    var sql = "update user_table set passwd=? where user_id=?";
    console.log(sql);
    mysqlClient.update(sql, [newPasswd,uid], function (err,res) {
        cb(err);
    });
};

operater.getUserByMail = function(uid,email,cb){
    var sql = "select * from user_table where user_id=? and email=? ";
    console.log(sql);
    mysqlClient.query(sql,[uid,email], function (err,res) {
        cb(err,res);
    });
};

operater.getUserByPwd = function(uid,pwd,cb){
    var  md5 = crypto.createHash('md5');
    var newPasswd = md5.update(pwd).digest('base64');
    var sql = "select * from user_table where user_id="+uid+" and passwd='"+newPasswd+"' ";
    console.log(sql);
    mysqlClient.query(sql,null, function (err,res) {
        cb(err,res);
    });
};

operater.getDaren = function(cb){
    var sql = "select u.user_id,u.name,d.head_img,d.head_url from user_table u left join user_detail_table d on u.user_id=d.user_id where d.identification=1 order by u.lotus desc ";
    console.log(sql);
    mysqlClient.query(sql, null, function (err,res) {
        cb(err,res);
    });
};

operater.reg = function(uid,uname,pwd,cb){
    var  md5 = crypto.createHash('md5');
    var newPasswd = md5.update(pwd).digest('base64');
    sql = "insert user_table (user_id,name,passwd,birthday,sex) value(?,?,?,?,?)";
    console.log(sql);
    mysqlClient.insert(sql, [uid,uname,newPasswd,'','2'], function (err) {
        var sql1 = "insert into  user_detail_table(user_id) values ('"+uid+"')";
        mysqlClient.update(sql1, null, function (err1) {
            if(cb){
                cb.call(err1);
            }
        });
    });
};