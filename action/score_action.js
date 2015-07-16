var db = require('./../dao/score_dao');
var response = require('../routes/common/response');
var config = require('../config').config;

exports.onAddScore = function(req,res){
    var callback=null;
    var uid = req.body.uid;
    var score_uid = req.body.score_uid;
    var star1 = req.body.star1;
    var star2 = req.body.star2;
    var star3 = req.body.star3;
    var star4 = req.body.star4;
    db.addScore(uid,score_uid,star1,star2,star3,star4,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }else{
            return response.end(res,response.buildOK(),callback);
        }
    });
};

exports.onGetScore = function(req,res){
    var callback=null;
    var score_uid=req.body.score_uid;
    var uid=req.body.uid;
    db.getScore(uid,score_uid,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildResponse(response.OK,list),callback);
    });
};


