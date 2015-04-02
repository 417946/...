// mysql CRUD
var operater = module.exports;
var log = require('../common').log;
var mysqlClient = require('../routes/mysql/mysqlclient').init();
var common = require("../common.js");


operater.addTopic = function(user_id,title,content,cb){
    var sql = "insert topic_table(user_id,title,content,status) value('" + user_id + "','" + title + "','"+content+"','1')";
    console.log(sql);
    mysqlClient.insert(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.addComment = function(user_id,topic_id,content,cb){
    var sql = "insert comment_table(user_id,topic_id,content,status) value('" + user_id + "','" + topic_id + "','"+content+"','1')";
    console.log(sql);
    mysqlClient.insert(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.addTopicUser = function(user_id,topic_id,type,cb){
    var sql = "insert topic_user_table(user_id,topic_id,type) value('" + user_id + "','" + topic_id + "','"+type+"')";
    console.log(sql);
    mysqlClient.insert(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.delTopic = function(topic_id,cb){
    var sql = "update topic_table set status = '" + 0 + "' where id = '" + topic_id + "'";
    console.log(sql);

    mysqlClient.insert(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.delComment = function(comment_id,cb){
    var sql = "update comment_table set status = '" + 0 + "' where id = '" + comment_id + "'";
    console.log(sql);

    mysqlClient.insert(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.delFromTopicUser = function(topic_id,user_id,cb){
    var sql = "delete from topic_user_table where topic_id='" + topic_id + "' and user_id='"+user_id+"'";
    console.log(sql);
    mysqlClient.delete(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.getTopicList = function(index,cb){
    var sql = "select * from topic_table order by id desc limit 0,"+index;
    console.log(sql);
    mysqlClient.query(sql,function (err,res) {
        cb(err,res);
    });
};

operater.getTopicByUserId = function(user_id,index,cb){
    var values = [];
    var sql = "select * from topic_table where user_id="+user_id+" limit 0,"+index;
    console.log(sql);
    mysqlClient.query(sql, values, function (err,res) {
        cb(err,res);
    });
};

operater.getHotTopicList = function(index,cb){
    var sql = "select t.* from topic_table t left join (select topic_id,count(*) count_t from comment_table group by topic_id) c on c.topic_id=t.id order by c.count_t desc limit 0,"+index;
    console.log(sql);
    mysqlClient.query(sql,function (err,res) {
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