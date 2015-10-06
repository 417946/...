var db = require('./../dao/free_dao');
var response = require('../routes/common/response');
var flowerdb = require('./../dao/flower_dao');
var config = require('../config').config;

exports.onAddFree = function(req,res){
    var callback=null;
    var uid = req.body.uid;
    var type = req.body.type;
    var detail = req.body.detail;
    var date = new Date().format("yy-MM-dd");
    db.addFree(uid,type,date,detail,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }else{
            return response.end(res,response.buildOK(),callback);
        }
    });
};

exports.onGetFree = function(req,res){
    var callback=null;
    var date= new Date().format("yy-MM-dd");
    var uid=req.body.uid;
    var type=req.body.type;
    db.getFree(uid,date,type,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }else{
            db.delFree(uid,type,date,function(err1,result){
                if(err1){
                    return response.end(res,response.buildError(err1.code),callback);
                }
                return response.end(res,response.buildResponse(response.OK,list),callback);
            })
        }
    });
};

exports.onAddFreeFlower = function(req,res){
    var callback=null;
    var uid = req.body.uid;
    var type = req.body.type;
    var detail = req.body.detail;
    var date = new Date().format("yy-MM-dd");
    db.addFree(uid,type,date,detail,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }else{
            db.getFreeCount2(uid,'getflowers',date,function(err4,result4){
                if(err){
                    return response.end(res,response.buildError(err3.code),callback);
                }else {
                    if (result4[0].sum == 4) {
                        return response.end(res,response.buildResponse(response.OK,''),callback);
                    }else{
                        db.getFreeCount1(uid,'songfu',date,function(err1,result1){
                            if(err){
                                return response.end(res,response.buildError(err1.code),callback);
                            }else{
                                db.getFreeCount2(uid,'zizhu',date,function(err2,result2){
                                    if(err){
                                        return response.end(res,response.buildError(err2.code),callback);
                                    }else{
                                        db.getFreeCount1(uid,'shoufu',date,function(err3,result3){
                                            if(err){
                                                return response.end(res,response.buildError(err3.code),callback);
                                            }else{
                                                if(result1[0].sum<2 || result2[0].sum<2 || result3[0].sum<2){
                                                    return response.end(res,response.buildResponse(response.OK,''),callback);
                                                }else{
                                                    if(result1[0].sum>=(result4[0].sum+1)*2 && result2[0].sum>=(result4[0].sum+1)*2 && result3[0].sum>=(result4[0].sum+1)*2){//增加1莲花
                                                        flowerdb.songFlower(uid,uname,1,1,function(err,result){
                                                            if(err){
                                                                return response.end(res,response.buildError(err.code),callback);
                                                            }else{
                                                                return response.end(res,response.buildResponse(response.OK,'add'),callback);
                                                            }
                                                        });
                                                    }else{
                                                        return response.end(res,response.buildResponse(response.OK,''),callback);
                                                    }
                                                }
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
            });
        }
    });
};