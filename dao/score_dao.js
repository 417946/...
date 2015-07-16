var operater = module.exports;
var mysqlClient = require('../routes/mysql/mysqlclient').init();


operater.getScore = function(uid,score_uid,cb){
    var sql = "select * from user_score_table where uid=? and score_uid=?";
    mysqlClient.query(sql, [uid,score_uid], function (err,res) {
        cb(err,res);
    });
};

operater.addScore = function(uid,score_uid,star1,star2,star3,star4,cb){
    var sql = "insert user_score_table (uid,score_uid,type,score) value(?,?,?,?)";
    mysqlClient.insert(sql, [uid,score_uid,"1",star1], function (err1) {
        if (err1) {
            cb.call(err1);
        }else{
            mysqlClient.insert(sql, [uid,score_uid,"2",star2], function (err2) {
                if(err2){
                    cb.call(err2);
                }else{
                    mysqlClient.insert(sql, [uid,score_uid,"3",star3], function (err3) {
                        if(err3){
                            cb.call(err3);
                        }else{
                            mysqlClient.insert(sql, [uid,score_uid,"4",star4], function (err4) {
                                cb.call(err4);
                            });
                        }
                    });
                }
            });
        }
    });
};
