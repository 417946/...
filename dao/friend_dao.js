// mysql CRUD
var operater = module.exports;
var log = require('../common').log;
var mysqlClient = require('../routes/mysql/mysqlclient').init();
var common = require("../common.js");


operater.addFriend = function(name,user_id,sex,birthday,head_img,cb){
    var sql = "select * from friends_table where user_id="+user_id;
    console.log(sql);
    mysqlClient.query(sql, null, function (err,res) {
        var friendname = [];
        var friendbd = [];
        for(var i = 0; i < res.length; ++i){
            friendname.push(res[i]["name"]);
            friendbd.push(res[i]["birthday"]);
        }
        if(friendname.length >= 4){
            cb("只能关注最重要的4名亲友，如要添加，请先移除之前的亲友!");
            return;
        }
        //  add already ?
        var find = false;
        for(i = 0; i < friendname.length; ++i){
            if(name == friendname[i]&&birthday==friendbd[i]){
                find = true;
            }
        }
        if(find){
            cb("请勿重复添加!")
            return;
        }
        sql = "insert friends_table (name,user_id,sex,birthday,head_img) value('" + name + "','" + user_id + "','"+sex+"','"+birthday+"','"+head_img+"')";
        console.log(sql);
        mysqlClient.insert(sql, null, function (err) {
            if (cb) {
                cb.call(err);
            }
        });
    });
};

operater.editFriend = function(id,name,sex,birthday,head_img,cb){
    var sql = "update friends_table set name='"+name+"',sex="+sex+",birthday='"+birthday+"',head_img='"+head_img+"' where id="+id;
    if(head_img==""){
        sql = "update friends_table set name='"+name+"',sex="+sex+",birthday='"+birthday+"' where id="+id;
    }
    console.log(sql);
    mysqlClient.update(sql, null, function (err,res) {
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

operater.getContractByUid = function(uid,fid,cb){
    var sql = "select * from contracts_table where uid="+uid+" and contracts_uid = "+fid;
    console.log(sql);
    mysqlClient.query(sql,null, function (err,res) {
        cb(err,res);
    });
};