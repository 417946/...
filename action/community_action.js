var db = require('./../dao/community_dao');
exports.onAddTopic = function(req,res){
    var result = { error: "" };
    var user_id = req.body['user_id'];
    var title = req.body['title'];
    var content = req.body['content'];
    db.addTopic(user_id,title,content,function(err){
        if(err){
            console.log(err);
            result.err = err;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
};
exports.onAddComment = function(req,res){
    var result = { error: "" };
    var user_id = req.body['user_id'];
    var topic_id = req.body['topic_id'];
    var content = req.body['content'];
    db.addComment(user_id,topic_id,content,function(err){
        if(err){
            console.log(err);
            result.err = err;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
};
exports.onAddTopicUser = function(req,res){
    var result = { error: "" };
    var user_id = req.body['user_id'];
    var topic_id = req.body['topic_id'];
    var type = req.body['type'];
    db.addTopicUser(user_id,topic_id,type,function(err){
        if(err){
            console.log(err);
            result.err = err;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
};
exports.onDelTopic = function(req,res){
    var result = { error: "" };
    var topic_id = req.body['topic_id'];
    db.delTopic(topic_id,function(err){
        if(err){
            console.log(err);
            result.err = err;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
};
exports.onDelComment = function(req,res){
    var result = { error: "" };
    var comment_id = req.body['comment_id'];
    db.delComment(comment_id,function(err){
        if(err){
            console.log(err);
            result.err = err;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
};
exports.onDelFromTopicUser = function(req,res){
    var result = { error: "" };
    var topic_id = req.body['topic_id'];
    var user_id = req.body['user_id'];
    db.delFromTopicUser(topic_id,user_id,function(err){
        if(err){
            console.log(err);
            result.err = err;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
};