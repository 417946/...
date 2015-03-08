/**
 * Created by zoey on 2015/3/7.
 */
var db = require('./mysql/dboperator');
var response = require('./common/response')
/**
 * 意见反馈
 * @param req
 * @param res
 */
exports.onSurveyFeedback = function(req,res){
    var type = req.query['type'];
    var value = req.query['value'];
    var memo = req.query['memo'];
    db.createSurveyFeedback(type,value,memo,function(err){
        if(err){
            console.log(err);
        }
        if(res.affectedRows!=0){
            response.end(res,response.buildOK(),null);
        }else{
            response.end(res,response.buildError(),null);
        }
    });
};
