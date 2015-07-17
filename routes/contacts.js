/**
 * Created by King Lee on 14-9-22.
 */
var db = require('./mysql/dboperator');
var talkdb = require('./../dao/talk_dao');
var userInfo = require('./userInfo.js').userInfo;
var analysis = require('./module/analysis');
var consts = require('./util/consts');
var async = require('async');

exports.onEditContracts = function (req, res) {
    var result = { error: "" };
    var uid=req.body["uid"];
    var fid=req.body["fid"];
    var fname=req.body["fname"];
    var edit_type=req.body["edit_type"];
    db.editContract(req.body["id"],uid,fid,fname,edit_type, function (err, contracts) {
        if(err){
            result.error = err;
            console.log(result);
        }else{
            talkdb.getFriendByUid(uid,contracts_uid,function(err2,list){
                if(err2){
                    console.log(err2);
                    result.err = err2;
                }else{
                    if(list.length>0){
                        res.json(result)
                    }else{
                        talkdb.addFriend(uid,req.body["uname"],contracts_uid,contracts_name,20,10,function(err1,result1){
                            if(err1){
                                console.log(err1);
                                result.err = err1;
                            }else{
                                res.json(result)
                            }
                        });
                    }
                }
            });
        }
    });
}

exports.onContract = function(req,res){
    var uid = parseInt(req.body["uid"]);
    var contracts_uid = parseInt(req.body["contracts_uid"]);
    var contracts_name = req.body["contracts_name"];
    var type = req.body["type"];
    var result = { error: "" };
    if("add" == type){
        db.addToContract(uid,contracts_uid,contracts_name,function(err){
            if(err){
                console.log(err);
                result.err = err;
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(result));
            }else{
                talkdb.getFriendByUid(uid,contracts_uid,function(err2,list){
                    if(err2){
                        console.log(err2);
                        result.err = err2;
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(result));
                    }else{
                        if(list.length>0){
                            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify(result));
                        }else{
                            talkdb.addFriend(uid,req.body["uname"],contracts_uid,contracts_name,20,10,function(err1,result1){
                                if(err1){
                                    console.log(err1);
                                    result.err = err1;
                                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                                    res.end(JSON.stringify(result));
                                }else{
                                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                                    res.end(JSON.stringify(result));
                                }
                            });
                        }
                    }
                });
            }
        });
    }else if("up" == type){
        var status = req.body["status"];
        db.editStatusContract(uid,contracts_uid,status,function(err){
            if(err){
                console.log(err);
                result.err = err;
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(result));
            }else{
                talkdb.getFriendByUid(uid,contracts_uid,function(err2,list){
                    if(err2){
                        console.log(err2);
                        result.err = err2;
                        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                        res.end(JSON.stringify(result));
                    }else{
                        if(list.length>0){
                            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                            res.end(JSON.stringify(result));
                        }else{
                            talkdb.addFriend(uid,req.body["uname"],contracts_uid,contracts_name,20,10,function(err1,result1){
                                if(err1){
                                    console.log(err1);
                                    result.err = err1;
                                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                                    res.end(JSON.stringify(result));
                                }else{
                                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                                    res.end(JSON.stringify(result));
                                }
                            });
                        }
                    }
                });
            }
        });
    }else if("del" == type){
        var status = req.body["status"];
        db.editStatusContract(uid,contracts_uid,status,function(err){
            if(err){
                console.log(err);
                result.err = err;
            }
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(result));
        });
    }else if("get" == type){
        var status = req.body["status"];
        db.getContract(uid,status,function(err,contracts){
            if(err){
                console.log(err);
                result.err = err;
            }
            //  get push for friend
            async.parallel([
                function (callback) {
                    var contracts_uid = contracts ? (contracts[0] ? contracts[0][0] : 0) : 0;
                    if(contracts_uid){
                        analysis.getInfo(contracts_uid, function (info) {
                            callback(null, info);
                        });
                    }else{
                        callback(null, null);
                    }
                },
                function (callback) {
                    var contracts_uid = contracts ? (contracts[1] ? contracts[1][0] : 0) : 0;
                    if(contracts_uid){
                        analysis.getInfo(contracts_uid, function (info) {
                            callback(null, info);
                        });
                    }else{
                        callback(null, null);
                    }
                },
                function (callback) {
                    var contracts_uid = contracts ? (contracts[2] ? contracts[2][0] : 0) : 0;
                    if(contracts_uid){
                        analysis.getInfo(contracts_uid, function (info) {
                            callback(null, info);
                        });
                    }else{
                        callback(null, null);
                    }
                },
                function (callback) {
                    var contracts_uid = contracts ? (contracts[3] ? contracts[3][0] : 0) : 0;
                    if(contracts_uid){
                        analysis.getInfo(contracts_uid, function (info) {
                            callback(null, info);
                        });
                    }else{
                        callback(null, null);
                    }
                },
                function (callback) {
                    var contracts_uid = contracts ? (contracts[4] ? contracts[4][0] : 0) : 0;
                    if(contracts_uid){
                        analysis.getInfo(contracts_uid, function (info) {
                            callback(null, info);
                        });
                    }else{
                        callback(null, null);
                    }
                }
            ],
                // optional callback
                function (err, results) {
                    // the results array will equal ['one','two'] even though
                    // the second function had a shorter timeout.
                    if(err){
                        console.log(err);
                    }
                    var push_message = [];
                    for (var i = 0; i < results.length; ++i) {
                        if (results[i]) {
                            var today_energy = analysis.getScore(results[i], consts.TYPE_TIME.TYPE_TIME_TODAY, consts.TYPE_SCORE.TYPE_SCORE_ENERGY, new Date());
                            var today_luck = analysis.getScore(results[i], consts.TYPE_TIME.TYPE_TIME_TODAY, consts.TYPE_SCORE.TYPE_SCORE_LUCK, new Date());
                            var message = null;
                            if (today_energy[0] < 60) {
                                message = "今日好友" + results[i].name + "能量较低，请速速为友送福，增幅转运。";
                            } else if (today_luck[0] < 60) {
                                message = "今日好友" + results[i].name + "运程较低，请速速为友送福，增幅转运。";
                            }
                            if (message) {
                                push_message.push(message);
                            }
                        }
                    }
                    result.push_message = push_message;
                    result.contracts = contracts;
                    console.log(result);
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify(result));
                });
        });
    }
};