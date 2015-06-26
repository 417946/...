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
    db.addFriend(uid,uname,fid,fname,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};
exports.getHistory = function(req,res){
    var callback=req.query.callback;
    db.getHistory(req.query.uid1,req.query.uid2,req.query.page,req.query.index,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(list),callback);
    });
};
