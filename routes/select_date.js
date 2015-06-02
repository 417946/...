/**
 * Created by King Lee on 14-9-25.
 */
var db = require('./mysql/dboperator');
var userInfo = require('./userInfo.js').userInfo;
var analysis = require('./module/analysis');
var user = require('./user.js');

exports.onSelectDate = function(req,res){
    var uid = parseInt(req.body["uid"]);
    var select_date_type = parseInt(req.body["select_date_type"]);
    var days_type = parseInt(req.body["days_type"]);
    var result = { error: "" };
    analysis.getSelectDate(uid,select_date_type,days_type,function(date){
        result.date = date;
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
            console.log(date)
            console.log(maxMonth)
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
            result.desc = "算的真不容易呀！根据你本人的命理，最合适的日期是："+date[0];
            result.date = date.splice(1);
        }else{
            result.desc = "报歉，此期间没算出合适的日子，随缘吧。";
        }
        console.log(result);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });

};


exports.onSelectTime = function(req,res){
    var uid = parseInt(req.body["uid"]);
    var result = { error: "",data:"" };
    result["data"]=user.getZeshi(new Date(req.body["date"]));
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(result));

};