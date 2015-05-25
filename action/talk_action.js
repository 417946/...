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

