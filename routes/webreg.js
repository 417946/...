var crypto = require('crypto');
var db = require('./mysql/dboperator')
var mysqlClient = require('./mysql/mysqlclient.js')
var tools = require('./tools/tools')
var user = require('./user.js');
var reg_notice = require('./reg_notice.js');
var consts = require('./util/consts');
var analysis = require('./module/analysis');
var jsconverter = require('./tools/calendar-converter.js');
var converter = new jsconverter();


//测试函数，用于生成轴向数据
var aList = ['中央','正东','东北','正北','西北','正西','西南','正南','东南'];
var sexList = ['女','男'];
var tgList = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var clockList = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var gz = ["甲子","乙丑","丙寅","丁卯","戊辰","己巳","庚午","辛未","壬申","癸酉","甲戌","乙亥","丙子","丁丑","戊寅","己卯","庚辰","辛巳","壬午","癸未","甲申","乙酉","丙戌","丁亥","戊子","己丑","庚寅","辛卯","壬辰","癸巳","甲午","乙未","丙申","丁酉","戊戌","己亥","庚子","辛丑","壬寅","癸卯","甲辰","乙巳","丙午","丁未","戊申","己酉","庚戌","辛亥","壬子","癸丑","甲寅","乙卯","丙辰","丁巳","戊午","己未","庚申","辛酉","壬戌","癸亥"];
var sjStr = ['木', '火', '金', '水', '土'];
var strFlyStarWx = [ '衰', '中','旺'];




//用户企图获取注册页面
exports.reg = function (req, res) {
    console.log("Recieve webReg get Message!");
	res.render('reg', { title: '用户注册' });
};
exports.onPostReg1 = function(req,res){
	//解析生日
	var strDate = req.body['birthday'];
	var result = /(\d+).*?(\d+).*?(\d+).*?(\d+)\:(\d+)/g.exec(strDate);
	//
	res.end(converter.lunar2solar(new Date(parseInt(result[1]),parseInt(result[2])-1,parseInt(result[3])),false));
}


//当用户点击注册按钮时被触发
exports.onPostReg = function (req, res) {
    console.log("Recieve webReg Post Message!");

    console.log(req.body);

	//解析生日
	var strDate = req.body['birthday'];
	var result = /(\d+).*?(\d+).*?(\d+).*?(\d+)\:(\d+)/g.exec(strDate);
	
	//测试功能
	var reqData = {
		name:			req.body['username'],
		sex:			parseInt(req.body['sex']),
		registAddress:	parseInt(req.body['registaddress'])-1,
		birthAddress:	parseInt(req.body['birthaddress'])-1,
		year:			parseInt(result[1]),
		month:			parseInt(result[2]),
		day:			parseInt(result[3]),
		clock:			parseInt(result[4])
	}

	var userInfo = user.getUserInfo(reqData);

	reqData.clock = (reqData.clock + 1) % 24;
	reqData.clock = Math.floor(reqData.clock / 2);


    //查询数据库，获得吉凶值
	db.getUserLastJxScore(userInfo, function (jxScore) {
        //  fix userInfo.wxBaseScore
        /*
        特殊规定如下：1、3颗财星，不足80分，统一调整80分。
              2、4颗财星，不足85分，统一调整85分。
              3、5颗财星，不足92分，统一调整92分。
        */

        var wealth_stars = userInfo.wealth_stars;
        var wealth_stars_three_scores = 80;
        var wealth_stars_four_scores = 85;
        var wealth_stars_five_scores = 92;
        if(wealth_stars == 3){
            if(userInfo.wxBaseScore < wealth_stars_three_scores){
                userInfo.wxBaseScore = wealth_stars_three_scores;
            }
        }else if(wealth_stars == 4){
            if(userInfo.wxBaseScore < wealth_stars_four_scores){
                userInfo.wxBaseScore = wealth_stars_four_scores;
            }
        }else if(wealth_stars == 5){
            if(userInfo.wxBaseScore < wealth_stars_five_scores){
                userInfo.wxBaseScore = wealth_stars_five_scores;
            }
        }
        //userInfo.hightScore = (70 * (jxScore + userInfo.wxBaseScore)).toFixed(0);
        userInfo.hightScore = (((userInfo.xjStarScore/3)+userInfo.wxBaseScore)*70).toFixed(0);

        userInfo.yangSum=userInfo.yangSum1;
        userInfo.year_star=userInfo.nianyun;
        var r={};
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
            analysis.lastYearYC(userInfo,uuserInfo,function(desc){
                r.b=desc;
                analysis.lastTenYearYC(userInfo,uuserInfo,function(desc){
                    r.c=desc;
                    res.render('dateresult', {
                        title: '日期结果',
                        registAddress: aList[reqData.registAddress],			//注册地
                        birthAddress: aList[reqData.birthAddress],          //出生地
                        birthWS: (userInfo.birthWS > 0 ? "旺" : userInfo.birthWS < 0 ? "衰" : "平"),
                        sjWS: (userInfo.sjWS ? "旺" : "衰"),
                        scWS: (userInfo.scWS ? "旺" : "衰"),
                        username: reqData.name,                             //姓名
                        sex: sexList[reqData.sex],                               //性别
                        birthday: reqData.year + "年" + reqData.month + "月" + reqData.day + "日",       //生日
                        clock: clockList[reqData.clock],                                                //出生时辰
                        //干支
                        ngz: userInfo.ngz,
                        ygz: userInfo.ygz,
                        rgz: userInfo.rgz,
                        sgz: userInfo.sgz,
                        //运数
                        bigyun: userInfo.bigyun,
                        smallyun: userInfo.smallyun,
                        nianyun: userInfo.nianyun,
                        yueyun: userInfo.yueyun,
                        riyun: userInfo.riyun,
                        shiyun: userInfo.shiyun,
                        //太岁
                        niants: userInfo.niants,
                        yuets: userInfo.yuets,
                        rits: userInfo.rits + "日",
                        shits: userInfo.shits + "时",
                        //岁破
                        niansp: userInfo.niansp,
                        yuesp: userInfo.yuesp,
                        risp: userInfo.risp + "日",
                        shisp: userInfo.shisp + "时",
                        //星(月)数
                        starNum: userInfo.starNum,
                        //阳和数
                        yangSum1: userInfo.yangSum1,
                        yangSum2: userInfo.yangSum2,
                        yangSum3: userInfo.yangSum3,
                        //缺数
                        queNum: userInfo.queNum,

                        flystar: userInfo.flystar,
                        wealth_stars: userInfo.wealth_stars,
                        bwxNum: userInfo.bwxNum,
                        scwxNum: userInfo.scwxNum,
                        wwxNum: userInfo.wwxNum,
                        dwwxNum: userInfo.dwwxNum,
                        wxBaseScore: userInfo.wxBaseScore,
                        yuanWxScore: userInfo.yuanWxScore,
                        hightScore: userInfo.hightScore,
                        //基础助运分
                        baseZyScore: userInfo.baseZyScore,
                        //吉凶星分值
                        xjStarScore: userInfo.xjStarScore,
                        sjIndex: sjStr[userInfo.sjIndex],
                        flyStarWx: strFlyStarWx[userInfo.flyStarWx],
                        a: r.a,
                        b: r.b,
                        c: r.c
                    });
                })
            })
//            analysis.getYun4Yc(userInfo,reqData.sex==0?2:4,null,false,"yc",function(desc){
//                var d=new Date();
//                d.setYear(2014)
//                reg_notice.getCareer(uuserInfo,consts.TYPE_TIME.TYPE_TIME_THIS_YEAR,consts.TYPE_SCORE.TYPE_SCORE_WEALTH,d,function(level){
//                    reg_notice.getLuck(uuserInfo,consts.TYPE_TIME.TYPE_TIME_THIS_YEAR,consts.TYPE_SCORE.TYPE_SCORE_LUCK,d,function(luck){
//                        console.log("luck"+luck)
//                        r.b="一四年您运程"+luck+"，事业"+level+"，在6月左右，"+desc.replace("注意","易");
//
//                        //过去10年
//                        var ten1=[2008,2007,2006,2014,2013,2012,2011,2010,2009];
//                        var ten0=[2013,2014,2006,2007,2008,2009,2010,2011,2012];
//                        var highWaiStar=0;//取其余星五行分值(已考虑四季，出生地影响) 最高的一颗外飞星
//                        var tempHighValue=0;
//                        var waiStarList=[userInfo.bigyun,userInfo.smallyun,userInfo.yueyun,userInfo.riyun,userInfo.shiyun]
//                        for(var i in waiStarList){
//                            var temp=userInfo.wwxNum[waiStarList[i]-1];
//                            if(tempHighValue<temp){
//                                tempHighValue=temp;
//                                highWaiStar=waiStarList[i];
//                            }
//                        }
//                        analysis.getYun4Yc(userInfo,highWaiStar,highWaiStar,null,"yc",function(desc){
//                            var nian=userInfo.sex==0?ten0[highWaiStar-1]:ten1[highWaiStar-1];
//                            d.setYear(nian)
//                            reg_notice.getCareer2(uuserInfo,consts.TYPE_FIXATION.TYPE_FIXATION_LUCK_LAST_TEN_YEARS,consts.TYPE_SCORE.TYPE_SCORE_WEALTH,function(level){
//                                reg_notice.getLuck2(uuserInfo,consts.TYPE_FIXATION.TYPE_FIXATION_LUCK_LAST_TEN_YEARS,consts.TYPE_SCORE.TYPE_SCORE_LUCK,function(luck){
//                                    r.c="过去10年中，您的运程"+luck.level+"，事业"+level+"，在"+nian+"年，"+desc.replace("注意","易");
//                                   // res.json(r);
//                                    res.render('dateresult', {
//                                        title: '日期结果',
//                                        registAddress: aList[reqData.registAddress],			//注册地
//                                        birthAddress: aList[reqData.birthAddress],          //出生地
//                                        birthWS: (userInfo.birthWS > 0 ? "旺" : userInfo.birthWS < 0 ? "衰" : "平"),
//                                        sjWS: (userInfo.sjWS ? "旺" : "衰"),
//                                        scWS: (userInfo.scWS ? "旺" : "衰"),
//                                        username: reqData.name,                             //姓名
//                                        sex: sexList[reqData.sex],                               //性别
//                                        birthday: reqData.year + "年" + reqData.month + "月" + reqData.day + "日",       //生日
//                                        clock: clockList[reqData.clock],                                                //出生时辰
//                                        //干支
//                                        ngz: userInfo.ngz,
//                                        ygz: userInfo.ygz,
//                                        rgz: userInfo.rgz,
//                                        sgz: userInfo.sgz,
//                                        //运数
//                                        bigyun: userInfo.bigyun,
//                                        smallyun: userInfo.smallyun,
//                                        nianyun: userInfo.nianyun,
//                                        yueyun: userInfo.yueyun,
//                                        riyun: userInfo.riyun,
//                                        shiyun: userInfo.shiyun,
//                                        //太岁
//                                        niants: userInfo.niants,
//                                        yuets: userInfo.yuets,
//                                        rits: userInfo.rits + "日",
//                                        shits: userInfo.shits + "时",
//                                        //岁破
//                                        niansp: userInfo.niansp,
//                                        yuesp: userInfo.yuesp,
//                                        risp: userInfo.risp + "日",
//                                        shisp: userInfo.shisp + "时",
//                                        //星(月)数
//                                        starNum: userInfo.starNum,
//                                        //阳和数
//                                        yangSum1: userInfo.yangSum1,
//                                        yangSum2: userInfo.yangSum2,
//                                        yangSum3: userInfo.yangSum3,
//                                        //缺数
//                                        queNum: userInfo.queNum,
//
//                                        flystar: userInfo.flystar,
//                                        wealth_stars: userInfo.wealth_stars,
//                                        bwxNum: userInfo.bwxNum,
//                                        scwxNum: userInfo.scwxNum,
//                                        wwxNum: userInfo.wwxNum,
//                                        dwwxNum: userInfo.dwwxNum,
//                                        wxBaseScore: userInfo.wxBaseScore,
//                                        yuanWxScore: userInfo.yuanWxScore,
//                                        hightScore: userInfo.hightScore,
//                                        //基础助运分
//                                        baseZyScore: userInfo.baseZyScore,
//                                        //吉凶星分值
//                                        xjStarScore: userInfo.xjStarScore,
//                                        sjIndex: sjStr[userInfo.sjIndex],
//                                        flyStarWx: strFlyStarWx[userInfo.flyStarWx],
//                                        a: r.a,
//                                        b: r.b,
//                                        c: r.c
//                                    });
//                                })
//                            })
//                        });
//                    })
//                })
//            });
        })
	});
};

exports.onPostHightScore = function (uinfo,cb) {
	//解析生日
	var strDate = uinfo.birthday;
	//测试功能
	var reqData = {
		name:			uinfo.username,
		sex:			parseInt(uinfo.sex),
		registAddress:	0,
		birthAddress:	0,
		year:			parseInt(strDate.substr(0,4)),
		month:			parseInt(strDate.substr(4,2)),
		day:			parseInt(strDate.substr(6,2)),
		clock:			parseInt(strDate.substr(8,2))
	}

	var userInfo = user.getUserInfo(reqData);
	reqData.clock = (reqData.clock + 1) % 24;
	reqData.clock = Math.floor(reqData.clock / 2);


    //查询数据库，获得吉凶值
	db.getUserLastJxScore(userInfo, function (jxScore) {
        //  fix userInfo.wxBaseScore
        /*
        特殊规定如下：1、3颗财星，不足80分，统一调整80分。
              2、4颗财星，不足85分，统一调整85分。
              3、5颗财星，不足92分，统一调整92分。
        */

        var wealth_stars = userInfo.wealth_stars;
        var wealth_stars_three_scores = 80;
        var wealth_stars_four_scores = 85;
        var wealth_stars_five_scores = 92;
        if(wealth_stars == 3){
            if(userInfo.wxBaseScore < wealth_stars_three_scores){
                userInfo.wxBaseScore = wealth_stars_three_scores;
            }
        }else if(wealth_stars == 4){
            if(userInfo.wxBaseScore < wealth_stars_four_scores){
                userInfo.wxBaseScore = wealth_stars_four_scores;
            }
        }else if(wealth_stars == 5){
            if(userInfo.wxBaseScore < wealth_stars_five_scores){
                userInfo.wxBaseScore = wealth_stars_five_scores;
            }
        }
        //userInfo.hightScore = (70 * (jxScore + userInfo.wxBaseScore)).toFixed(0);
        var hightScore = (((userInfo.xjStarScore/3)+userInfo.wxBaseScore)*70).toFixed(0);
        cb(hightScore);
	});
};

//当用户点击注册按钮时被触发
exports.onFlystar = function (req, res) {
    console.log(JSON.stringify(req.query))
    //解析生日
    var strDate = req.body['birthday'];
    var result = /(\d+).*?(\d+).*?(\d+).*?(\d+)\:(\d+)/g.exec(strDate);

    //测试功能
    var reqData = {
        sex:			parseInt(req.body['sex']),
        birthAddress:	parseInt(req.body['birthaddress'])-1,
        year:			parseInt(result[1]),
        month:			parseInt(result[2]),
        day:			parseInt(result[3]),
        clock:			parseInt(result[4])
    }

    var userInfo = user.getUserInfo(reqData);
    var a={
        sjWS: (userInfo.sjWS ? "旺" : "衰"),
        flystar: userInfo.flystar
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(a));
}