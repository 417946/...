/**
 * Created by King Lee on 14-12-11.
 */
var db = require('./mysql/dboperator');
var userInfo = require('./userInfo.js').userInfo;
var user = require("./user.js");
var analysis = require('./module/analysis');
var consts = require('./util/consts');
var db = require('./mysql/dboperator');
//exports.onGetEnergy = function(req,res){
//    var uid = parseInt(req.body["uid"]);
//    var result = { error: "" };
//    analysis.getInfo(uid,function(info){
//        if(!info){
//            console.log("没有这个账号");
//            return;
//        }
//        var scores = analysis.getScore(info,consts.TYPE_TIME.TYPE_TIME_TODAY,consts.TYPE_SCORE.TYPE_SCORE_ENERGY,new Date());
//        result.scores = scores[0];
//        console.log(result);
//        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
//        res.end(JSON.stringify(result));
//    });
//};
exports.onGetEnergy = function(req,res){
    var uid = parseInt(req.body["uid"]);
    var result = { error: "" };
    var date=  new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var aDate = year+"-"+month+"-"+day;
    db.getEnergyCache(uid,aDate,function(err,result1){
        if(err){
            result.err=err;
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
        }
        if(result1!=null&&result1.length>0){
            result.scores = result1[0];
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
        }else{
            analysis.getInfo(uid,function(info){
                if(!info){
                    console.log("没有这个账号");
                    return;
                }
                var scores = analysis.getScore(info,consts.TYPE_TIME.TYPE_TIME_TODAY,consts.TYPE_SCORE.TYPE_SCORE_ENERGY,new Date());
                db.getEnergyCache2(uid,function(err,res2){
                    if(err){
                        result.err=err;
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(result));
                    }
                    if(res2.length>0){
                        db.updateEnergyCache(uid,scores[0],aDate,function(err){
                            if(err){
                                result.err=err;
                                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                                res.end(JSON.stringify(result));
                            }
                        });
                    }else{
                        db.insertEnergyCache(uid,scores[0],aDate,function(err){
                            if(err){
                                result.err=err;
                                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                                res.end(JSON.stringify(result));
                            }
                        });
                    }
                });
                result.scores = scores[0];
                console.log(result);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(result));
            });
        }
    });
};