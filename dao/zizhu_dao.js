var operater = module.exports;
var mysqlClient = require('../routes/mysql/mysqlclient').init();


operater.getZizhuList = function(uid,date,cb){
    var sql = "select * from zizhu_table where uid=? and date=?";
    mysqlClient.query(sql, [uid,date], function (err,res) {
        cb(err,res);
    });
};

operater.addZizhu = function(uid,type,date,cb){
    sql = "insert zizhu_table (uid,type,date) value(?,?,?)";
    console.log(sql);
    mysqlClient.insert(sql, [uid,type,date], function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};
