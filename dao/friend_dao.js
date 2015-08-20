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
        sql = "insert friends_table (name,user_id,sex,birthday,head_img) value(?,?,?,?,?)";
        console.log(sql);
        mysqlClient.insert(sql, [name,user_id,sex,birthday,head_img], function (err) {
            if (cb) {
                cb.call(err);
            }
        });
    });
};

operater.editFriend = function(id,name,sex,birthday,head_img,cb){
    var value=[name,sex,birthday,head_img,id];
    var sql = "update friends_table set name=?,sex=?,birthday=?,head_img=? where id=?";
    if(head_img==""){
        value=[name,sex,birthday,id];
        sql = "update friends_table set name=?,sex=?,birthday=? where id=?";
    }
    console.log(sql);
    mysqlClient.update(sql, value, function (err,res) {
        if (cb) {
            cb.call(err);
        }
    });
};


operater.delFriend = function(fid,cb){
    var sql = "delete from friends_table where id=?";
    console.log(sql);

    mysqlClient.insert(sql, [fid], function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.delFriends = function(uid,fid,cb){
    var sql = "delete from talk_friend_table where (uid=? and fid=?) or (uid=? and fid=?)";
    console.log(sql);

    mysqlClient.insert(sql, [uid,fid,fid,uid], function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.getFriendList = function(uid,index,cb){
    var sql = "select * from friends_table where user_id=? order by id asc limit 0,?";
    console.log(sql);
    mysqlClient.query(sql,[uid,index], function (err,res) {
        cb(err,res);
    });
};

operater.getFriendById = function(fid,cb){
    var sql = "select * from friends_table where fid=?";
    console.log(sql);
    mysqlClient.query(sql,[fid], function (err,res) {
        cb(err,res);
    });
};

operater.getContractByUid = function(uid,fid,status,cb){
    var sql = "select * from contracts_table where uid=? and contracts_uid =? and status=?";
    console.log(sql);
    mysqlClient.query(sql,[uid,fid,status], function (err,res) {
        cb(err,res);
    });
};

operater.getCountByUid = function(uid,cb){
    var sql = "select count(*) count from contracts_table where contracts_uid=?";
    console.log(sql);
    mysqlClient.query(sql,[uid], function (err,res) {
        cb(err,res);
    });
};

operater.getFriendByUid = function(uid,fid,cb){
    var sql = "select count(*) count from talk_friend_table where uid=? and fid=?";
    console.log(sql);
    mysqlClient.query(sql,[uid,fid], function (err,res) {
        cb(err,res);
    });
};
operater.getGuanzhuByUid = function(uid,fid,cb){
    var sql = "select count(*) count from contracts_table where uid=? and contracts_uid=?";
    console.log(sql);
    mysqlClient.query(sql,[uid,fid], function (err,res) {
        cb(err,res);
    });
};