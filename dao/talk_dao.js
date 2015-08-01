/**
 * Created by zoey on 2015/5/24.
 */
var operater = module.exports;
var mysqlClient = require('../routes/mysql/mysqlclient').init();


operater.getFriendList = function(uid,cb){
    var sql = "select tf.*,u.name,d.head_img,u.sex,u.birthday,u.user_id uid from talk_friend_table tf left join user_table u on u.user_id=tf.fid left join user_detail_table d on tf.fid=d.user_id where tf.uid=? group by fid order by tf.sort desc";
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
            if(res[0]){
                res[0].pagecount=res1[0].pc;
            }
            cb(err,res);
        });
    });
};
operater.addFriend = function(uid,uname,fid,fname,sort1,sort2,cb){
    var sql = "insert talk_friend_table (uid,fid,fname,sort) value(" + uid + "," + fid + ",'"+fname+"','"+sort1+"')";
    console.log(sql);
    mysqlClient.insert(sql, null, function (err) {
        var sql1 = "insert talk_friend_table (uid,fid,fname,sort) value(" + fid + "," + uid + ",'"+uname+"','"+sort2+"')";
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
operater.updateStatusByUid = function(uid,cb){
    var sql = "update talk_content_table set status=0 where type!=2 and toUid="+uid;
    console.log(sql);
    mysqlClient.update(sql, null, function (err,res) {
        cb(err);
    });
};
operater.updateStatusById = function(id,cb){
    var sql = "update talk_content_table set status=0 where id="+id;
    console.log(sql);
    mysqlClient.update(sql, null, function (err,res) {
        cb(err);
    });
};
operater.updateStatusByVoice = function(content,cb){
    var sql = "update talk_content_table set status=0 where type=2 and content='"+content+"'";
    console.log(sql);
    mysqlClient.update(sql, null, function (err,res) {
        cb(err);
    });
};
operater.getWeiduList = function(uid,cb){
    var sql = "select t.*,u.name from talk_content_table t left join user_table u on t.fromUid=u.user_id where t.toUid=? and t.status=1 group by fromUid";
    mysqlClient.query(sql, [uid], function (err,res) {
        cb(err,res);
    });
};
operater.addTalkDel = function(obj,cb){
    var sql = "insert talk_del_table (uid,talk_uid) value(?,?)";
    mysqlClient.insert(sql, [obj.uid,obj.talk_uid], function (err) {
        if (cb) {
            cb(err);
        }
    });
};

operater.delTalkDel = function(obj,cb){
    var sql = "delete from talk_del_table where uid=? and talk_uid=?";
    mysqlClient.delete(sql, [obj.uid,obj.talk_uid], function (err) {
        if (cb) {
            cb(err);
        }
    });
};
operater.getTalkDel = function(obj,cb){
    var sql = "select * from talk_del_table where (uid=? and talk_uid=?) or (talk_uid=? and uid=?)";
    mysqlClient.query(sql, [obj.uid,obj.talk_uid,obj.uid,obj.talk_uid], function (err,res) {
        cb(err,res);
    });
};
operater.delTalkRecord = function(uid,talk_uid,cb){
    var sql = "delete from talk_content_table where (fromUid=? and toUid=?) or (toUid=? and fromUid=?)";
    mysqlClient.delete(sql, [uid,talk_uid,uid,talk_uid], function (err) {
        if (cb) {
            cb(err);
        }
    });
};