var operater = module.exports;
var mysqlClient = require('../routes/mysql/mysqlclient').init();


operater.getFlowerByUid = function(uid,flower_uid,cb){
    var sql = "select * from flower_table where uid=? and flower_uid=?";
    mysqlClient.query(sql, [uid,flower_uid], function (err,res) {
        cb(err,res);
    });
};

operater.sendFlower = function(uid,uname,flower_uid,flower_name,flower,cb){
    var sql = "insert pay_record_table (uid,type,value,flower) value(?,?,?,?)";
    mysqlClient.insert(sql, [uid,'send',flower_name+'('+flower_uid+')',flower], function (err) {
        var sql1 = "insert pay_record_table (uid,type,value,flower) value(?,?,?,?)";
        mysqlClient.insert(sql1, [flower_uid,'gift',uname+'('+uid+')',flower], function (err1) {
            var sql2 = "update user_table set lotus=lotus+? where user_id=?";
            mysqlClient.update(sql2, [flower,flower_uid], function (err2) {
                var sql3 = "update user_table set lotus=lotus-? where user_id=?";
                mysqlClient.update(sql3, [flower,uid], function (err3) {
                    if (cb) {
                        cb.call(err3);
                    }
                });
            });
        });
    });
};

operater.addFlower = function(uid,uname,flower,rmb,cb){
    var sql = "insert pay_record_table (uid,type,value,flower) value(?,?,?,?)";
    mysqlClient.insert(sql, [uid,'recharge',rmb,flower], function (err) {
        var sql2 = "update user_table set lotus=lotus+? where user_id=?";
        mysqlClient.update(sql2, [flower,uid], function (err2) {
            if (cb) {
                cb.call(err2);
            }
        });
    });
};

operater.backFlower = function(uid,type,flower,cb){
    var sql = "insert pay_record_table (uid,type,value,flower) value(?,?,?,?)";
    mysqlClient.insert(sql, [uid,type,'',flower], function (err) {
        var sql2 = "update user_table set lotus=lotus+? where user_id=?";
        mysqlClient.update(sql2, [flower,uid], function (err2) {
            if (cb) {
                cb.call(err2);
            }
        });
    });
};

operater. songFlower = function(uid,uname,flower,rmb,cb){
    var sql = "insert pay_record_table (uid,type,value,flower) value(?,?,?,?)";
    mysqlClient.insert(sql, [uid,'system_song',rmb,flower], function (err) {
        var sql2 = "update user_table set lotus=lotus+? where user_id=?";
        mysqlClient.update(sql2, [flower,uid], function (err2) {
            if (cb) {
                cb.call(err2);
            }
        });
    });
};