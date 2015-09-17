var comm = require('../common');
/*
        * 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒
        * 其中，年月日为全格式，例如 ： 2010-10-12 01:00:        * 返回精度为：秒，分，小时，天
        */
var clockList = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
function GetDateDiff(startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");

    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime);      //开始时间
    var eTime = new Date(endTime);  //结束时间
    //作为除数的数字
    var divNum = 1;
    switch (diffType) {
        case "second":
            divNum = 1000;
            break;
        case "minute":
            divNum = 1000 * 60;
            break;
        case "hour":
            divNum = 1000 * 3600;
            break;
        case "day":
            divNum = 1000 * 3600 * 24;
            break;
        default:
            break;
    }
    console.log("divNum="+divNum);
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
}

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
  /*var gz = ["甲子","乙丑","丙寅","丁卯","戊辰","己巳","庚午","辛未","壬申","癸酉","甲戌","乙亥","丙子","丁丑","戊寅","己卯","庚辰","辛己","壬午","癸未","甲申","乙酉","丙戌","丁亥","戊子","己丑","庚寅","辛卯","壬辰","癸巳","甲午","乙未","丙申","丁酉","戊戌","己亥","庚子","辛丑","壬寅","癸丑","甲辰","乙巳","丙午","丁未","戊申","己酉","庚戌","辛亥","壬子","癸丑","甲寅","乙卯","丙辰","丁巳","戊午","己未","庚申","辛酉","壬戌","癸亥"];
  var days = GetDateDiff("1950-01-01 00:00:00", "2013-09-29 00:00:01", "day");
  
	  
  res.send(gz[(2013-1950+26)%60] + "年" + gz[(days+32)%60] + "日");*/
};

var tools = require('./tools/tools')
var LunarCalendar = require("lunar-calendar");
var user = require('./user.js');
var term = require('./util/lunar-term');
var response = require('./common/response')
var sjStr = ['木', '火', '金', '水', '土'];
/**
 * 黄帝历：4710年6月5日8点5分
 阳历：2014年7月11日8点5分
 阴历：2014年6月18日8点5分
 干支：甲午（年）辛未（月）癸未（日）丙辰（时）
 飞星：阳384382 阴372374（大运、小运、年、月、日、时）
 节气：小暑中
 * @param req
 * @param res
*/
exports.dateDetail = function(req, res){
    var sex = req.query.sex;
    if(sex.toString().length>1){
        return;
    }
    var year = req.query.year;
    var month = req.query.month;
    var day = req.query.day;
    var hour = req.query.hour;
    var min = req.query.min;
    var second =req.query.seconds;
    if (hour >= 23) {
        hour = 0;
    }
    var ob = new Object();
    var t = tools.timeStr2hour(hour + ":"+min+":"+second);
    var jd=tools.JD.JD(tools.year2Ayear(parseInt(year)), parseInt(month), parseInt(day)+t/24);
    tools.obb.mingLiBaZi( jd-tools.J2000, 0, ob ); //八字计算
    //阴历
    var lunar = LunarCalendar.solarToLunar(year,month,day);
    var time=new Date(year + "/" + month + "/" + day + " " + hour + ":"+min+":00");
    var starfly1=getStarfly(time,1)
    var starfly2=getStarfly(time,0)

    var clock = (parseInt(req.query.hour) + 1) % 24;
    clock = Math.floor(clock / 2);

    var result='';
    result+='阳历：'+year+'年'+month+'月'+day+'日'+req.query.hour+'点'+min+'分\n';
    result+='阴历：'+lunar.lunarYear+'年'+lunar.lunarMonthName+' '+lunar.lunarDayName+' '+req.query.hour+'点'+min+'分\n';
    result+='黄帝历：'+getHuangdili(year,month,day)+' '+clockList[clock]+'时\n';
    result+='干支：'+ob.bz_jn+' '+ob.bz_jy+' '+ob.bz_jr+' '+ob.bz_js+'\n';
    result+='飞星：阳'+starfly1+' 阴'+starfly2+'\n';
//    result+='飞星：阳'+starfly1+' 阴'+starfly2+'（大运、小运、年、月、日、时）\n';
    if(lunar.term){
        result+='节气：'+lunar.term+'\n';
    }else{
        var termList=term.getYearTerm(year);
        var prevKey;
        for(var key in termList){
            if(term.formateDayD4(month-1,day)<key){
                result+='节气：'+termList[prevKey]+'中\n';
                break;
            }else{
                prevKey = key;
            }
        }

    }
    result+='四季五行：'+sjStr[user.getWx(time)]+'\n';
    if(ob.solarFestival){
        result+=ob.solarFestival+'\n';
    }
    if(ob.lunarFestival){
        result+=ob.lunarFestival+'\n';
    }
    response.end(res,response.buildResponse(response.OK,result),null);
}

exports.yindateDetail = function(req, res){
    var sex = req.query.sex;
    var year = req.query.year;
    var month = req.query.month;
    var day = req.query.day;
    var hour = req.query.hour;
    var min = req.query.min;
    var second =req.query.seconds;
    if (hour >= 23) {
        hour = 0;
    }
    var ob = new Object();
    var t = tools.timeStr2hour(hour + ":"+min+":"+second);
    var jd=tools.JD.JD(tools.year2Ayear(parseInt(year)), parseInt(month), parseInt(day)+t/24);
    tools.obb.mingLiBaZi( jd-tools.J2000, 0, ob ); //八字计算
    //阴历
    var solar = LunarCalendar.lunarToSolar(year,month,day);
    year=solar.year;
    month=solar.month;
    day=solar.day;
    var lunar = LunarCalendar.solarToLunar(year,month,day);
    var time=new Date(year + "/" + month + "/" + day + " " + hour + ":"+min+":00");
    var starfly1=getStarfly(time,1)
    var starfly2=getStarfly(time,0)

    var clock = (parseInt(req.query.hour) + 1) % 24;
    clock = Math.floor(clock / 2);

    var result='';
    result+='阳历：'+year+'年'+month+'月'+day+'日'+req.query.hour+'点'+min+'分\n';
    result+='阴历：'+lunar.lunarYear+'年'+lunar.lunarMonthName+' '+lunar.lunarDayName+' '+req.query.hour+'点'+min+'分\n';
    result+='黄帝历：'+getHuangdili(year,month,day)+' '+clockList[clock]+'时\n';
    result+='干支：'+ob.bz_jn+' '+ob.bz_jy+' '+ob.bz_jr+' '+ob.bz_js+'\n';
    result+='飞星：阳'+starfly1+' 阴'+starfly2+'\n';
//    result+='飞星：阳'+starfly1+' 阴'+starfly2+'（大运、小运、年、月、日、时）\n';
    if(lunar.term){
        result+='节气：'+lunar.term+'\n';
    }else{
        var termList=term.getYearTerm(year);
        var prevKey;
        for(var key in termList){
            if(term.formateDayD4(month-1,day)<key){
                result+='节气：'+termList[prevKey]+'中\n';
                break;
            }else{
                prevKey = key;
            }
        }
    }
    result+='四季五行：'+sjStr[user.getWx(time)]+'\n';
    if(ob.solarFestival){
        result+=ob.solarFestival+'\n';
    }
    if(ob.lunarFestival){
        result+=ob.lunarFestival+'\n';
    }
    response.end(res,response.buildResponse(response.OK,result),null);
}
function getStarfly(date,sex){
    var riyunclock=date.getHours();
    if(riyunclock==0){
        riyunclock=1;
    }
    var riyundate = new Date(date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate() + " " + riyunclock + ":00:00");
//大小运数 //60年一大运，20年一小运 从1924年2月4日开始 大运2，小运4
    bigyun = user.getBigStar(date);
    smallyun = user.getSmallStar(date);
    nianyun = user.getYearStar(date);
    //月运数
    yueyun = user.getMonthStar(date);
    riyun = user.getDayStar(riyundate);
    shiyun = user.getClockStar(date);
    //男女运数区别
    if(sex == 0){
        bigyun = user.getNvYun(bigyun);
        smallyun = user.getNvYun(smallyun);
        nianyun = user.getNvYun(nianyun);
        yueyun = user.getNvYun(yueyun);
        riyun = user.getNvYun(riyun);
        shiyun = user.getNvYun(shiyun);
    }
    return bigyun+''+smallyun+''+nianyun+''+yueyun+''+riyun+''+shiyun;
}
function getHuangdili(year,month,date){
    var jqData = comm.getJqData();
    var info = jqData[year.toString()];
    var returnyear=parseInt(year);
    var curdate=new Date(year+"/"+month+"/"+date);
    if(curdate < (new Date(info[0].date))){
        info= jqData[(year-1).toString()];
        returnyear--;
    }
    var returnmonth=0;
    var index_i=0;
    for(var i=22;i>=0;i-=2){
        if(new Date(info[i].date)<=curdate){
            returnmonth=i/2+1;
            index_i=i;
            break;
        }
    }
    returnyear=returnyear+2697;
    var returndate=parseInt(Math.abs(curdate.getTime()  -  new Date(info[index_i].date).getTime())  /  1000  /  60  /  60  /24)+1;
    return returnyear+"年"+returnmonth+"月"+returndate+"日";
}