// mysql CRUD
var operater = module.exports;
var log = require('../routes/common').log;
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
