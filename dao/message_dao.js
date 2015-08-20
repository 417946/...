// mysql CRUD
var operater = module.exports;
var log = require('../common').log;
var mysqlClient = require('../routes/mysql/mysqlclient').init();
var common = require("../common.js");


operater.getMessageByUid = function(user_id,cb){
    var values = [user_id];
    var sql = "select * from message_table where receive_userid=? and status=1 and type!=7 and type!=8 order by create_time desc ";
    console.log(sql);
    mysqlClient.query(sql, values, function (err,res) {
        cb(err,res);
    });
};

operater.addMessage = function(cid,uid,uname,fromuid,fromuname,content,type,cb){
    var sql1 = "select * from message_table where receive_userid = ? and send_userid = ? and type=?";
    mysqlClient.query(sql1, [uid,fromuid,type], function (err1,res) {
        if(typeof(res)=="undefined"||res.length==0){
            var sql = "insert message_table (receive_userid,receive_username,send_userid,send_username,content,type,param,status) value(?,?,?,?,?,?,?,?)";
            console.log(sql);
            mysqlClient.insert(sql, [uid,uname,fromuid,fromuname,content,type,cid,1], function (err) {
                if (cb) {
                    cb.call(err);
                }
            });
        }else{
            if (cb) {
                cb.call(err1);
            }
        }
    });
};

operater.updateMessageById = function(mid,detail,cb){
    var sql = "update message_table set status=0,param=? where id=?";
    console.log(sql);
    mysqlClient.update(sql, [detail,mid], function (err,res) {
        cb(err);
    });
};

operater.delMessageById = function(mid,cb){
    var sql = "delete from message_table where id=?";
    console.log(sql);
    mysqlClient.delete(sql, [mid], function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.delMessageByUid = function(uid,cb){
    var sql = "delete from message_table where receive_userid=?";
    console.log(sql);
    mysqlClient.delete(sql, [uid], function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};