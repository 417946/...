var db = require('./../dao/user_dao');
var dboper = require('../routes/mysql/dboperator');
var freedb = require('./../dao/free_dao');
var prdao = require('./../dao/payrecord_dao');
var userManager = require('../routes/userManager.js');
var webreg = require('../routes/webreg.js');
var response = require('../routes/common/response');
var analysis = require('../routes/module/analysis');
var consts = require('../routes/util/consts');
var async = require('async');

exports.onGetUserDetailById = function(req,res){
    var callback=req.query.callback;
    var date= new Date().format("yyyy-MM-dd");
    db.getUserDetailById(req.query.user_id,date,function(err,list){
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
    var date= new Date().format("yyyy-MM-dd");
    db.getHeadImg(req.query.user_id,date,function(err,list){
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
        response.end(res,response.buildResponse(response.OK,uid),callback);
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

exports.onEverydayTip = function(req,res){
    var callback=null;
    var date= new Date().format("yyyy-MM-dd");
    var uid=req.body.uid;
    var type='maintip';
    freedb.getFree(uid,date,type,function(err0,list){
        if(err0){
            return response.end(res,response.buildError(err0.code),callback);
        }else{
            freedb.delFree(uid,type,date,function(err1,result0){
                if(err1){
                    return response.end(res,response.buildError(err1.code),callback);
                }else{
                    if(list.length>0){
                        response.end(res,response.buildResponse(response.OK,'1'),callback);
                    }else{
                        var tiplist=['haoyou'];//,'qa','mine','sf','xm','zz','zr','pp'];
                        var qalist=['今日运程','今日能量','今日财运','今日身体','今日桃花'];
                        var colorlist=['今日运程','今日财运','今日桃花'];
                        var num=Math.floor(new Date().getTime()/(24*60*60*1000))%1;
                        var result={};
                        result.tip=tiplist[num];
                        if(tiplist[num]=="haoyou"){
                            dboper.getContract(uid,1,function(err,contracts){
                                if(err){
                                    console.log(err);
                                    result.err = err;
                                }
                                //  get push for friend
                                async.parallel([
                                        function (callback) {
                                            var contracts_uid = contracts ? (contracts[0] ? contracts[0][0] : 0) : 0;
                                            if(contracts_uid){
                                                analysis.getInfo(contracts_uid, function (info) {
                                                    callback(null, info);
                                                });
                                            }else{
                                                callback(null, null);
                                            }
                                        },
                                        function (callback) {
                                            var contracts_uid = contracts ? (contracts[1] ? contracts[1][0] : 0) : 0;
                                            if(contracts_uid){
                                                analysis.getInfo(contracts_uid, function (info) {
                                                    callback(null, info);
                                                });
                                            }else{
                                                callback(null, null);
                                            }
                                        },
                                        function (callback) {
                                            var contracts_uid = contracts ? (contracts[2] ? contracts[2][0] : 0) : 0;
                                            if(contracts_uid){
                                                analysis.getInfo(contracts_uid, function (info) {
                                                    callback(null, info);
                                                });
                                            }else{
                                                callback(null, null);
                                            }
                                        },
                                        function (callback) {
                                            var contracts_uid = contracts ? (contracts[3] ? contracts[3][0] : 0) : 0;
                                            if(contracts_uid){
                                                analysis.getInfo(contracts_uid, function (info) {
                                                    callback(null, info);
                                                });
                                            }else{
                                                callback(null, null);
                                            }
                                        },
                                        function (callback) {
                                            var contracts_uid = contracts ? (contracts[4] ? contracts[4][0] : 0) : 0;
                                            if(contracts_uid){
                                                analysis.getInfo(contracts_uid, function (info) {
                                                    callback(null, info);
                                                });
                                            }else{
                                                callback(null, null);
                                            }
                                        }
                                    ],
                                    // optional callback
                                    function (err, results) {
                                        // the results array will equal ['one','two'] even though
                                        // the second function had a shorter timeout.
                                        if(err){
                                            console.log(err);
                                        }
                                        var push_message = [];
                                        var push_uid = [];
                                        var push_uname = [];
                                        var push_desc = [];
                                        for (var i = 0; i < results.length; ++i) {
                                            if (results[i]) {
                                                var today_energy = analysis.getScore(results[i], consts.TYPE_TIME.TYPE_TIME_TODAY, consts.TYPE_SCORE.TYPE_SCORE_ENERGY, new Date());
                                                var today_luck = analysis.getScore(results[i], consts.TYPE_TIME.TYPE_TIME_TODAY, consts.TYPE_SCORE.TYPE_SCORE_LUCK, new Date());
                                                var message = "";
                                                var desc="";
                                                if (today_luck[0] < 60) {
                                                    if(results[i].sex=='1'){
                                                        message = "今日好友" + results[i].name + "运程较低，告诉他么？";
                                                        desc = "你今天运程好低！诸事小心。";
                                                    }else{
                                                        message = "今日好友" + results[i].name + "运程较低，告诉她么？";
                                                        desc = "你今天运程好低！诸事小心。";
                                                    }
                                                }else if (today_energy[0] < 60) {
                                                    if(results[i].sex=='1'){
                                                        message = "今日好友" + results[i].name + "能量较低，告诉他么？";
                                                        desc = "你今天能量较低。";
                                                    }else{
                                                        message = "今日好友" + results[i].name + "能量较低，告诉她么？";
                                                        desc = "你今天能量较低。";
                                                    }
                                                }else if(today_luck[0]>=75){
                                                    if(results[i].sex=='1'){
                                                        message = "今日好友" + results[i].name + "运程较高，快告诉他。";
                                                        desc = "你今天运程这么高！";
                                                    }else{
                                                        message = "今日好友" + results[i].name + "运程较高，快告诉他。";
                                                        desc = "你今天运程这么高！";
                                                    }
                                                }else if(today_energy[0] >= 75){
                                                    if(results[i].sex=='1'){
                                                        message = "今日好友" + results[i].name + "能量较高，快告诉他。";
                                                        desc = "你今天能量这么高！还不送我一些。";
                                                    }else{
                                                        message = "今日好友" + results[i].name + "能量较高，快告诉他。";
                                                        desc = "你今天能量这么高！还不送我一些。";
                                                    }
                                                }
                                                if (message) {
                                                    push_message.push(message);
                                                    push_uname.push(results[i].name);
                                                    push_uid.push(results[i].uid);
                                                    push_desc.push(desc);
                                                }
                                            }
                                        }
                                        result.push_message = push_message;
                                        result.push_uname = push_uname;
                                        result.push_uid = push_uid;
                                        result.push_desc = push_desc;
                                        result.contracts = contracts;
                                        console.log(result);
                                        response.end(res,response.buildResponse(response.OK,result),callback);
                                    });
                            });
                        }else if(tiplist[num]=="qa"){

                        }else if(tiplist[num]=="mine"){

                        }else if(tiplist[num]=="sf"){

                        }else if(tiplist[num]=="xm"){

                        }else if(tiplist[num]=="zz"){

                        }else if(tiplist[num]=="zr"){

                        }else if(tiplist[num]=="pp"){

                        }
                    }
                }
            })
        }
    });
};