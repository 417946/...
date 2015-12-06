var db = require('./../dao/user_dao');
var dboper = require('../routes/mysql/dboperator');
var freedb = require('./../dao/free_dao');
var prdao = require('./../dao/payrecord_dao');
var userManager = require('../routes/userManager.js');
var voicequery = require('../routes/voice_query1.js');
var webreg = require('../routes/webreg.js');
var response = require('../routes/common/response');
var analysis = require('../routes/module/analysis');
var consts = require('../routes/util/consts');
var colour_json = require('../config/colour');
var user = require("../routes/user.js");
var userInfo = require('../routes/userInfo.js').userInfo;
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

exports.onHighScoreById = function(req,res){
    var callback=null;
    var date= new Date().format("yyyy-MM-dd");
    db.getUserDetailById(req.body["uid"],date,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }else{
            var userInfo={
                username:list[0].name,
                sex:list[0].sex,
                birthday:list[0].birthday
            }
            webreg.onPostHightScore(userInfo,function(highScore){
                response.end(res,response.buildResponse(response.OK,highScore),callback);
            });
        }
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
//    response.end(res,response.buildResponse(response.OK,'1'),callback);
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
                        var tiplist=['haoyou','qa','mine','xm','addhaoyou','pp','zr'];//,'sf','xm','zz','zr','pp'];
                        var qalist=['今日运程','今日能量','今日财运','今日身体','今日桃花'];
                        var num=new Date().getDay();
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
                                        var luck = [];
                                        var energy = [];
                                        for (var i = 0; i < results.length; ++i) {
                                            if (results[i]) {
                                                var today_energy = analysis.getScore(results[i], consts.TYPE_TIME.TYPE_TIME_TODAY, consts.TYPE_SCORE.TYPE_SCORE_ENERGY, new Date());
                                                var today_luck = analysis.getScore(results[i], consts.TYPE_TIME.TYPE_TIME_TODAY, consts.TYPE_SCORE.TYPE_SCORE_LUCK, new Date());
                                                var message = "";
                                                var desc="";
                                                var todayluck=today_luck[0];
                                                var todayenergy=today_energy[0];
                                                if(today_luck[0]>=75){
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
                                                }else if (today_luck[0] < 60) {
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
                                                }
                                                if (message) {
                                                    push_message.push(message);
                                                    push_uname.push(results[i].name);
                                                    push_uid.push(results[i].uid);
                                                    push_desc.push(desc);
                                                    energy.push(todayenergy);
                                                    luck.push(todayluck);
                                                }
                                            }
                                        }
                                        result.push_message = push_message;
                                        result.push_uname = push_uname;
                                        result.push_uid = push_uid;
                                        result.push_desc = push_desc;
                                        result.luck = luck;
                                        result.energy = energy;
                                        result.contracts = contracts;
                                        console.log(result);
                                        response.end(res,response.buildResponse(response.OK,result),callback);
                                    });
                            });
                        }else if(tiplist[num]=="qa"){
                            var question = qalist[Math.floor(Math.random()*(qalist.length-1))];
                            var nd = new Date();
                            voicequery.qa(uid,question,1,nd.getFullYear(),nd.getMonth(),nd.getDate(),function(err,answer){
                                if(err){
                                    response.end(res,response.buildResponse(response.OK,'1'),callback);
                                }
                                result.push_message = question;
                                result.push_desc = answer.answer.desc.split("。")[0]+"。";
                                response.end(res,response.buildResponse(response.OK,result),callback);
                            });
                        }else if(tiplist[num]=="mine"){
                            var nd = new Date();
                            var score1=100;
                            var score2=100;
                            var score3=100;
                            voicequery.qa(uid,'今日运程',1,nd.getFullYear(),nd.getMonth(),nd.getDate(),function(errm1,answer1){
                                if(errm1){
                                    response.end(res,response.buildResponse(response.OK,'1'),callback);
                                }else{
                                    score1 = answer1.answer.score;
                                    voicequery.qa(uid,'今日财运',1,nd.getFullYear(),nd.getMonth(),nd.getDate(),function(errm2,answer2){
                                        if(errm2){
                                            response.end(res,response.buildResponse(response.OK,'1'),callback);
                                        }else{
                                            score2 = answer2.answer.score;
                                            voicequery.qa(uid,'今日桃花',1,nd.getFullYear(),nd.getMonth(),nd.getDate(),function(errm3,answer3){
                                                if(errm3){
                                                    response.end(res,response.buildResponse(response.OK,'1'),callback);
                                                }
                                                score3 = answer3.answer.score;
                                                if(answer1<=answer2&&answer1<=answer3){
                                                    result.push_desc="我今天运程较低，一定要换个旺运程的颜色。"
                                                    var info = new userInfo();
                                                    info.uid = uid;
                                                    dboper.getUserBaseInfo(info,function (errm0){
                                                        if (errm0) {
                                                            response.end(res,response.buildResponse(response.OK,'1'),callback);
                                                        }
                                                        var year_star = parseInt(info["flystar"].charAt(2));
                                                        var sex = info.sex;
                                                        var day_star = user.getDayStar(new Date());
                                                        //男女运数区别
                                                        if(sex == 0){
                                                            day_star = user.getNvYun(day_star);
                                                        }
                                                        result.color = colour_json[sex][1][year_star-1];
                                                        if(day_star == result.color){
                                                            result.color = 0;
                                                            result.push_desc="我今天运程较低，已经将颜色换成旺运程的颜色了。"
                                                        }
                                                        response.end(res,response.buildResponse(response.OK,result),callback);
                                                    });
                                                }else if(answer2<=answer3&&answer2<=answer3){
                                                    result.push_desc="我今天财运较低，一定要换个旺财运的颜色。"
                                                    var info = new userInfo();
                                                    info.uid = uid;
                                                    dboper.getUserBaseInfo(info,function (errm0){
                                                        if (errm0) {
                                                            response.end(res,response.buildResponse(response.OK,'1'),callback);
                                                        }
                                                        var year_star = parseInt(info["flystar"].charAt(2));
                                                        var sex = info.sex;
                                                        var day_star = user.getDayStar(new Date());
                                                        //男女运数区别
                                                        if(sex == 0){
                                                            day_star = user.getNvYun(day_star);
                                                        }
                                                        result.color = colour_json[sex][2][year_star-1];
                                                        if(day_star == result.color){
                                                            result.color = 0;
                                                            result.push_desc="我今天财运较低，已经将颜色换成旺财运的颜色了。"
                                                        }
                                                        response.end(res,response.buildResponse(response.OK,result),callback);
                                                    });
                                                }else{
                                                    result.push_desc="我今天桃花较低，一定要换个旺桃花的颜色。"
                                                    var info = new userInfo();
                                                    info.uid = uid;
                                                    dboper.getUserBaseInfo(info,function (errm0){
                                                        if (errm0) {
                                                            response.end(res,response.buildResponse(response.OK,'1'),callback);
                                                        }
                                                        var year_star = parseInt(info["flystar"].charAt(2));
                                                        var sex = info.sex;
                                                        var day_star = user.getDayStar(new Date());
                                                        //男女运数区别
                                                        if(sex == 0){
                                                            day_star = user.getNvYun(day_star);
                                                        }
                                                        result.color = colour_json[sex][3][year_star-1];
                                                        if(day_star == result.color){
                                                            result.color = 0;
                                                            result.push_desc="我今天桃花较低，已经将颜色换成旺桃花的颜色了。"
                                                        }
                                                        response.end(res,response.buildResponse(response.OK,result),callback);
                                                    });
                                                }
                                            });
                                        }

                                    });
                                }
                            });
                        }else if(tiplist[num]=="sf"){

                        }else if(tiplist[num]=="xm"){
                            result.push_desc="心里有事总犯嘀咕，不如拿仙妙预测一下。就是太准了！必须要做好心里准备呀！";
                            response.end(res,response.buildResponse(response.OK,result),callback);
                        }else if(tiplist[num]=="zz"){

                        }else if(tiplist[num]=="zr"){
                            var zrlist = ["做事","搬家","求财","开业","约会","会友","出行","面试"];
                            var zrnum=Math.floor(Math.random()*(zrlist.length-1));
                            var zrtype=zrlist[zrnum];
                            var select_date_type = zrnum;
                            var days_type = 0;
                            analysis.getSelectDate(uid,select_date_type,days_type,function(date){
//                                result.date = date;
                                if(date.length){
                                    date.sort(function(a,b){
                                        var m1=parseInt(a.split("/")[1]);
                                        var m2=parseInt(b.split("/")[1]);
                                        if(m1< m2){
                                            return 1;
                                        }
                                        return 0;
                                    })
                                    var maxMonth=parseInt(date[0].split("/")[1]);
                                    date.sort(function(a,b){
                                        var m1=parseInt(a.split("/")[1]);
                                        var m2=parseInt(b.split("/")[1]);
                                        var d1=parseInt(a.split("/")[2]);
                                        var d2=parseInt(b.split("/")[2]);
                                        if(m1<maxMonth||m2<maxMonth){
                                            return 0;
                                        }
                                        if(d1 < d2){
                                            return 1;
                                        }
                                        return 0;
                                    })
                                    result.push_desc = "10天内，我"+zrtype+"最好的日子是"+date[0]+"，好机会别错过了。";
//                                    result.date = date.splice(1);
                                }else{
                                    result.push_desc = "10天内，没有适合我"+zrtype+"的日子。";
                                }
                                response.end(res,response.buildResponse(response.OK,result),callback);
                            });
                        }else if(tiplist[num]=="pp"){
                            result.push_desc="做事谈感情可要看看搭不搭，要是不搭也别让对方知道，怪尴尬的。";
                            response.end(res,response.buildResponse(response.OK,result),callback);
                        }else if(tiplist[num]=="addhaoyou"){
                            result.push_desc="多加好友就有机会多收福，多好运，还不快加。";
                            response.end(res,response.buildResponse(response.OK,result),callback);
                        }
                    }
                }
            })
        }
    });
};