/**
 * Created by zoey on 2015/5/24.
 */
var operater = module.exports;
var mysqlClient = require('../routes/mysql/mysqlclient').init();


operater.getFriendList = function(uid,cb){
    var sql = "select * from talk_friend_table where uid=?";
    mysqlClient.query(sql, [uid], function (err,res) {
        cb(err,res);
    });
};
operater.getHistory = function(uid1,uid2,cb){
    var sql = "SELECT * FROM talk_content_table WHERE (fromUid=? OR toUid=?) AND( fromUid=? OR toUid=?)";
    mysqlClient.query(sql, [uid1,uid1,uid2,uid2], function (err,res) {
        cb(err,res);
    });
};
operater.addFriend = function(uid,fid,fname,cb){
    sql = "insert talk_friend_table (uid,fid,fname) value(" + uid + "," + fid + ",'"+fname+"')";
    console.log(sql);
    mysqlClient.insert(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};
/*
operater.getHistory = function(uid1,uid2,cb){
    var sql = "SELECT * FROM talk_content_table WHERE (fromUid=? OR toUid=?) AND( fromUid=? OR toUid=?)";
    mysqlClient.query(sql, [uid1,uid1,uid2,uid2], function (err,res) {
        cb(err,res);
    });
};*/
