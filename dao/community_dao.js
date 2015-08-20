// mysql CRUD
var operater = module.exports;
var log = require('../common').log;
var mysqlClient = require('../routes/mysql/mysqlclient').init();
var common = require("../common.js");


operater.addTopic = function(user_id,title,content,type,cb){
    var sql = "insert topic_table(user_id,title,content,type,status) value(?,?,?,?,?)";
    console.log(sql);
    mysqlClient.insert(sql, [user_id,title,content,type,'1'], function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.addComment = function(user_id,topic_id,content,cb){
    var sql = "insert comment_table(user_id,topic_id,content,status) value(?,?,?,?)";
    console.log(sql);
    mysqlClient.insert(sql, [user_id,topic_id,content,'1'], function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.addTopicUser = function(user_id,topic_id,type,cb){
    var sql = "insert topic_user_table(user_id,topic_id,type) value(?,?,?)";
    console.log(sql);
    mysqlClient.insert(sql, [user_id,topic_id,type], function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.delTopic = function(topic_id,cb){
    var sql = "update topic_table set status = '0' where id = ?";
    console.log(sql);

    mysqlClient.insert(sql, [topic_id], function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.delComment = function(comment_id,cb){
    var sql = "update comment_table set status = '0' where id = ?";
    console.log(sql);

    mysqlClient.insert(sql, [comment_id], function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.delFromTopicUser = function(topic_id,user_id,cb){
    var sql = "delete from topic_user_table where topic_id=? and user_id=?";
    console.log(sql);
    mysqlClient.delete(sql, [topic_id,user_id], function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.getTopicList = function(index,type,cb){
//    var sql = "select * from topic_table order by id desc limit 0,"+index;
    var sql = "select t.*,u.name,d.identification,d.head_img,d.head_url from topic_table t left join user_table u on u.user_id=t.user_id left join user_detail_table d on t.user_id=d.user_id where t.type=? order by id desc limit 0,?";
    console.log(sql);
    mysqlClient.query(sql,[type,index], function (err,res) {
        cb(err,res);
    });
};

operater.getTopicById = function(tid,cb){
    var sql = "select t.*,u.name,d.head_img,d.head_url from topic_table t left join user_table u on u.user_id=t.user_id left join user_detail_table d on t.user_id=d.user_id where t.id=?";
    console.log(sql);
    mysqlClient.query(sql,[tid], function (err,res) {
        cb(err,res);
    });
};

operater.getTopicByUserId = function(user_id,index,cb){
    var values = [user_id,index];
    var sql = "select * from topic_table where user_id=? limit 0,?";
    console.log(sql);
    mysqlClient.query(sql, values, function (err,res) {
        cb(err,res);
    });
};

operater.getHotTopicList = function(index,cb){
    var sql = "select t.* from topic_table t left join (select topic_id,count(*) count_t from comment_table group by topic_id) c on c.topic_id=t.id order by c.count_t desc limit 0,?";
    console.log(sql);
    mysqlClient.query(sql,[index], function (err,res) {
        cb(err,res);
    });
};

operater.getTopicByType = function(type,user_id,cb){
    var values = [type,user_id];
    var sql = "select t.* from topic_table t left join topic_user_table tu on t.id=tu.topic_id where tu.type=? and tu.user_id=? ";
    console.log(sql);
    mysqlClient.query(sql, values, function (err,res) {
        cb(err,res);
    });
};


operater.getCommList = function(tid,cb){
    var sql = "select t.*,c.content comm_content,c.user_id c_user_id,u.name,cu.name c_username,d.head_img,d.head_url " +
        "from comment_table t " +
        "left join comment_table c on c.comm_id=t.id " +
        "left join user_detail_table d on t.user_id=d.user_id " +
        "left join user_table u on u.user_id=t.user_id " +
        "left join user_table cu on cu.user_id=c.user_id where t.topic_id=?";
    console.log(sql);
    mysqlClient.query(sql,[tid], function (err,res) {
        cb(err,res);
    });
};