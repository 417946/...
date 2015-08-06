var db = require('./../dao/talk_dao');
var response = require('../routes/common/response');

exports.getFriendList = function(req,res){
    var callback=req.query.callback;
    db.getFriendList(req.query.uid,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};
exports.getFriendByUid = function(req,res){
    var callback=req.query.callback;
    db.getFriendByUid(req.query.uid,req.query.fid,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};
exports.onAddFriend = function(req,res){
    var callback=req.query.callback;
    var uid = req.query.uid;
    var fid = req.query.fid;
    var fname = req.query.fname;
    var uname = req.query.uname;
    db.getFriendByUid(uid,fid,function(err1,list){
        if(err1){
            return response.end(res,response.buildError(err1.code),callback);
        }else{
            if(list.length>0){
                response.end(res,response.buildOK(),callback);
            }else{
                db.addFriend(uid,uname,fid,fname,10,10,function(err,result){
                    if(err){
                        return response.end(res,response.buildError(err.code),callback);
                    }
                    response.end(res,response.buildOK(),callback);
                });
            }
        }
    });
};
exports.getHistory = function(req,res){
    var callback=req.query.callback;
    db.getHistory(req.query.uid1,req.query.uid2,req.query.page,req.query.index,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }else{
            list.forEach(function(item){
                item.create_time=item.create_time.format("MM-dd hh:mm:ss").toString();
            });
            response.end(res,response.buildOK(list),callback);
        }
    });
};

exports.yidu = function(req,res){
    var callback=req.query.callback;
    var uid = req.query.uid;
    db.updateStatusByUid(uid,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};

exports.voice_yidu = function(req,res){
    var callback=req.query.callback;
    var content = req.query.content;
    db.updateStatusByVoice(content,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};

exports.delTalkRecord = function(req,res){
    var callback=null;
    db.delTalkRecord(req.body["uid"],req.body["talk_uid"],function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};

exports.getTalkDel = function(req,res){
    var callback=req.query.callback;
    db.getTalkDel(req.query,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(list),callback);
    });
};

exports.onAddTalkDel = function(req,res){
    var callback=req.query.callback;
    db.addTalkDel(req.query,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};

exports.onDelTalkDel = function(req,res){
    var callback=req.query.callback;
    db.delTalkDel(req.query,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildOK(),callback);
    });
};