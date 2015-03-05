var LunarCalendar = require("lunar-calendar");
var response = require('./common/response')
//当用户点击登陆按钮时被触发
exports.lunarToSolar = function(req,res){

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    result = LunarCalendar.lunarToSolar(req.body['year'],req.body['month'],req.body['day']);
//    res.end(JSON.stringify(result));
    res.end(res,response.buildResponse(response.OK,result),callback);
};