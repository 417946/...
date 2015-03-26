var db = require('./../dao/user_dao');
var response = require('./common/response');

exports.onGetUserDetailById = function(req,res){
    var callback=req.query.callback;
    db.getUserDetailById(req.query.user_id,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};

