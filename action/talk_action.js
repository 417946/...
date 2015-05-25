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
exports.onAddFriend = function(req,res){
    var callback=req.query.callback;
    var uid = req.query.uid;
    var fid = req.query.fid;
    var fname = req.query.fname;
    db.addFriend(uid,fid,fname,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};
