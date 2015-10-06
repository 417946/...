var operater = module.exports;
var mysqlClient = require('../routes/mysql/mysqlclient').init();


operater.getFree = function(uid,date,type,cb){
    var sql = "select * from free_flower_table where uid=? and date=? and type=?";
    mysqlClient.query(sql, [uid,date,type], function (err,res) {
        cb(err,res);
    });
};

operater.addFree = function(uid,type,date,detail,cb){
    sql = "insert free_flower_table (uid,type,date,detail) value(?,?,?,?)";
    console.log(sql);
    mysqlClient.insert(sql, [uid,type,date,detail], function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.delFree = function(uid,type,date,cb){
    var sql = "delete from free_flower_table where uid=? and type=? and date!=?";
    mysqlClient.delete(sql, [uid,type,date], function (err) {
        if (cb) {
            cb(err);
        }
    });
};

operater.getFreeCount1 = function(uid,date,type,cb){
    var sql = "select count(*) sum from free_flower_table where uid=? and date=? and type=? order by detail";
    mysqlClient.query(sql, [uid,date,type], function (err,res) {
        cb(err,res);
    });
};

operater.getFreeCount2 = function(uid,date,type,cb){
    var sql = "select count(*) sum from free_flower_table where uid=? and date=? and type=?";
    mysqlClient.query(sql, [uid,date,type], function (err,res) {
        cb(err,res);
    });
};