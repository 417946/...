/**
 * Created by King Lee on 14-12-11.
 */
var db = require('./mysql/dboperator');

exports.onGetBless = function(req,res){
    var result = { error: "" };
    var id = req.body['id'];
    var uid = req.body['uid'];
    db.GetBless(id,uid,function(err,give_away_bless){
        if(err){
            result.err = err;
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
};
//查看该用户的未收取祝福
exports.onFindNewReceiveBless = function(req,res){
    var result = { error: "" };
    var uid = req.body['uid'];
    db.FindNewReceiveBless(uid,function(err,give_away_bless){
        if(err){
            result.err = err;
        }
        try{
            result.give_away_bless = give_away_bless;
        }catch(e){
            result.give_away_bless = [];
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
};
/*
exports.onGetBless = function(req,res){
    var result = { error: "" };
    var uid = req.body['uid'];
    db.GetBless(uid,function(err,give_away_bless){
        if(err){
            result.err = err;
        }
        try{
            result.give_away_bless = JSON.parse(give_away_bless);
        }catch(e){
            result.give_away_bless = [];
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(result));
    });
};
    */