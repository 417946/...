var db = require('./../dao/message_dao');
var response = require('../routes/common/response');

exports.onGetMessageById = function(req,res){
    var callback=req.query.callback;
    db.getMessageById(req.query.user_id,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};

