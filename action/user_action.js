var db = require('./../dao/user_dao');
var prdao = require('./../dao/payrecord_dao');
var userManager = require('../routes/userManager.js');
var webreg = require('../routes/webreg.js');
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
exports.onGetMusicTip = function(req,res){
    var callback=req.query.callback;
    db.getTipMusic(req.query.user_id,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};
exports.onGetHeadImg = function(req,res){
    var callback=req.query.callback;
    db.getHeadImg(req.query.user_id,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};
exports.onUpdateTipMusic = function(req,res){
    var callback=req.query.callback;
    var uid = req.query.uid;
    var tip = req.query.tip;
    db.updateTipMusic(uid,tip,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};
exports.onUpdateColour = function(req,res){
    var callback=req.query.callback;
    var uid = req.query.uid;
    var colour = req.query.color;
    var colour_index = req.query.color_index;
    db.updateColour(uid,colour,colour_index,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};
exports.onUpdateHeadImg = function(req,res){
    var callback=req.query.callback;
    var uid = req.query.uid;
    var headimg = req.query.headimg;
    var headurl = req.query.headurl;
    db.updateHeadImg(uid,headimg,headurl,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
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
exports.onFindPwd = function(req,res){
    var callback=null;
    db.getUserByMail(req.body['uid'],req.body['email'],function(err1,list){
        if(err1){
            return response.end(res,response.buildError(err1.code),callback);
        }else{
            if(list.length>0) {
                db.updatePwd(req.body['uid'],req.body['pwd'],function(err,result){
                    if(err){
                        return response.end(res,response.buildError(err.code),callback);
                    }else{
                        response.end(res,response.buildResponse(response.OK,list),callback);
                    }
                });
            }else{
                return response.end(res,response.buildError("帐号或邮箱错误。"),callback);
            }
        }
    });
};

exports.onUpdatePwd = function(req,res){
    var callback=null;
    db.getUserByPwd(req.body['uid'],req.body['pwd'],function(err1,list){
        if(err1){
            return response.end(res,response.buildError(err1.code),callback);
        }else{
            if(list.length>0) {
                db.updatePwd(req.body['uid'],req.body['pwd1'],function(err,result){
                    if(err){
                        return response.end(res,response.buildError(err.code),callback);
                    }else{
                        response.end(res,response.buildResponse(response.OK,list),callback);
                    }
                });
            }else{
                return response.end(res,response.buildError("原密码错误。"),callback);
            }
        }
    });
};

exports.onGetDaren = function(req,res){
    var callback=null;
    db.getDaren(function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};

exports.onReg = function(req,res){
    var callback=null;
    var uid = userManager.GetInstance().getCurUserId();
    var uname = req.body["uname"];
    var pwd = req.body["pwd"];
    db.reg(uid,uname,pwd,function(err1,result1){
        response.end(res,response.buildOK(),callback);
    });
};

exports.onHighScore = function(req,res){
    var userInfo={
        username:req.body["uname"],
        sex:req.body["sex"],
        birthday:req.body["birthday"]
    }
    var callback=null;
    webreg.onPostHightScore(userInfo,function(highScore){
        response.end(res,response.buildResponse(response.OK,highScore),callback);
    });
};