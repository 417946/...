var db = require('./../dao/zizhu_dao');
var response = require('../routes/common/response');
var config = require('../config').config;

exports.onAddZizhu = function(req,res){
    var callback=null;
    var uid = req.body.uid;
    var type = req.body.type;
    var date = req.body.date;
    db.addZizhu(uid,type,date,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }else{
            return response.end(res,response.buildOK(),callback);
        }
    });
};

exports.onGetZizhuList = function(req,res){
    var callback=null;
    var date=req.body.date;
    var uid=req.body.uid;
    db.getZizhuList(uid,date,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildResponse(response.OK,list),callback);
    });
};


