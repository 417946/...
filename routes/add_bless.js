/**
 * Created by King Lee on 2014/11/16.
 */
var db = require('./mysql/dboperator');
var userInfo = require('./userInfo.js').userInfo;
//11
exports.onAddBless = function(req,res){
    var result = { error: "" };
    var uid = req.body['uid'];
    var bless = parseInt(req.body['bless']);
    db.getBless(uid,function(err,before_bless){
        if(err){
            console.log(err);
            result.err = err;
        }
        bless += before_bless;
//        var lotus =/*Math.floor(bless / 300) + */5;
        db.setBless(uid,bless,function(err){
            if(err){
                console.log(err);
            }
            result.bless = bless;
//            result.lotus = lotus;
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
        });
    });
};