/**
 * Created by zoey on 2015/5/24.
 */
var operater = module.exports;
var mysqlClient = require('../routes/mysql/mysqlclient').init();


operater.getFriendList = function(uid,cb){
    var sql = "select tf.*,d.head_img from talk_friend_table tf left join user_detail_table d on tf.fid=d.user_id where tf.uid=?";
    mysqlClient.query(sql, [uid], function (err,res) {
        cb(err,res);
    });
};

operater.getFriendByUid = function(uid,fid,cb){
    var sql = "select * from talk_friend_table where uid=? and fid=?";
    mysqlClient.query(sql, [uid,fid], function (err,res) {
        cb(err,res);
    });
};

//operater.getHistory = function(uid1,uid2,cb){
//    var sql = "SELECT * FROM talk_content_table WHERE (fromUid=? OR toUid=?) AND( fromUid=? OR toUid=?) ORDER BY create_time DESC LIMIT 0,20";
//    mysqlClient.query(sql, [uid1,uid1,uid2,uid2], function (err,res) {
//        cb(err,res);
//    });
//};
operater.getHistory = function(uid1,uid2,page,index,cb){
    var countsql="SELECT count(*) pc FROM talk_content_table WHERE ((fromUid=? AND toUid=?) OR( fromUid=? AND toUid=?)) AND content!='' ";
    mysqlClient.query(countsql, [uid1,uid2,uid2,uid1], function (err,res1) {
        var sql = "SELECT * FROM talk_content_table WHERE ((fromUid=? AND toUid=?) OR( fromUid=? AND toUid=?)) AND content !='' ORDER BY create_time DESC LIMIT ?,"+index;
        mysqlClient.query(sql, [uid1,uid2,uid2,uid1,(page-1)*index], function (err,res) {
            res[0].pagecount=res1[0].pc;
            cb(err,res);
        });
    });
};
operater.addFriend = function(uid,uname,fid,fname,cb){
    var sql = "insert talk_friend_table (uid,fid,fname) value(" + uid + "," + fid + ",'"+fname+"')";
    console.log(sql);
    mysqlClient.insert(sql, null, function (err) {
        var sql1 = "insert talk_friend_table (uid,fid,fname) value(" + fid + "," + uid + ",'"+uname+"')";
        mysqlClient.insert(sql1, null, function (err1) {
            if (cb) {
                cb.call(err1);
            }
        });
    });
};
operater.addContent = function(obj,cb){
    var sql = "insert talk_content_table (fromUid,toUid,content,type) value(?,?,?,?)";
    mysqlClient.insert(sql, [obj.fromUid,obj.toUid,obj.content,obj.type], function (err) {
        if (cb) {
            cb(err);
        }
    });
};