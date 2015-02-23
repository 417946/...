/**
 * Created by zoey on 15-2-16.
 */
var db = require('./mysql/dboperator');
var userInfo = require('./userInfo.js').userInfo;
var user = require('./user.js');
var analysis = require('./module/analysis');
/**
 * 男女三件事
 * @param req
 * @param res
 */
exports.onRegNotice = function(req,res){
    //解析生日
    var strDate = req.query['birthday'];
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
    while(flag){
        if(userInfo.flystar){
            flag=false;
            userInfo.yangSum=userInfo.yangSum1;
            userInfo.year_star=userInfo.nianyun;
            db.getBaseXg(userInfo,function(){
//                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                r.a="您是一位"+userInfo.baseXg;
                console.log(JSON.stringify(userInfo))
                analysis.getYun4Yc(userInfo,4,null,false,"yc",function(desc){
                    r.b="一四年您运程（中等），事业（小衰），在6月左右，"+desc;

                    var ten1=[2008,2007,2006,2014,2013,2012,2011,2010,2009];
                    var ten0=[2013,2014,2006,2007,2008,2009,2010,2011,2012];
                    var highWaiStar=0;//取其余星五行分值(已考虑四季，出生地影响) 最高的一颗外飞星
                    var tempHighValue=0;
                    var waiStarList=[userInfo.bigyun,userInfo.smallyun,userInfo.yueyun,userInfo.riyun,userInfo.shiyun]
                    for(var i in waiStarList){
                        var temp=userInfo.wwxNum[waiStarList[i]-1];
                        if(tempHighValue<temp){
                            tempHighValue=temp;
                            highWaiStar=waiStarList[i];
                        }
                    }
                    analysis.getYun4Yc(userInfo,8,highWaiStar,null,"yc",function(desc){
                        var nian=userInfo.sex==0?ten0[highWaiStar-1]:ten1[highWaiStar-1];
                        r.c="过去10年中，您的运程（顺），事业（中等），在"+nian+"年，"+desc;
                        res.json(r);
                    });
                });
            })
        }
    }
};