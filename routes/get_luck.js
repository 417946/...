/**
 * Created by King Lee on 14-12-23.
 */
var analysis = require('./module/analysis');
var consts = require('./util/consts');

exports.onGetLuck = function(req,res){
    var result = { error: "" };
    var uid = req.body['uid'];
    var year = req.body['year'];    //  1970-????
    var month = req.body['month'];  //  0-11
    var date = req.body['date'];    //  1-31
    var cur_time = new Date(parseInt(year),parseInt(month),parseInt(date));
    analysis.getLuck2(uid,consts.TYPE_TIME.TYPE_TIME_TODAY,consts.TYPE_SCORE.TYPE_SCORE_LUCK,cur_time,function(answer){
        result.score = answer.score;
        result.level = answer.level;
        //  replace date
        var src_text = "今日";
        var des_text = (month + 1) + "月" + date + "日";
        answer.desc = answer.desc.replace(src_text,des_text);
        result.desc = answer.desc;
        console.log(result);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
};