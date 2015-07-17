// mysql CRUD
var operater = module.exports;
var log = require('../common').log;
var mysqlClient = require('../routes/mysql/mysqlclient').init();
var common = require("../common.js");


operater.getMessageByUid = function(user_id,cb){
    var values = [user_id];
    var sql = "select * from message_table where receive_userid=? and status=1 and type!=7 order by create_time desc ";
    console.log(sql);
    mysqlClient.query(sql, values, function (err,res) {
        cb(err,res);
    });
};

operater.addMessage = function(uid,uname,fromuid,fromuname,content,type,cb){
    var sql1 = "select * from message_table where receive_userid = "+uid+" and send_userid = "+fromuid+" and type="+type;
    mysqlClient.query(sql1, null, function (err1,res) {
        if(res.length==0){
            var sql = "insert message_table (receive_userid,receive_username,send_userid,send_username,content,type,status) value(" + uid + ",'"+uname+"',"+fromuid+",'"+fromuname+"','" + content + "','"+type+"',1)";
            console.log(sql);
            mysqlClient.insert(sql, null, function (err) {
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

operater.updateMessageById = function(uid,detail,cb){
    var sql = "update message_table set status=0,param='"+detail+"' where id="+mid;
    console.log(sql);
    mysqlClient.update(sql, null, function (err,res) {
        cb(err);
    });
};

operater.delMessageById = function(mid,cb){
    var sql = "delete from message_table where id=" + mid;
    console.log(sql);
    mysqlClient.delete(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.delMessageByUid = function(uid,cb){
    var sql = "delete from message_table where receive_userid='" + uid + "'";
    console.log(sql);
    mysqlClient.delete(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};