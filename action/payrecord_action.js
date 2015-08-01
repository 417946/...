var db = require('./../dao/payrecord_dao');
var response = require('../routes/common/response');

exports.getRecordList = function(req,res){
    var callback=req.query.callback;
    db.getRecordList(req.query.uid,req.query.type,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }else{
            list.forEach(function(item){
                item.create_time=item.create_time.format("yyyy-MM-dd hh:mm:ss").toString();
            });
            response.end(res,response.buildResponse(response.OK,list),callback);
        }
    });
};
exports.getRecord = function(req,res){
    var callback=req.query.callback;
    db.getRecord(req.query.uid,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};
exports.onAddRecord = function(req,res){
    var callback=req.query.callback;
    var uid = req.query.uid;
    var type = req.query.type;
    var value = req.query.value;
    var flower = req.query.flower;
    db.addRecord(uid,type,value,flower,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};
exports.checkRecord = function(req,res){
    var callback=req.query.callback;
    var uid=req.query.uid;
    var type=req.query.type;
    var value=req.query.value;
    if(type=="qa"){
        var date=new Date().format("yyyy-MM-dd");
        if(date==value){
            return response.end(res,response.buildError("istoday"),callback);
        }
    }
    db.checkRecord(uid,type,value,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(list),callback);
    });
};
