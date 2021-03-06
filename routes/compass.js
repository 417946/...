/**
 * Created by King Lee on 14-9-25.
 */
var db = require('./mysql/dboperator');
var userInfo = require('./userInfo.js').userInfo;
var user = require('./user.js');
var analysis = require('./module/analysis');
var modifyInfo = require('./modifyInfo');

exports.onCompass = function(req,res){
    var uid = parseInt(req.body["uid"]);
    var type = parseInt(req.body["type"]);
    var result = { error: "" };
    analysis.getCompass(uid,type,function(scores){
        result.scores = scores;
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
};

exports.onCompassNouser = function(req,res){
    var info = modifyInfo.nouserModify(new Date(req.body["birthday"]).format("yyyyMMddhhmmss").toString(),req.body["sex"]);
    var type = parseInt(req.body["type"]);
    var result = { error: "" };
    analysis.getCompassByInfo(info,type,function(scores){
        result.scores = scores;
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
};

exports.onCompassByFlystar = function(req,res){
    var date=new Date();
    var nianyun = user.getYearStar(date);
//    var yueyun = user.getMonthStar(date);
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

    var yearStar = nums[nianyun-1][req.body['num1']-1];
//    var monthStar = nums[yueyun-1][req.query['num2']-1];
    var dayStar = nums[riyun-1][req.body['num3']-1];
    var hourStar = nums[shiyun-1][req.body['num4']-1];
    var sex = parseInt(req.body["sex"]);
    var type = parseInt(req.body["type"]);
    var result = { error: "" };
    analysis.getCompassByFlystar(yearStar,dayStar,hourStar,sex,type,function(scores){
        result.scores = scores;
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
};