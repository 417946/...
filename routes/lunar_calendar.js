var LunarCalendar = require("lunar-calendar");
var response = require('./common/response')
//当用户点击登陆按钮时被触发
exports.lunarToSolar = function(req,res){
    var result = LunarCalendar.lunarToSolar(req.query['year'],req.query['month'],req.query['day']);
    var callback=null;
    console.log(JSON.stringify(result))
    response.end(res,response.buildResponse(response.OK,result),callback);
};