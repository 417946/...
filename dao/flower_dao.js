var operater = module.exports;
var mysqlClient = require('../routes/mysql/mysqlclient').init();


operater.getFlowerByUid = function(uid,flower_uid,cb){
    var sql = "select * from flower_table where uid=? and flower_uid=?";
    mysqlClient.query(sql, [uid,flower_uid], function (err,res) {
        cb(err,res);
    });
};

operater.sendFlower = function(uid,flower_uid,flower,cb){
    var sql = "insert flower_table (uid,flower_uid,flower) value(?,?,?)";
    console.log(sql);
    mysqlClient.insert(sql, [uid,flower_uid,flower], function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};
