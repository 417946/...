var db = require('./../dao/flower_dao');
var response = require('../routes/common/response');
var config = require('../config').config;

exports.onSendFlower = function(req,res){
    var callback=null;
    var uid = req.body.uid;
    var uname = req.body.uname;
    var flower_uid = req.body.flower_uid;
    var flower_uname = req.body.flower_uname;
    var flower = req.body.flower;
    db.sendFlower(uid,uname,flower_uid,flower_uname,flower,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }else{
            return response.end(res,response.buildOK(),callback);
        }
    });
};

exports.onAddFlower = function(req,res){
    var callback=null;
    var uid = req.body.uid;
    var uname = req.body.uname;
    var rmb = req.body.rmb;
    var flower = req.body.flower;
    db.addFlower(uid,uname,flower,rmb,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }else{
            return response.end(res,response.buildOK(),callback);
        }
    });
};

//exports.onGetScore = function(req,res){
//    var callback=null;
//    var score_uid=req.body.score_uid;
//    var uid=req.body.uid;
//    db.getScore(uid,score_uid,function(err,list){
//        if(err){
//            return response.end(res,response.buildError(err.code),callback);
//        }
//        return response.end(res,response.buildResponse(response.OK,list),callback);
//    });
//};


