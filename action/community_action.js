var db = require('./../dao/community_dao');
var response = require('../routes/common/response');
exports.onAddTopic = function(req,res){
    var callback=req.query.callback;
    var user_id = req.query.user_id;
    var title = req.query.title;
    var content = req.query.content;
    db.addTopic(user_id,title,content,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};
exports.onAddComment = function(req,res){
    var callback=req.query.callback;
    var user_id = req.query.user_id;
    var topic_id = req.query.topic_id;
    var content = req.query.content;
    db.addComment(user_id,topic_id,content,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};
exports.onAddTopicUser = function(req,res){
    var callback=req.query.callback;
    var user_id = req.query.user_id;
    var topic_id = req.query.topic_id;
    var type = req.query.type;
    db.addTopicUser(user_id,topic_id,type,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};
exports.onDelTopic = function(req,res){
    var callback=req.query.callback;
    var topic_id = req.query.topic_id;
    db.delTopic(topic_id,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildOK(),callback);
    });
};
exports.onDelComment = function(req,res){
    var callback=req.query.callback;
    var comment_id = req.query.comment_id;
    db.delComment(comment_id,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildOK(),callback);
    });
};
exports.onDelFromTopicUser = function(req,res){
    var callback=req.query.callback;
    var topic_id = req.query.topic_id;
    var user_id = req.query.user_id;
    db.delFromTopicUser(topic_id,user_id,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildOK(),callback);
    });
};

exports.onGetTopicList = function(req,res){
    var callback=req.query.callback;
    db.getTopicList(function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};

exports.onGetTopicByUserId = function(req,res){
    var callback=req.query.callback;
    db.getTopicByUserId(req.query.user_id,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};

exports.onGetTopicByType = function(req,res){
    var callback=req.query.callback;
    db.getTopicByType(req.query.type,req.query.user_id,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};