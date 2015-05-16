var db = require('./../dao/friend_dao');
var response = require('../routes/common/response');
exports.onAddFriend = function(req,res){
    var callback=req.query.callback;
    var user_id = req.query.user_id;
    var name = req.query.name;
    var sex = req.query.sex;
    var birthday = req.query.birthday;
    db.addFriend(name,user_id,sex,birthday,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};
exports.onDelFriend = function(req,res){
    var callback=req.query.callback;
    var fid = req.query.fid;
    db.delFriend(fid,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildOK(),callback);
    });
};

exports.getFriendList = function(req,res){
    var callback=req.query.callback;
    db.getFriendList(req.query.uid,req.query.index,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};
exports.getFriendById = function(req,res){
    var callback=req.query.callback;
    db.getFriendById(req.query.fid,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};

