var operater = module.exports;
var mysqlClient = require('../routes/mysql/mysqlclient').init();


operater.getRecordList = function(uid,type,cb){
    var sql = "select * from pay_record_table where uid=? and type=?";
    mysqlClient.query(sql, [uid,type], function (err,res) {
        cb(err,res);
    });
};

operater.getRecord = function(uid,type,cb){
    var sql = "select * from pay_record_table where uid=?";
    mysqlClient.query(sql, [uid,type], function (err,res) {
        cb(err,res);
    });
};

operater.checkRecord = function(uid,type,value,cb){
    var sql = "select * from pay_record_table where uid=? and type=? and value=?";
    mysqlClient.query(sql, [uid,type,value], function (err,res) {
        cb(err,res);
    });
};

operater.addRecord = function(uid,type,value,flower,cb){
    sql = "insert pay_record_table (uid,type,value,flower) value(?,?,?,?)";
    console.log(sql);
    mysqlClient.insert(sql, [uid,type,value,flower], function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};
