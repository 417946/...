/**
 * Created by zoey on 15-2-16.
 */
var db = require('./mysql/dboperator');
var userInfo = require('./userInfo.js').userInfo;
var user = require('./user.js');
var analysis = require('./module/analysis');
var alteration_index = require('../config/alteration_index');
var fixation_index = require('../config/fixation_index');
var scores_new = require('../config/scores_new');
var consts = require('./util/consts');
var response = require('./common/response');
/**
 * 男女三件事
 * @param req
 * @param res
 */
exports.onRegNotice = function(req,res){
    //解析生日
    var strDate = req.query['birthday'];
    var callback=req.query.callback;
    console.log(strDate)
    var result = /(\d+).*?(\d+).*?(\d+).*?(\d+)\:(\d+)/g.exec(strDate);
    //测试功能
    var reqData = {
        sex:			parseInt(req.query['sex']),
        birthAddress:	parseInt(req.query['birthaddress'])-1,
        year:			parseInt(result[1]),
        month:			parseInt(result[2]),
        day:			parseInt(result[3]),
        clock:			parseInt(result[4])
    }

    var userInfo = user.getUserInfo(reqData);
    var flag=true;
    var r={}
    user.getSuxie(userInfo,function(ss){
        r.s=ss;
        while(flag){
            if(userInfo.flystar){
                flag=false;
                userInfo.yangSum=userInfo.yangSum1;
                userInfo.year_star=userInfo.nianyun;
                db.getBaseXg(userInfo,function(){
//                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    r.a="您是一位"+userInfo.baseXg;
                    console.log(JSON.stringify(userInfo))
                    var info={
                        sex:reqData.sex,
                        birthAddress:reqData.birthAddress,
                        birthday:result[1]+result[2]+result[3]+result[4]
                    }
                    //去年
                    var uuserInfo = analysis.buildUserInfo(info);
                    analysis.lastYearYC(userInfo,uuserInfo,function(desc) {
                        r.b = desc;
                        analysis.lastTenYearYC(userInfo, uuserInfo, function (desc) {
                            r.c = desc;
                            response.end(res,response.buildResponse(response.OK,r),callback);
//                        res.json(r);
                        })
                    })
//                analysis.getYun4Yc(userInfo,reqData.sex==0?2:4,null,false,"yc",function(desc){
//                    var d=new Date();
//                    d.setYear(2014)
//                    exports.getCareer(uuserInfo,consts.TYPE_TIME.TYPE_TIME_THIS_YEAR,consts.TYPE_SCORE.TYPE_SCORE_WEALTH,d,function(level){
//                        exports.getLuck(uuserInfo,consts.TYPE_TIME.TYPE_TIME_THIS_YEAR,consts.TYPE_SCORE.TYPE_SCORE_WEALTH,d,function(luck){
//                            console.log("luck"+luck)
//                            r.b="一四年您运程"+luck+"，事业"+level+"，在6月左右，"+desc.replace("注意","易");
//
//                            //过去10年
//                            var ten1=[2008,2007,2006,2014,2013,2012,2011,2010,2009];
//                            var ten0=[2013,2014,2006,2007,2008,2009,2010,2011,2012];
//                            var highWaiStar=0;//取其余星五行分值(已考虑四季，出生地影响) 最高的一颗外飞星
//                            var tempHighValue=0;
//                            var waiStarList=[userInfo.bigyun,userInfo.smallyun,userInfo.yueyun,userInfo.riyun,userInfo.shiyun]
//                            for(var i in waiStarList){
//                                var temp=userInfo.wwxNum[waiStarList[i]-1];
//                                if(tempHighValue<temp){
//                                    tempHighValue=temp;
//                                    highWaiStar=waiStarList[i];
//                                }
//                            }
//                            analysis.getYun4Yc(userInfo,highWaiStar,highWaiStar,null,"yc",function(desc){
//                                var nian=userInfo.sex==0?ten0[highWaiStar-1]:ten1[highWaiStar-1];
//                                d.setYear(nian)
//                                exports.getCareer2(uuserInfo,consts.TYPE_FIXATION.TYPE_FIXATION_LUCK_LAST_TEN_YEARS,consts.TYPE_SCORE.TYPE_SCORE_WEALTH,function(level){
//                                    exports.getLuck2(uuserInfo,consts.TYPE_FIXATION.TYPE_FIXATION_LUCK_LAST_TEN_YEARS,consts.TYPE_SCORE.TYPE_SCORE_LUCK,function(luck){
//                                        r.c="过去10年中，您的运程"+luck.level+"，事业"+level+"，在"+nian+"年，"+desc.replace("注意","易");
//                                        res.json(r);
//                                    })
//                                })
//                            });
//                        })
//                    })
//                });
                })
            }
        }
    });
};
exports.onGetSuxie = function(req,res){
    //解析生日
    var strDate = req.query['birthday'];
    var callback=req.query.callback;
    console.log(strDate)
    var result = /(\d+).*?(\d+).*?(\d+).*?(\d+)\:(\d+)/g.exec(strDate);
    //测试功能
    var reqData = {
        sex:			parseInt(req.query['sex']),
        birthAddress:	parseInt(req.query['birthaddress'])-1,
        year:			parseInt(result[1]),
        month:			parseInt(result[2]),
        day:			parseInt(result[3]),
        clock:			parseInt(result[4])
    }

    var userInfo = user.getUserInfo(reqData);
    var r={}
    user.getSuxie1(userInfo,function(ss){
        r.s=ss;
        response.end(res,response.buildResponse(response.OK,r),callback);
    });
};
exports.onGetSuxieByFlystar = function(req,res){
    var callback=req.query.callback;
    var date=new Date();
    var nianyun = user.getYearStar(date);
    var yueyun = user.getMonthStar(date);
    var riyun = user.getDayStar(date);
    var shiyun = user.getClockStar(date);

    var nums=[[6,7,8,9,1,2,3,4,5],
    [7,8,9,1,2,3,4,5,6],
    [8,9,1,2,3,4,5,6,7],
    [9,1,2,3,4,5,6,7,8],
    [1,2,3,4,5,6,7,8,9],
    [2,3,4,5,6,7,8,9,1],
    [3,4,5,6,7,8,9,1,2],
    [4,5,6,7,8,9,1,2,3],
    [5,6,7,8,9,1,2,3,4]];

    var yearStar = nums[nianyun-1][req.query['num1']-1];
    var monthStar = nums[yueyun-1][req.query['num2']-1];
    var dayStar = nums[riyun-1][req.query['num3']-1];
    var hourStar = nums[shiyun-1][req.query['num4']-1];
    var sex = req.query['sex'];
    //测试功能
    user.getSuxie2(yearStar,monthStar,dayStar,hourStar,sex,function(ss){
        response.end(res,response.buildResponse(response.OK,ss),callback);
    });
};
exports.onFriendJy = function(req,res){
    //解析生日
    var strDate = req.query['birthday'];
    var callback=req.query.callback;
    console.log(strDate)
    var result = /(\d+).*?(\d+).*?(\d+).*?(\d+)\:(\d+)/g.exec(strDate);
    //测试功能
    var reqData = {
        sex:			parseInt(req.query['sex']),
        birthAddress:	0,
        year:			parseInt(result[1]),
        month:			parseInt(result[2]),
        day:			parseInt(result[3]),
        clock:			parseInt(result[4])
    }

    var userInfo = user.getUserInfo(reqData);
    if(userInfo.flystar){
        var push_message = [];
        //  get push for index
        var today_energy = analysis.getScore(userInfo,consts.TYPE_TIME.TYPE_TIME_TODAY,consts.TYPE_SCORE.TYPE_SCORE_ENERGY,new Date());
        var today_luck = analysis.getScore(userInfo,consts.TYPE_TIME.TYPE_TIME_TODAY,consts.TYPE_SCORE.TYPE_SCORE_LUCK,new Date());
        if(today_energy[0] < 60){
            push_message.push("今日能量较低，请速速补种福田，增幅转运。");
        }
        else if(today_luck[0] < 60){
            push_message.push("今日运程较低，请速速补种福田，增幅转运。");
        }
        else if(today_energy[0] > 85){
            push_message.push("今日能量较高，可以为友送福。");
        }
        if(0 == push_message.length){
            analysis.getLuck3(userInfo,consts.TYPE_TIME.TYPE_TIME_TODAY,consts.TYPE_SCORE.TYPE_SCORE_LUCK,new Date(),function(answer){
                push_message.push(answer);
            });
        }
        push_message.push(today_energy[0]);
        res.end(JSON.stringify(push_message));
    }
};
exports.getCareer=function(info,time_type,score_type,date,cb){
    var scores = analysis.getScore(info,time_type,score_type,date);
    var career_socres = scores[0];
    var career_socres_previous = scores[1];
    var career_index_rows = alteration_index[0][9];
    var career_index_row;
    career_socres = career_socres>98?98:career_socres;
    for(var i = 0; i < career_index_rows.length; ++i){
        if(career_index_rows.length){
            var range = career_index_rows[i].range;
            var range_array = range.split('-');
            if(Math.floor(career_socres) <= parseInt(range_array[0]) && Math.floor(career_socres) >=  parseInt(range_array[1])){
                career_index_row = career_index_rows[i];
                cb(career_index_row.level)
                break;
            }
        }
    }
}
exports.getLuck=function(info,time_type,score_type,date,cb) {
    var scores = analysis.getScore(info, time_type, score_type, date);
    var luck_socres = scores[0];
    var luck_socres_previous = scores[1];
    var luck_index_rows = alteration_index[0][0];
    var luck_index_row;
    luck_socres = luck_socres > 98 ? 98 : luck_socres;
    for (var i = 0; i < luck_index_rows.length; ++i) {
        if (luck_index_rows.length) {
            var range = luck_index_rows[i].range;
            var range_array = range.split('-');
            if (Math.floor(luck_socres) <= parseInt(range_array[0]) && Math.floor(luck_socres) >= parseInt(range_array[1])) {
                luck_index_row = luck_index_rows[i];
                cb(luck_index_row.level)
                break;
            }
        }
    }
}
//过去十年运程
exports.getLuck2=function(info,type,score_type,cb) {
    var luck_in_the_past_index_rows = fixation_index[0][type];
    var currBigStar=user.getBigStar(new Date());
    var currSmallStar=user.getSmallStar(new Date());
    //男女运数区别
    if(info.sex == 0){
        currBigStar = user.getNvYun(currBigStar);
        currSmallStar = user.getNvYun(currSmallStar);
    }
    var score_luck_in_the_past = 0;
    var scores_class;
    var all_scores = scores_new[score_type][info.sex][currSmallStar - 1];
    console.log("currBigStar="+currBigStar)
    for(var i = 0; i < all_scores.length; ++i){
        if(all_scores[i].beforstar == currBigStar){
            scores_class = all_scores[i];
            break;
        }
    }
    console.log("info.flyStarWx="+info.flyStarWx)
    if(consts.TYPE_SCORE.TYPE_SCORE_LUCK == score_type ||
        consts.TYPE_SCORE.TYPE_SCORE_WORK == score_type){
        if(1 == info.flyStarWx){
            scores = scores_class.scores;

        }else if(0 == info.flyStarWx){
            scores = scores_class.scores2;

        }else if(2 == info.flyStarWx){
            scores = scores_class.scores3;

        }
    }else{
        scores = scores_class.scores;

    }
    console.log(JSON.stringify(scores))
    console.log("info.nianyun="+info.nianyun)
    score_luck_in_the_past = scores[info.nianyun -1];
    console.log("score_luck_in_the_past="+JSON.stringify(score_luck_in_the_past))
    score_luck_in_the_past = score_luck_in_the_past>98?98:score_luck_in_the_past;
    for(var i = 0; i < luck_in_the_past_index_rows.length; ++i){
        var range = luck_in_the_past_index_rows[i].range;
        var range_array = range.split('-');
        var range_low = parseInt(range_array[1]);
        var range_high = parseInt(range_array[0]);
        if((score_luck_in_the_past < (range_high) && score_luck_in_the_past >= (range_low))||(score_luck_in_the_past < (range_low) && score_luck_in_the_past >= (range_high))){
            var answer = {};
            answer.score = score_luck_in_the_past + "分。";
            answer.level = luck_in_the_past_index_rows[i].level;
            answer.desc = luck_in_the_past_index_rows[i].describe;
            cb(answer);
            break;
        }
    }
}
//过去十年事业
exports.getCareer2=function(info,time_type,score_type,cb){
    var currBigStar=user.getBigStar(new Date());
    var currSmallStar=user.getSmallStar(new Date());
    //男女运数区别
    if(info.sex == 0){
        currBigStar = user.getNvYun(currBigStar);
        currSmallStar = user.getNvYun(currSmallStar);
    }
    var scores_class;
    var all_scores = scores_new[score_type][info.sex][currSmallStar - 1];
    console.log("currBigStar="+currBigStar)
    for(var i = 0; i < all_scores.length; ++i){
        if(all_scores[i].beforstar == currBigStar){
            scores_class = all_scores[i];
            break;
        }
    }
    if(consts.TYPE_SCORE.TYPE_SCORE_LUCK == score_type ||
        consts.TYPE_SCORE.TYPE_SCORE_WORK == score_type){
        if(1 == info.flyStarWx){
            scores = scores_class.scores;

        }else if(0 == info.flyStarWx){
            scores = scores_class.scores2;

        }else if(2 == info.flyStarWx){
            scores = scores_class.scores3;

        }
    }else{
        scores = scores_class.scores;

    }
    career_socres = scores[info.nianyun -1];
    console.log("career_socres="+career_socres)
    var career_index_rows = alteration_index[0][9];
    var career_index_row;
    career_socres = career_socres>98?98:career_socres;
    for(var i = 0; i < career_index_rows.length; ++i){
        if(career_index_rows.length){
            var range = career_index_rows[i].range;
            var range_array = range.split('-');
            if(Math.floor(career_socres) <= parseInt(range_array[0]) && Math.floor(career_socres) >=  parseInt(range_array[1])){
                career_index_row = career_index_rows[i];
                cb(career_index_row.level)
                break;
            }
        }
    }
}