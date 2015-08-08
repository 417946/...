/**
 * Created by King Lee on 14-12-10.
 */
var db = require('./mysql/dboperator');
var userInfo = require('./userInfo.js').userInfo;
var colour_json = require('../config/colour');
var user = require("./user.js");

exports.onGetColour = function(req,res){
    var uid = parseInt(req.body["uid"]);
    var info = new userInfo();
    info.uid = uid;
    var result = { error: "" };
    db.getUserBaseInfo(info,function (err){
        if (err) {
            result.err = err;
            console.log(err + " getUserBaseInfo");
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
            return;
        }
        var year_star = parseInt(info["flystar"].charAt(2));
        var sex = info.sex;
        result.day_star = user.getDayStar(new Date());
        //男女运数区别
        if(sex == 0){
            result.day_star = user.getNvYun(result.day_star);
        }
        var colours = [];
        colours.push({"zwbs":colour_json[sex][0][year_star-1]});
        colours.push({"wys":colour_json[sex][1][year_star-1]});
        colours.push({"wcs":colour_json[sex][2][year_star-1]});
        colours.push({"wths":colour_json[sex][3][year_star-1]});
        result.colours = colours;
        console.log(result);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
};