// mysql CRUD
var operater = module.exports;
var todayInfo = require('../todayInfo.js');
var log = require('../../common').log;
var mysqlClient = require('./mysqlclient').init();
var user = require("../user.js");
var common = require("../../common.js");


var teststr = "{ \"a\":\"test value\",\"b\":32}";
var testval = JSON.parse(teststr);


function fixNum(maxNum, baseNum) {
    return ((8 * baseNum - 64) / 114 + maxNum - 8).toFixed(1);
}

function fixStar(star) {
    if (star > 9) {
        star = 1;
    }
    if (star < 1) {
        star = 9;
    }
    return star;
}

operater.addUser = function(info,cb){
    var sql = "insert into user_table(user_id, openid,name, sex, birthday,staryear, birthAddress, regAddress,regTime,passwd,viplevel,flystar,sjWs,birthWs,yueNum,yangSum,clockWs,gz,ts,sp,queNum,sjIndex,phone,email) values('"
        + info.uid + "','" + (info.openid ? info.openid : "openid") + "','" + info.name + "'," + info.sex + ",'" + info.birthday + "','" + user.getStarYear(new Date(info.birthday.substr(0, 4) + "/" + info.birthday.substr(4, 2) + "/" + info.birthday.substr(6, 2))).substr(2, 2) + "'," + info.birthAddress + ","
        + info.registAddress + ",'" + info.regTime + "','" + info.password + "'," + info.vipLevel + ",'" + info.flystar + "'," + (info.sjWS ? "1" : "0") + "," + info.birthWS + ","
        + info.starNum + "," + info.yangSum + "," + (info.clockWS ? "1" : "0") + ",'" + info.gz + "','" + info.ts + "','" + info.sp + "','" + info.queNum + "'," + info.sjIndex + ",'" + info.phone + "','" + info.email + "');";

    console.log(sql);

    mysqlClient.insert(sql, null, function (err) {
        var sql1 = "insert into  user_detail_table(user_id) values ('"+info.uid+"')";
        mysqlClient.update(sql1, null, function (err1) {
            if(cb){
                cb.call(err1);
            }
        });
	});
}

operater.ModifyUser = function (info, cb) {
    var values = [info.name, info.sex, info.birthday, user.getStarYear(new Date(info.birthday.substr(0, 4) + "/" + info.birthday.substr(4, 2) + "/" + info.birthday.substr(6, 2))).substr(2, 2),
        info.birthAddress, info.password, info.flystar, (info.sjWS ? "1" : "0"), info.birthWS, info.starNum, info.yangSum, (info.clockWS ? "1" : "0"), info.gz, info.ts, info.sp, info.queNum, info.sjIndex, info.uid];
    var sql = "update user_table set name= ? ,sex= ? ,birthday= ? ,staryear= ? ,birthAddress= ? ,passwd= ? ,flystar= ? ,sjWs= ? ,birthWs= ? ,yueNum= ? ,yangSum= ? ,clockWs= ? ,gz= ? ,ts= ? ,sp= ?,queNum= ? ,sjIndex= ? where user_id= ?;"

        //"(user_id, name, sex, birthday,staryear, birthAddress, regAddress,regTime,passwd,viplevel,flystar,sjWs,birthWs,yueNum,yangSum,clockWs,gz,ts,sp,queNum,sjIndex) values('"+ info.sjIndex + ");"
        //+ info.uid + "','" + info.name + "'," + info.sex + ",'" + info.birthday + "','" + user.getStarYear(new Date(info.birthday.substr(0, 4) + "/" + info.birthday.substr(4, 2) + "/" + info.birthday.substr(6, 2))).substr(2, 2) + "'," + info.birthAddress + ","
        //+ info.registAddress + ",'" + info.regTime + "','" + info.password + "'," + info.vipLevel + ",'" + info.flystar + "'," + (info.sjWS ? "1" : "0") + "," + info.birthWS + ","
        //+ info.starNum + "," + info.yangSum + "," + (info.clockWS ? "1" : "0") + ",'" + info.gz + "','" + info.ts + "','" + info.sp + "','" + info.queNum + "'," + info.sjIndex + ");";

    mysqlClient.update(sql, values, function (err) {
        if (err) {
            console.log(sql);
            console.log(err);
        }
        if (cb) {
            cb.call(err);
        }
    });
}

operater.getMaxId = function (cb) {
    var sql = "select max(cast(user_id as signed)) as curId from user_table;";
    mysqlClient.query(sql, null, function (err, res) {
        if (err) {
            console.log("Error ocuor when select max(user_id) from user_table;");
            console.log(err);
        }
        else {
            var curId = 0;
            if (res[0]["curId"]) {
                curId = parseInt(res[0]["curId"]);
            }
            cb.call(null,err, curId);
                
        }
    });
}

operater.userLogin = function (info, cb) {
    var sql = "select * from user_table where user_id='" + info.uid + "' and passwd='" + info.password + "';";
    //log(sql);
    mysqlClient.query(sql, null, function (err, res) {
        if (err) {
            console.log("Error ocuor when select userinfo from user_table;");
            console.log(err);
            cb.call(null, err);
        }
        else {
            if (res.length <= 0) {
                cb.call(null, "用户名密码错误");
            }
            else {
                //info.name = res[0]['name'];
                //info.sex = res[0]['sex'];
                //info.birthday = res[0]['birthday'];
                //info.regTime = res[0]['regTime'];
                //info.registAddress = res[0]['regAddress'];
                //info.birthAddress = res[0]['birthAddress'];
                //log("user login who's user_id = " + info.uid);
                cb.call(null, false);
            }
        }
    });
}


operater.getUserInfo = function(info, cb){
    var sql = "select * from user_table where user_id='" + info.uid + "';";
    //log(sql);
    mysqlClient.query(sql, null, function (err, res) {
        if (err) {
            console.log("Error:1 ocuor when select userinfo from user_table;");
            console.log(err);
            cb.call(null, err);
        }
        else {
            if (res.length <= 0) {
                cb.call(null, "没有这个账号");
            }
            else {
                info.name = res[0]['name'];
                info.sex = res[0]['sex'];
                info.birthday = res[0]['birthday'];
                info.regTime = res[0]['regTime'];
                info.registAddress = res[0]['regAddress'];
                info.birthAddress = res[0]['birthAddress'];
                info.vipLevel = res[0]['viplevel'];
                info.flystar = res[0]['flystar'];
                info.birthWS = res[0]['birthWs'];
                info.sjWS = res[0]['sjWs'];
                info.clockWS = res[0]['clockWs'];
                info.gz = res[0]['gz'];
                info.ts = res[0]['ts'];
                info.sp = res[0]['sp'];
                info.starNum = res[0]['starNum'];
                info.yangSum = res[0]['yangSum'];
                info.queNum = res[0]['queNum'];
                info.login_count = res[0]['login_count'];
                info.colour = res[0]['colour'];
                info.bless = res[0]['bless'];
                info.lotus = res[0]['lotus'];
                info.day_star = user.getDayStar(new Date());
                info.year_star = parseInt(info["flystar"].charAt(2));

                //注册信息获取完毕，获取其他信息
                operater.getBaseNum(info, cb);
            }
        }
    });
}

operater.getUserBaseInfo = function(info, cb){
    var sql = "select * from user_table where user_id='" + info.uid + "';";
    mysqlClient.query(sql, null, function (err, res) {
        if (err) {
            console.log("Error:1 ocuor when select userinfo from user_table;");
            console.log(err);
            cb.call(null, err);
        }
        else {
            if (res.length <= 0) {
                cb.call(null, "没有这个账号");
            }
            else {
                info.name = res[0]['name'];
                info.sex = res[0]['sex'];
                info.birthday = res[0]['birthday'];
                info.regTime = res[0]['regTime'];
                info.registAddress = res[0]['regAddress'];
                info.birthAddress = res[0]['birthAddress'];
                info.vipLevel = res[0]['viplevel'];
                info.flystar = res[0]['flystar'];
                info.birthWS = res[0]['birthWs'];
                info.sjWS = res[0]['sjWs'];
                info.clockWS = res[0]['clockWs'];
                info.gz = res[0]['gz'];
                info.ts = res[0]['ts'];
                info.sp = res[0]['sp'];
                info.starNum = res[0]['starNum'];
                info.yangSum = res[0]['yangSum'];
                info.queNum = res[0]['queNum'];
                info.login_count = res[0]['login_count'];
                info.lotus = res[0]['lotus'];
                info.bless = res[0]['bless'];
                info.colour = res[0]['colour'];
                cb(err);
            }
        }
    });
}

operater.getFlyStarsByUID = function(uid,cb){
    var sql = "select flystar from user_table where user_id='" + uid + "';";
    mysqlClient.query(sql, null, function (err, res) {
        if (err) {
            console.log("Error:1 ocuor when select flystar from user_table;");
            console.log(err);
            cb.call(null, err);
        }
        else {
            if (res.length <= 0) {
                cb.call(null, "没有这个账号");
            }
            else {
                cb(err,res[0]['flystar']);
            }
        }
    });
};

//获得基础数据
operater.getBaseNum = function(info,cb){
    var flystar = info.flystar;

    var key = "basenum1";
    if (info.birthWS > 0  && info.sjWS && info.clockWS) {
        key = "basenum1";
    }
    else if (info.birthWS > 0 && info.sjWS && !info.clockWS) {
        key = "basenum2";
    }
    else if (!info.birthWS > 0 && !info.sjWS && info.clockWS) {
        key = "basenum3";
    }
    else if (!info.birthWS > 0 && !info.sjWS && !info.clockWS) {
        key = "basenum4";
    }
    else if (!info.birthWS > 0 && info.sjWS && info.clockWS) {
        key = "basenum5";
    }
    else if (!info.birthWS > 0 && info.sjWS && !info.clockWS) {
        key = "basenum6";
    }
    else if (info.birthWS > 0 && !info.sjWS && info.clockWS) {
        key = "basenum7";
    }
    else if (info.birthWS && !info.sjWS && !info.clockWS) {
        key = "basenum8";
    }
    
    
    var sql = "select " + key + ",jxNum from ming_table where flystar ='" + flystar + "' and sex=" + info.sex + ";";
    //console.log(sql);
    mysqlClient.query(sql, null, function (err, res) {
        if (err) {
            console.log("Error ocuor when select basenum from ming_table;");
            console.log(err);
            cb.call(null, err);
        }
        else {
            if (res.length <= 0) {
//                cb.call(null, "没有找到基础数据");
                info.baseNum = "0";
                info.jxNum = "0";
                cb.call(null, false);
            }
            else {
                info.baseNum = res[0][key];
                info.jxNum = res[0]['jxNum'];
                log("key=" + key + " baseNum=" + info.baseNum + " flystar=" + flystar + " and sex=" + info.sex);
                //cb.call(null, false);
                operater.getRsjy(info, cb);
            }
        }
    });
}

//获得人生谏言
operater.getRsjy = function (info, cb) {
    var sql = "select jianyan from jianyan_table where nianstar =" + info.flystar.substr(2,1) + " and sex=" + info.sex + ";";
    //console.log(sql);
    mysqlClient.query(sql, null, function (err, res) {
        if (err) {
            console.log("Error ocuor when select jianyan from jianyan_table;");
            console.log(err);
            cb.call(null, err);
        }
        else {
            if (res.length <= 0) {
//                cb.call(null, "没有找到谏言数据");
                info.rsjy = "无";
                cb.call(null, false);
            }
            else {
                info.rsjy = res[0]['jianyan'];
                operater.getBaseXg(info, cb);
            }
        }
    });
}



//获得基本性格
operater.getBaseXg = function (info, cb) {
    var sql = "select basexg,otherxg from basexg_table where (yangsum1 =" + info.yangSum + " or yangsum1 = " + info.yangSum.toString().split("").reverse().join("").toString() + ") and yearstar=" + info.flystar.substr(2, 1) + " and monthstar = " + info.flystar.substr(3, 1) + ";";
    //log(sql);
    mysqlClient.query(sql, null, function (err, res) {
        if (err) {
            console.log("Error ocuor when select basexg from basexg_table;");
            console.log(err);
            cb.call(null, err);
        }
        else {
            if (res.length <= 0) {
                log(sql);
                log("没有找到基本性格数据");
                info.baseXg = "无";
                info.buchongXg = "无";
//                cb.call(null, "没有找到基本性格数据");
                cb.call(null, false);
            }
            else {
                info.baseXg = res[0]['basexg'];
                info.buchongXg = res[0]['otherxg'];  //补充性格
                operater.getOtherXg(info, cb);
            }
        }
    });
}

//获得其他性格
operater.getOtherXg = function (info, cb) {
    var queNum = info.queNum.replace(",", "");
    if (!queNum) {
        queNum = "0";
    }
    var sql = "select mainbz,otherxg,otherbz from otherxg_table where quenum =" + queNum + ";";
//    log(sql);
    mysqlClient.query(sql, null, function (err, res) {
        if (err) {
            console.log("Error ocuor when select * from otherxg_table;");
            console.log(err);
            cb.call(null, err);
        }
        else {
            if (res.length <= 0) {
                log(sql);
                log("没有找到其他性格数据");
                info.td = "无";
                info.mainBz = "无";
                info.qd = "无";
                cb.call(null, false);
            }
            else {
                info.td = res[0]['otherxg'];
                info.mainBz = res[0]['mainbz'];
                info.qd = res[0]['otherbz'];
                cb.call(null, false);
                //operater.getCurNum(info, cb);
            }
        }
    });
}

//获得年运描述
operater.getYearYun = function (info, star, cb) {
    
    if (info.version > 0) {

        var sql = "select sex,flystar from user_table where user_id='" + info.uid + "';";
        log(sql);
        mysqlClient.query(sql, null, function (err, res) {
            if (err) {
                console.log("Error:1 ocuor when select userinfo from user_table;");
                console.log(err);
                cb.call(null, err);
            }
            else {
                if (res.length <= 0) {
                    cb.call(null, "没有这个账号");
                }
                else {
                    info.sex = res[0]['sex'];
                    var flystar = res[0]['flystar'];
                    var birthYearStar = parseInt(flystar.substr(2, 1));

                    //首先计算运程相关的
                    //计算当其旺衰
                    var dataJson = common.getDataJson();
                    var curDate = new Date();
                    var yearStar = user.getYearStar(curDate);
                    var smallStar = user.getSmallStar(curDate);

                    if (info.sex == 0) {
                        yearStar = user.getNvYun(yearStar);
                        smallStar = user.getNvYun(smallStar);
                    }

                    var dqws = (dataJson.yun.dqws[info.sex][yearStar - 1].indexOf(smallStar.toString()) >= 0);
                    var yearYun = new Object();
                    info.yearYun = yearYun;
                    var array = new Array();
                    yearYun[yearStar.toString()] = array; //第一层子，标志为当前的年飞星

                    var ycYun = new Array();
                    var descJson = dataJson.yun.desc[info.sex][birthYearStar - 1][yearStar - 1];
                    ycYun.push(descJson.yc[dqws ? 0 : 1]); //运程
                    ycYun.push(descJson.jk);
                    array.push(ycYun);

                    var cfYun = new Array();
                    cfYun.push(descJson.sy);
                    cfYun.push(descJson.qc);
                    array.push(cfYun);

                    var thYun = new Array();
                    thYun.push(descJson.qb);
                    thYun.push(descJson.th);
                    array.push(thYun);
                    cb.call(null, false);
                }
            }
        });
    }
    else {
        var sql = "select * from nianyun_table a,user_table b where a.curyear=" + star + " and a.sex=" + info.sex + " and  a.birthyear = CONVERT( b.staryear , SIGNED ) and b.user_id='" + info.uid + "';";
        log(sql);
        mysqlClient.query(sql, null, function (err, res) {
            if (err) {
                console.log("Error ocuor when select * from nianyun_table;");
                log(sql);
                console.log(err);
                cb.call(null, err);
            }
            else {
                if (res.length <= 0) {
                    cb.call(null, "没有找到年运数据");

                    console.log(null, "没有找到年运数据 star=" + star + " sex=" + info.sex);
                    console.log(sql);
                }
                else {
                    var nlg = JSON.parse(res[0]['nlhight']);
                    var nlz = JSON.parse(res[0]['nlmid']);
                    var nld = JSON.parse(res[0]['nllower']);
                    var syg = JSON.parse(res[0]['syhight']);
                    var syz = JSON.parse(res[0]['symid']);
                    var syd = JSON.parse(res[0]['sylower']);
                    var qgg = JSON.parse(res[0]['qghight']);
                    var qgz = JSON.parse(res[0]['qgmid']);
                    var qgd = JSON.parse(res[0]['qglower']);

                    info.yearYun = new Object();
                    info.yearYun[star.toString()] = [[nlg, nlz, nld], [syg, syz, syd], [qgg, qgz, qgd]];
                    cb.call(null, false);
                    //operater.getTodayYun(info, cb);
                }
            }
        });
    }
}


//获得当日运气描述
operater.getMonthYun = function (info, star, cb) {

    if (info.version > 0) {
        var sql = "select sex,flystar from user_table where user_id='" + info.uid + "';";
        //log(sql);
        mysqlClient.query(sql, null, function (err, res) {
            if (err) {
                console.log("Error:1 ocuor when select userinfo from user_table;");
                console.log(err);
                cb.call(null, err);
            }
            else {
                if (res.length <= 0) {
                    cb.call(null, "没有这个账号");
                }
                else {
                    info.sex = res[0]['sex'];
                    var flystar = res[0]['flystar'];
                    var birthYearStar = parseInt(flystar.substr(2, 1));

                    //首先计算运程相关的
                    //计算当其旺衰
                    var dataJson = common.getDataJson();
                    var curDate = new Date();


                    //计算日运
                    var dayStar = user.getDayStar(curDate);
                    var monthStar = user.getMonthStar(curDate);

                    if (info.sex == 0) {
                        dayStar = user.getNvYun(dayStar);
                        monthStar = user.getNvYun(monthStar);
                    }
                    
                    var dqws = (dataJson.yun.dqws[info.sex][birthYearStar - 1].indexOf(monthStar.toString()) >= 0);
                    var dayYun = new Object();
                    info.dayYun = dayYun;
                    var array = new Array();
                    dayYun[dayStar.toString()] = array; //第一层子，标志为当前的年飞星

                    var ycYun = new Array();
                    descJson = dataJson.yun.desc[info.sex][birthYearStar - 1][dayStar - 1];
                    ycYun.push(descJson.yc[dqws ? 0 : 1]); //运程
                    ycYun.push(descJson.jk);
                    array.push(ycYun);

                    var cfYun = new Array();
                    cfYun.push(descJson.sy);
                    cfYun.push(descJson.qc);
                    array.push(cfYun);

                    var thYun = new Array();
                    thYun.push(descJson.qb);
                    thYun.push(descJson.th);
                    array.push(thYun);

                    cb.call(null, false);
                }
            }
        });
    }
    else {

        //var sql = "select nl" + gzd + ",sy" + gzd + ",qg" + gzd + " from riyun_table where sex=" + info.sex + " and birthyear=" + info.birthday.substr(2, 2) + " and curmonth=" + 1 + " and curday=" + 1 + ";";
        var sql = "select * from riyun_table a,user_table b where a.sex=" + info.sex + " and a.birthyear = CONVERT( b.staryear , SIGNED )  and a.curmonth=" + star + " and b.user_id = " + info.uid + ";";
        log(sql);
        mysqlClient.query(sql, null, function (err, res) {
            if (err) {
                console.log("Error ocuor when select * from riyun_table;");
                console.log(err);
                log(sql);
                cb.call(null, err);
            }
            else {
                if (res.length <= 0) {
                    console.log("没有找到日运数据");
                    console.log(sql);
                    cb.call(null, "没有找到日运数据");
                }
                else {
                    info.monthYun = new Object();
                    var obj = new Object();
                    info.monthYun[star.toString()] = obj;
                    for (var i = 0 ; i < res.length; i++) {
                        var nlg = JSON.parse(res[i]['nlhight']);
                        var nlz = JSON.parse(res[i]['nlmid']);
                        var nld = JSON.parse(res[i]['nllower']);
                        var syg = JSON.parse(res[i]['syhight']);
                        var syz = JSON.parse(res[i]['symid']);
                        var syd = JSON.parse(res[i]['sylower']);
                        var qgg = JSON.parse(res[i]['qghight']);
                        var qgz = JSON.parse(res[i]['qgmid']);
                        var qgd = JSON.parse(res[i]['qglower']);
                        obj[res[i]["curday"].toString()] = [[nlg, nlz, nld], [syg, syz, syd], [qgg, qgz, qgd]];
                    }
                    cb.call(null, false);
                    //operater.getTodayYun(info, cb);
                }
            }
        });
    }
}

var getXianMiaoFromDB = function (colKey, aType,aNum, cb) {
    var sql = "select " + colKey + " from gua_table where guanum='" + aNum + "';";

    mysqlClient.query(sql, null, function (err, res) {
        if (err) {
            console.log("Error ocuor when select " + colKey + " from gua_table;");
            console.log(err);
            cb.call(null, err);
        }
        else {
            if (res.length <= 0) {
                console.log(sql);
                console.log("没有找到仙妙数据");
                cb.call(null, "没有找到仙妙数据");
            }
            else {
                if (aType != 3) {
                    cb.call(null, false, res[0][colKey]);
                }
                else {
                    cb.call(null, false, (res[0][colKey] == 1 ? "男" : "女"));
                }
            }
        }
    });
}

//获得仙妙描述
operater.getXianMiao = function (uid,aType,aNum,cb) {
    var colKey = "";
    switch (parseInt(aType)) {
        case 0:
            {
                colKey = 'qg';
            }
            break;
        case 1:
            {
                colKey = 'cx';
            }
            break;
        case 2:
            {
                colKey = 'qc';
            }
            break;
        case 3:
            {
                colKey = 'sex';
                //求男女，直接查找，不涉及四季五行
                getXianMiaoFromDB(colKey, aType, aNum, cb);
            }
            break;
        case 4:
            {
                colKey = 'qz';
            }
            break;
        case 5:
            {
                colKey = 'yr';
            }
            break;
    }

    if (aType != 3) {
        var wx = user.getWx(new Date());
        
        switch (wx) {
            case 0:
                {
                    colKey = colKey + "chun";
                }
                break;
            case 1:
                {
                    colKey = colKey + "xia";
                }
                break;
            case 2:
                {
                    colKey = colKey + "qiu";
                }
                break;
            case 3:
                {
                    colKey = colKey + "dong";
                }
                break;
            case 4:
                {
                    colKey = colKey + "tu";
                }
                break;
        }
        console.log("colKey = " + colKey);
        getXianMiaoFromDB(colKey, aType, aNum, cb);
    }
}

operater.onKhfk = function (uid,msg, cb) {
    var sql = "insert into khfk_table(user_id, msg) values('"
        + uid + "','" + msg + "');";
    console.log(sql);
    mysqlClient.insert(sql, null, function (err) {
        if (err) {
            console.log("Error ocuor when insert into khfk_table;");
            console.log(err);
            log(sql);
            cb.call(err);
        }
        else {
            if (cb) {
                cb.call(err);
            }
        }
    });
}


operater.getAllUser = function (cb) {
    var sql = "select a.*,b.basenum1,b.basenum2,b.basenum3,b.basenum4,b.basenum5,b.basenum6,b.basenum7,b.basenum8 from user_table a,ming_table b where a.acceptmsg = true and a.deviceid <> '' and b.flystar = a.flystar and b.sex = a.sex;";
    //log(sql);from ming_table where flystar ='" + flystar + "' and sex=" + info.sex + ";"
    mysqlClient.query(sql, null, function (err, res) {
        if (err) {
            console.log("Error ocuor when select userinfo from user_table;");
            console.log(err);
            cb.call(null, err);
        }
        else {
            if (res.length <= 0) {
                cb.call(null,null, "没有接受推送通知的用户");
            }
            else {
                //console.log(res);
                cb.call(null,res, false);
            }
        }
    });
}

operater.setUserDeviceId = function (info, cb) {
    var sql = "update user_table set deviceid = '" + info.token + "',user_os = " + info.os + " where user_id = '" + info.uid + "'";
    console.log(sql);

    mysqlClient.insert(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
}
/**
 * info.sex 男=1 女=0
 * 20150203这个接口在2004年前 sex，flystar sex：男=1 女=0  2004年后 sex:0=男 1=女  为解决这个相反问题 先通过飞星查询到数据 如果是一条就是这条数据 如果是多条 就选择和性别(info.sex)相同的
 * @param info
 * @param cb
 */
operater.getUserLastJxScore = function (info, cb) {
    var sql = "select wealth_stars,lastJxScore,baseZyScore from newming_table where  flystar = '" + info.flystar + "'";//20150203 sex = " + info.sex + " and


    mysqlClient.query(sql, null, function (err, res) {
        if (err) {
            console.log("Error ocuor when getUserLastJxScore;");
            console.log(sql);
            console.log(err);
        }
        else {
            if(res){
                if(res.length==1){
                    info.wealth_stars = parseFloat(res[0]["wealth_stars"]);
                    info.jxScore = parseFloat(res[0]["lastJxScore"]);
                    info.baseZyScore = parseFloat(res[0]['baseZyScore']).toFixed(0);
                }else{
                    for(var i= 0;i<res.length;i++){
                        if(res[i].sex==info.sex){
                            info.wealth_stars = parseFloat(res[i]["wealth_stars"]);
                            info.jxScore = parseFloat(res[i]["lastJxScore"]);
                            info.baseZyScore = parseFloat(res[i]['baseZyScore']).toFixed(0);
                        }
                    }
                }
            }
            if (cb) {
                info.xjStarScore=getxjStarScore(info.flystar);
                info.baseZyScore=((info.xjStarScore+75)*100/150).toFixed(0);
                var wealthstars=getWealth_stars(info.flystar);
                if(wealthstars>0){
                    if(info.wealth_stars<wealthstars){
                        info.wealth_stars=wealthstars;
                    }
                }
                cb.call(null, info.jxScore);
            }
        }
    });
};

function getWealth_stars(flystar){
    var wealth_stars=0;
    if(indexOfNum(flystar,"6")>=3&&flystar.indexOf("2")>=0){
        wealth_stars=3;
    }else if(indexOfNum(flystar,"6")>=3&&flystar.indexOf("5")>=0){
        wealth_stars=3;
    }else if(indexOfNum(flystar,"6")>=3&&flystar.indexOf("8")>=0){
        wealth_stars=3;
    }else if(indexOfNum(flystar,"6")>=2&&flystar.indexOf("7")>=0&&flystar.indexOf("2")>=0){
        wealth_stars=3;
    }else if(indexOfNum(flystar,"6")>=2&&flystar.indexOf("7")>=0&&flystar.indexOf("5")>=0){
        wealth_stars=3;
    }else if(indexOfNum(flystar,"6")>=2&&flystar.indexOf("7")>=0&&flystar.indexOf("8")>=0){
        wealth_stars=3;
    }else if(indexOfNum(flystar,"6")>=2&&flystar.indexOf("2")>=0){
        wealth_stars=2;
    }else if(indexOfNum(flystar,"6")>=2&&flystar.indexOf("5")>=0){
        wealth_stars=2;
    }else if(indexOfNum(flystar,"6")>=2&&flystar.indexOf("8")>=0){
        wealth_stars=2;
    }
    return wealth_stars;
}

function getxjStarScore(flystar) {
    var xjStarScore=0;

    //吉星为1、6、8，1个加15，2个加25分，3个加30分
    var tmp_num=0;
    tmp_num+=indexOfNum(flystar,"1");
    tmp_num+=indexOfNum(flystar,"6");
    tmp_num+=indexOfNum(flystar,"8");
    if(tmp_num==1){
        xjStarScore+=15;
    }else if(tmp_num==2){
        xjStarScore+=25;
    }else if(tmp_num>=3){
        xjStarScore+=30;
    }

    //吉星为9，1个加8，2个加20，3个加30分。
    var tmp_num1=0;
    tmp_num1+=indexOfNum(flystar,"9");
    if(tmp_num1==1){
        xjStarScore+=8;
    }else if(tmp_num1==2){
        xjStarScore+=20;
    }else if(tmp_num1>=3){
        xjStarScore+=30;
    }

    //0颗吉星减10分。
    if(tmp_num==0&&tmp_num1==0){
        xjStarScore-=10;
    }
    //内吉星星盘；同样的数逢两遍或3遍，只加一遍。例如8逢66，只加一遍8-6，加15。
    //1-6，加15；1-4，加15；1-8，加10；
    if(flystar.substr(2,1)=="1"){
        if(flystar.indexOf("6")>=0){
            xjStarScore+=15;
        }
        if(flystar.indexOf("4")>=0){
            xjStarScore+=15;
        }
        if(flystar.indexOf("8")>=0){
            xjStarScore+=10;
        }
    }

    //2-7，加10；
    if(flystar.substr(2,1)=="2"){
        if(flystar.indexOf("7")>=0){
            xjStarScore+=10;
        }
    }

    //3-8，加10；
    if(flystar.substr(2,1)=="3"){
        if(flystar.indexOf("8")>=0){
            xjStarScore+=10;
        }
    }

    //4-1，加15；4-9，加10；
    if(flystar.substr(2,1)=="4"){
        if(flystar.indexOf("1")>=0){
            xjStarScore+=15;
        }
        if(flystar.indexOf("9")>=0){
            xjStarScore+=10;
        }
    }

    //6-8，加15；6-1，15；
    if(flystar.substr(2,1)=="6"){
        if(flystar.indexOf("8")>=0){
            xjStarScore+=15;
        }
        if(flystar.indexOf("1")>=0){
            xjStarScore+=15;
        }
    }

    //7-2，加10；
    if(flystar.substr(2,1)=="7"){
        if(flystar.indexOf("2")>=0){
            xjStarScore+=10;
        }
    }

    //8-6，加15；8-3，加10；
    if(flystar.substr(2,1)=="8"){
        if(flystar.indexOf("6")>=0){
            xjStarScore+=15;
        }
        if(flystar.indexOf("3")>=0){
            xjStarScore+=10;
        }
    }

    //9-4，加10；
    if(flystar.substr(2,1)=="9"){
        if(flystar.indexOf("4")>=0){
            xjStarScore+=10;
        }
    }
    //外吉星星盘；14、41、16、61、68、86，加15。  27、72、38、83、49、94，加10。如遇数值组合重复，只加一遍。例如141，只加14=15。
    var waifly=flystar.substr(0,2)+flystar.substr(3,3);
    if(waifly.indexOf("1")>=0&&waifly.indexOf("4")>=0){
        xjStarScore+=15;
    }
    if(waifly.indexOf("1")>=0&&waifly.indexOf("6")>=0){
        xjStarScore+=15;
    }
    if(waifly.indexOf("6")>=0&&waifly.indexOf("8")>=0){
        xjStarScore+=15;
    }
    if(waifly.indexOf("2")>=0&&waifly.indexOf("7")>=0){
        xjStarScore+=10;
    }
    if(waifly.indexOf("3")>=0&&waifly.indexOf("8")>=0){
        xjStarScore+=10;
    }
    if(waifly.indexOf("4")>=0&&waifly.indexOf("9")>=0){
        xjStarScore+=10;
    }
    //6颗星含147、258、369，顺序随便，加30分；
    if(flystar.indexOf("1")>=0&&flystar.indexOf("4")>=0&&flystar.indexOf("7")>=0){
        xjStarScore+=30;
    }
    if(flystar.indexOf("2")>=0&&flystar.indexOf("5")>=0&&flystar.indexOf("8")>=0){
        xjStarScore+=30;
    }
    if(flystar.indexOf("3")>=0&&flystar.indexOf("6")>=0&&flystar.indexOf("9")>=0){
        xjStarScore+=30;
    }
    //内凶星星盘；同样的数逢两遍或3遍，只减一遍。例如7逢33，只减一遍7-3，减15。
    //1-5，减10；1-37，减15分。
    if(flystar.substr(2,1)=="1"){
        if(flystar.indexOf("5")>=0){
            xjStarScore-=10;
        }
        if(flystar.indexOf("3")>=0&&flystar.indexOf("7")>=0){
            xjStarScore-=15;
        }
    }

    //2-3，减15；2-5，减15（如遇258，不减）。
    if(flystar.substr(2,1)=="2"){
        if(flystar.indexOf("3")>=0){
            xjStarScore-=15;
        }
        if(flystar.indexOf("5")>=0&&!flystar.indexOf("8")>=0){
            xjStarScore-=15;
        }
    }

    //3-7，减15；3-2，减15；3-45，减20分。
    if(flystar.substr(2,1)=="3"){
        if(flystar.indexOf("7")>=0){
            xjStarScore-=15;
        }
        if(flystar.indexOf("2")>=0){
            xjStarScore-=15;
        }
        if(flystar.indexOf("4")>=0&&flystar.indexOf("5")>=0){
            xjStarScore-=20;
        }
    }

    //4-3，减10；4-7，减15（如遇147，不减）；4-35，减25分。
    if(flystar.substr(2,1)=="4"){
        if(flystar.indexOf("3")>=0){
            xjStarScore-=10;
        }
        if(flystar.indexOf("7")>=0&&!flystar.indexOf("1")>=0){
            xjStarScore-=15;
        }
        if(flystar.indexOf("3")>=0&&flystar.indexOf("5")>=0){
            xjStarScore-=25;
        }
    }
    //5-2，减15（如遇258，不减）； 5-34.减25分； 5-97，减25分；5-9减15（如遇597，不重复减分）；5-7减15（如遇597，不重复减分）；
    if(flystar.substr(2,1)=="5"){
        if (flystar.indexOf("2")>=0&&!flystar.indexOf("8")>=0) {
            xjStarScore -= 15;
        }
        if(flystar.indexOf("3")>=0&&flystar.indexOf("4")>=0){
            xjStarScore-=25;
        }
        if(flystar.indexOf("9")>=0&&flystar.indexOf("7")>=0){
            xjStarScore-=25;
        }
        if (flystar.indexOf("9")>=0&&!flystar.indexOf("7")>=0) {
            xjStarScore -= 15;
        }
        if (flystar.indexOf("7")>=0&&!flystar.indexOf("9")>=0) {
            xjStarScore -= 15;
        }
    }

    //6-7减15；6-4，减15。
    if(flystar.substr(2,1)=="6"){
        if(flystar.indexOf("7")>=0){
            xjStarScore-=15;
        }
        if(flystar.indexOf("4")>=0){
            xjStarScore-=15;
        }
    }

    //7-3，减15；7-4减10（如遇147，不减），7-6减15；7-59，减20；7-5，7-9，减15。（如遇597，不重复减分）；
    if(flystar.substr(2,1)=="7"){
        if(flystar.indexOf("3")>=0){
            xjStarScore-=15;
        }
        if (flystar.indexOf("4")>=0&&!flystar.indexOf("1")>=0) {
            xjStarScore -= 10;
        }
        if(flystar.indexOf("6")>=0){
            xjStarScore-=15;
        }
        if(flystar.indexOf("5")>=0&&flystar.indexOf("9")>=0){
            xjStarScore-=20;
        }
        if (flystar.indexOf("5")>=0&&!flystar.indexOf("9")>=0) {
            xjStarScore -= 15;
        }
        if (flystar.indexOf("9")>=0&&!flystar.indexOf("5")>=0) {
            xjStarScore -= 15;
        }
    }

    //9-7，减15（如遇597，不重复减分）； 9-5，减15（如遇597，不重复减分）。9-57，减25分。
    if(flystar.substr(2,1)=="9"){
        if(flystar.indexOf("5")>=0&&flystar.indexOf("7")>=0){
            xjStarScore-=25;
        }
        if (flystar.indexOf("7")>=0&&!flystar.indexOf("5")>=0) {
            xjStarScore -= 15;
        }
        if(flystar.indexOf("5")>=0&&!flystar.indexOf("7")>=0){
            xjStarScore-=15;
        }
    }
    //外凶星星盘；25、52、37、73、97、79，减10。 95、59，67、76、23、32，减10。
    if(waifly.indexOf("2")>=0&&waifly.indexOf("5")>=0){
        xjStarScore-=10;
    }
    if(waifly.indexOf("3")>=0&&waifly.indexOf("7")>=0){
        xjStarScore-=10;
    }
    if(waifly.indexOf("7")>=0&&waifly.indexOf("9")>=0){
        xjStarScore-=10;
    }
    if(waifly.indexOf("5")>=0&&waifly.indexOf("9")>=0){
        xjStarScore-=10;
    }
    if(waifly.indexOf("6")>=0&&waifly.indexOf("7")>=0){
        xjStarScore-=10;
    }
    if(waifly.indexOf("2")>=0&&waifly.indexOf("3")>=0){
        xjStarScore-=10;
    }
    //137减20分；345、 957减20。（任意顺序）如与内凶星盘重复，只减1遍，不叠加减分。
    if(flystar.indexOf("1")>=0&&flystar.indexOf("3")>=0&&flystar.indexOf("7")>=0){
        xjStarScore-=20;
    }
    if(flystar.indexOf("3")>=0&&flystar.indexOf("4")>=0&&flystar.indexOf("5")>=0){
        xjStarScore-=20;
    }
    if(flystar.indexOf("9")>=0&&flystar.indexOf("5")>=0&&flystar.indexOf("7")>=0){
        if(!flystar.substr(2,1)=="9"&&!flystar.substr(2,1)=="5"&&!flystar.substr(2,1)=="7"){
            xjStarScore-=20;
        }
    }
    //得分75分以上的，-75分以下的，统一调整成75分和-75分，
    if(xjStarScore>75){
        xjStarScore=75;
    }
    if(xjStarScore<-75){
        xjStarScore=-75;
    }
    return xjStarScore;
}
function indexOfNum(flystar,str1){
    var num=0;
    for(var i=0;i<flystar.length;i++){
        if(flystar.substr(i,1)==str1){
            num++;
        }
    }
    return num;
}
/**
 * set user's colour
 * @param uid
 * @param colour
 */
operater.setColour = function(uid,colour,cb){
    var values = [colour,uid];
    var sql = "update user_table set colour= ?  where user_id= ?;"
    console.log(sql);
    mysqlClient.update(sql, values, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};
/**
 * add feedback
 * @param uid
 * @param content
 * @param cb
 */
operater.addFeedback = function(uid,content,cb){
    var sql = "insert feedback_table(uid,content) value('" + uid + "','" + content + "')";
    console.log(sql);
    mysqlClient.insert(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

/**
 * add a user to contracts
 * @param uid
 * @param contracts_uid
 * @param contracts_name
 * @param cb
 */
operater.addToContract = function(uid,contracts_uid,contracts_name,cb){
    //  get the number of friend first, the friend 's number must less than 5
//    var sql = "select contracts_uid from contracts_table where uid='" + uid + "'";
//    console.log(sql);
//    mysqlClient.query(sql, null, function (err,res) {
//        var contracts = [];
//        for(var i = 0; i < res.length; ++i){
//            contracts.push(res[i]["contracts_uid"]);
//        }
//        if(contracts.length >= 4){
//            cb("通讯录只能保存最重要的4名好友，如要添加，请先移除之前的好友!");
//            return;
//        }
//        //  add already ?
//        var find = false;
//        for(i = 0; i < contracts.length; ++i){
//            if(contracts_uid == contracts[i]){
//                find = true;
//            }
//        }
//        if(find){
//            cb("请勿重复添加!")
//            return;
//        }
        sql = "insert contracts_table(uid,contracts_uid,contracts_name,status) value('" + uid + "','" + contracts_uid + "','" + contracts_name + "',1);";
        console.log(sql);
        mysqlClient.insert(sql, null, function (err) {
            if (cb) {
                cb.call(err);
            }
        });
//    });
};

/**
 * delete a user from contracts
 * @param uid
 * @param contracts_uid
 * @param cb
 */
operater.delFromContract = function(uid,contracts_uid,cb){
    var sql = "delete from contracts_table where uid='" + uid + "' and contracts_uid='" + contracts_uid + "'";
    console.log(sql);
    mysqlClient.delete(sql, null, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

/**
 * get all contracts
 * @param uid
 * @param cb
 */
operater.getContract = function(uid,status,cb){
    var sql = "select c.contracts_uid,c.contracts_name,u.name,u.sex,u.birthday,c.id,d.head_img from contracts_table c left join user_table u on u.user_id=c.contracts_uid left join user_detail_table d on c.contracts_uid=d.user_id where c.uid='" + uid + "'";
    if(status=="1"){
        sql+=" and c.status=1 order by c.id asc";
    }else {
        sql += " order by c.status desc";
    }
    console.log(sql);
    mysqlClient.query(sql, null, function (err,res) {
        var contracts = [];
        for(var i = 0; i < res.length; ++i){
            contracts.push([res[i]["contracts_uid"],res[i]["name"],res[i]["sex"],res[i]["birthday"],res[i]["id"],res[i]["head_img"]]);
        }
        cb(err,contracts)
    });
};

operater.editContract = function(id,uid,contracts_uid,contracts_name,edit_type,cb){
    if(edit_type=="1"){
        var sql = "update contracts_table set status=0 where id= "+id+";";
        mysqlClient.update(sql, null, function (err) {
            if (err) {
                console.log(err);
            }else{
                var sql1= "update contracts_table set status=1 where uid='" + uid + "' and contracts_uid='" + contracts_uid + "'";
                mysqlClient.update(sql1, null, function (err1) {
                    if (err1) {
                        console.log(err1);
                    }else{
                        cb(err1);
                    }
                });
            }
        });
    }else if(edit_type=="0"){
        var sql = "update contracts_table set status=0 where id= "+id+";";
        mysqlClient.update(sql, null, function (err) {
            if (err) {
                console.log(err);
            }else{
                var sql1 = "insert contracts_table(uid,contracts_uid,contracts_name,status) value('" + uid + "','" + contracts_uid + "','" + contracts_name + "',1);";
                mysqlClient.update(sql1, null, function (err1) {
                    if (err1) {
                        console.log(err1);
                    }else{
                        cb(err1);
                    }
                });
            }
        });
    }
    console.log(sql);

}

operater.editStatusContract = function(uid,contracts_uid,status,cb){
    var sql = "update contracts_table set status="+status+" where uid='" + uid + "' and contracts_uid='" + contracts_uid + "'";
    console.log(sql);
    mysqlClient.update(sql, null, function (err) {
        if (err) {
            console.log(err);
        }
        cb(err);
    });
}

/**
 * get bless from user table
 * @param uid
 * @param cb
 */
operater.getBless = function(uid,cb){
    var sql = "select bless from user_table where user_id='" + uid + "'";
    console.log(sql);
    mysqlClient.query(sql, null, function (err,res) {
        cb(err,res[0]?res[0]["bless"]:0)
    });
};

operater.setBless = function(uid,bless,lotus,cb){
    var values = [bless,lotus,uid];
    var sql = "update user_table set bless= ?, lotus= ? where user_id= ?;"
    console.log(sql);
    mysqlClient.update(sql, values, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.getUserIdByOpenId = function(openid,cb){
    var sql = "select user_id from user_table where openid='" + openid + "'";
    console.log(sql);
    mysqlClient.query(sql, null, function (err,res) {
        cb(err,res[0] ?res[0]["user_id"]:0);
    });
};

operater.setLoginCount = function(uid,login_count){
    var values = [login_count,uid];
    var sql = "update user_table set login_count= ?  where user_id= ?;";
    console.log(sql);
    mysqlClient.update(sql, values, function (err) {
        if(err){
            console.log(err);
        }
    });
};

operater.addToAttention = function(uid,attention_uid,cb){
    var sql = "select attention_uid,attention_flag from contracts_table where uid='" + uid + "'";
    console.log(sql);
    mysqlClient.query(sql, null, function (err,res) {
        var contracts = [];
        for(var i = 0; i < res.length; ++i){
            if(res[i]["attention_flag"]){
                contracts.push(res[i]["contracts_uid"]);
            }
        }
        //  add already ?
        var find = false;
        for(i = 0; i < contracts.length; ++i){
            if(attention_uid == contracts[i]){
                find = true;
            }
        }
        if(find){
            cb("请勿重复添加关注!");
            return;
        }
        var values = [uid,attention_uid];
        var sql = "update contracts_table set attention_flag= 1  where user_id= ? and contracts_uid= ?;";
        console.log(sql);
        mysqlClient.update(sql, values, function (err) {
            if (cb) {
                cb.call(err);
            }
        });
    });
};

operater.delAttention = function(uid,contracts_uid,cb){
    var values = [uid,contracts_uid];
    var sql = "update contracts_table set attention_flag= 0  where user_id= ? and contracts_uid= ?;";
    console.log(sql);
    mysqlClient.update(sql, values, function (err) {
        if (cb) {
            cb.call(err);
        }
    });
};

operater.getAttentions = function(uid,cb){
    var sql = "select contracts_uid,attention_flag from contracts_table where uid='" + uid + "'";
    console.log(sql);
    mysqlClient.query(sql, null, function (err,res) {
        var contracts = [];
        for(var i = 0; i < res.length; ++i){
            if(res[i]["attention_flag"]){
                contracts.push(res[i]["contracts_uid"]);
            }
        }
        if (cb) {
            cb(err,contracts)
        }
    });
};
//20150129 新的
//发送祝福
operater.GiveAwayBless = function(uid,name,target_uid,bless,cb){
    var values = [uid,name,bless,target_uid];
    var sql = "insert into bless_table (uid,name,bless,target_uid) values (?,?,?,?)"
    console.log(sql);
    mysqlClient.insert(sql, values, function (err) {
//        if (cb) {
//            cb.call(err);
//        }
        cb(err);
    });
};
//查看该用户的未收取祝福
operater.FindNewReceiveBless = function(uid,cb){
    var values = [uid];
    var sql = "select * from bless_table where target_uid=? and status=0;";
    console.log(sql);
    mysqlClient.query(sql, values, function (err,res) {
        cb(err,res);
    });
};
/**
 * 收取祝福
 * @param id  bless_table.id
 * @param uid 用户id
 * @param cb
 * @constructor
 */
operater.GetBless = function(id,uid,cb){
    var sql = "update bless_table set status=1 where id=?;";
    console.log(sql);
    mysqlClient.query(sql, [id], function (err,res) {
        if(err){
            cb(err);
        }else{
            var sql1 = "select * from bless_table where id=?;";
            console.log(sql1);
            mysqlClient.query(sql1, [id], function (err1,res1) {
                if(err1){
                    cb(err1);
                }else{
                    console.log(res1)
                    var sql2 = "update user_table set bless=bless+"+res1[0].bless+"  where user_id= ?;";
                    console.log(sql2);
                    mysqlClient.update(sql2, [uid], function (err2) {
                        if (cb) {
                            cb.call(err2);
                        }
                    });
                }
            });
        }
    });
};
/**拒收福报*/
operater.noBless = function(id,uid,cb){
    var sql = "update bless_table set status=1 where id=?;";
    console.log(sql);
    mysqlClient.query(sql, [id], function (err,res) {
        if (cb) {
            cb.call(err);
        }
//        if(err){
//            cb(err);
//        }else{
//            var sql1 = "select * from bless_table where id=?;";
//            console.log(sql1);
//            mysqlClient.query(sql1, [id], function (err1,res1) {
//                if(err1){
//                    cb(err1);
//                }else{
//                    console.log(res1)
//                    var sql2 = "update user_table set bless=bless+"+res1[0].bless+"  where user_id= ?;";
//                    console.log(sql2);
//                    mysqlClient.update(sql2, [uid], function (err2) {
//                        if (cb) {
//                            cb.call(err2);
//                        }
//                    });
//                }
//            });
//        }
    });
};
//20150129 旧的
operater.GiveAwayBless2 = function(uid,name,target_uid,bless,cb){
    var sql = "select give_away_bless from user_table where user_id='" + target_uid + "';";
    console.log(sql);
    mysqlClient.query(sql, null, function (err,res) {
        if(res){
            var give_away_bless = res[0]?res[0]["give_away_bless"]:"[]";
            if(give_away_bless){
                try{
                    give_away_bless = JSON.parse(give_away_bless);
                }catch(e){
                    give_away_bless = [];
                }
                var new_give_away_bless = {};
                new_give_away_bless.uid = uid;
                new_give_away_bless.name = name;
                new_give_away_bless.bless = bless;
                give_away_bless.push(new_give_away_bless);
                var values = [JSON.stringify(give_away_bless),target_uid];
                var sql = "update user_table set give_away_bless= ? where user_id= ?;"
                console.log(sql);
                mysqlClient.insert(sql, values, function (err) {
                    if (cb) {
                        cb.call(err);
                    }
                });
            }
        }
        else{
            if(err){
                cb(err);
            }
        }
    });
};
//20150129 旧的
operater.GetBless2 = function(uid,cb){
    var sql = "select give_away_bless from user_table where user_id='" + uid + "';";
    console.log(sql);
    mysqlClient.query(sql, null, function (err,res) {
        if(err){
            cb(err);
        }
        if(res){
            cb(err,res[0] ?res[0]["give_away_bless"]:0);
        }
    });

    var values = [uid];
    var sql = "update user_table set give_away_bless= '[]'  where user_id= ?;";
    console.log(sql);
    mysqlClient.update(sql, values, function (err) {
        if (err) {
            console.log(err);
        }
    });
};
/**
 * 意见反馈
 * @param type 是否想知道三件事type=0;三件事性格type=1;三件事去年type=2;三件事过去10年type=3
 * @param value 0,1,2,...想知道,不想知道  真准,一般,不准
 * @param memo 备注
 */
operater.createSurveyFeedback = function(type,value,memo,cb){
    var sql = "insert into survey_feedback_table(type, value,memo ) values(?,?,?)";
    console.log(sql);
    mysqlClient.query(sql, [type,value,memo], function (err,res) {
        cb(err,res)
    });
};
/**
 * 缓存能量
 * @param uid
 * @param date
 * @param cb
 * @constructor
 */
operater.getEnergyCache = function(user_id,date,cb){
    var values = [user_id,date];
    var sql = "select * from energycache_table where user_id=? and date=?;";
    console.log(sql);
    mysqlClient.query(sql, values, function (err,res) {
        cb(err,res);
    });
};
operater.getEnergyCache2 = function(user_id,cb){
    var values = [user_id];
    var sql = "select * from energycache_table where user_id=?;";
    console.log(sql);
    mysqlClient.query(sql, values, function (err,res) {
        cb(err,res);
    });
};
/**
 *
 * @param user_id
 * @param energy
 * @param date
 * @param cb
 */
operater.insertEnergyCache = function(user_id,energy,date,cb){
    var sql = "insert into energycache_table(user_id, energy,date ) values(?,?,?)";
    console.log(sql);
    mysqlClient.query(sql, [user_id,energy,date], function (err,res) {
        cb(err,res)
    });
};
/**
 *
 * @param user_id
 * @param energy
 * @param date
 * @param cb
 */
operater.updateEnergyCache = function(user_id,energy,date,cb){
    var values = [date,user_id];
    var sql = "update energycache_table set energy= "+energy+",date=?  where user_id= ?;";
    console.log(sql);
    mysqlClient.update(sql, values, function (err) {
        if (err) {
            console.log(err);
        }
        cb(err);
    });
};