var db = require('./../dao/user_dao');
var prdao = require('./../dao/payrecord_dao');
var response = require('../routes/common/response');

exports.onGetUserDetailById = function(req,res){
    var callback=req.query.callback;
    db.getUserDetailById(req.query.user_id,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};
exports.onUpdateFlower = function(req,res){
    var callback=null;
    var uid = req.body['uid'];
    var flower_num = req.body["flower_num"];
    db.updateFlower(uid,flower_num,function(err,result){
        console.log('updateflower '+JSON.stringify(err))
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        var flower=parseInt(flower_num)*(-1);
        prdao.addRecord(uid,req.body['type'],req.body['value'],flower,function(err1,result1){
            response.end(res,response.buildOK(),callback);
        });
    });
};
