var db = require('./../dao/message_dao');
var flowerdb = require('./../dao/flower_dao');
var talkdb = require('./../dao/talk_dao');
var response = require('../routes/common/response');
var JPush = require("jpush-sdk");
var client = JPush.buildClient('1b887473b8cc2eac1a6d60fa', 'aeb3c3b64505ce49fa11b8cc');

exports.onGetMessageByUid = function(req,res){
    var callback=null;
    db.getMessageByUid(req.body["uid"],function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};

exports.onSendMessage = function(req,res){
    var callback=null;
    var fromuid = req.body["fromuid"];
    var fromuname = req.body["fromuname"];
    var uid = req.body["uid"];
    var uname = req.body["uname"];
    var content = req.body["content"];
    var type = req.body["type"];
    var flower=0;
//    if(req.body["systemType"]=="android"||req.body["systemType"]=="ios"){
        if(type=="1"||type=="5"||type=="10"||type=="11"||type=="13"||type=="14"){
            client.push().setPlatform('ios', 'android')
                .setAudience(JPush.alias(uid))
                .setNotification(content, JPush.ios(content, 'happy', '+1'))
                .setOptions(null, 86400, null, true)
                .send(function(err, res) {
                    if (err) {
                        console.log(err.message);
                    } else {
                    }
                });
        }else if(type=="2"){
            content=fromuname+"("+fromuid+")"+"请求加您为好友。";
            client.push().setPlatform('ios', 'android')
                .setAudience(JPush.alias(uid))
                .setNotification(content, JPush.ios(content, 'happy', '+1'))
                .setOptions(null, 86400, null, true)
                .send(function(err, res) {
                    if (err) {
                        console.log(err.message);
                    } else {
                    }
                });
        }else if(type=="3"){
            content=fromuname+"("+fromuid+")"+"请求关注您。";
            client.push().setPlatform('ios', 'android')
                .setAudience(JPush.alias(uid))
                .setNotification(content, JPush.ios(content, 'happy', '+1'))
                .setOptions(null, 86400, null, true)
                .send(function(err, res) {
                    if (err) {
                        console.log(err.message);
                    } else {
                    }
                });
        }else if(type=="4"){
            client.push().setPlatform('ios', 'android')
                .setAudience(JPush.alias(uid))
                .setNotification(content, JPush.ios(content, 'happy', '+1'))
                .setOptions(null, 86400, null, true)
                .send(function(err, res) {
                    if (err) {
                        console.log(err.message);
                    } else {
                    }
                });
        }else if(type=="6"){
            content="收到"+fromuname+"("+fromuid+")"+"送来的福报。";
            client.push().setPlatform('ios', 'android')
                .setAudience(JPush.alias(uid))
                .setNotification(content, JPush.ios(content, 'happy', '+1'))
                .setOptions(null, 86400, null, true)
                .send(function(err, res) {
                    if (err) {
                        console.log(err.message);
                    } else {
                    }
                });
        }else if(type=="9"){
            flower=content;
            content="收到"+fromuname+"("+fromuid+")"+"送来的"+flower+"朵莲花。";
            client.push().setPlatform('ios', 'android')
                .setAudience(JPush.alias(uid))
                .setNotification(content, JPush.ios(content, 'happy', '+1'))
                .setOptions(null, 86400, null, true)
                .send(function(err, res) {
                    if (err) {
                        console.log(err.message);
                    } else {
                    }
                });
        }else if(type=="12"){
            content=fromuname+"("+fromuid+")"+"已同意您的关注请求。";
            client.push().setPlatform('ios', 'android')
                .setAudience(JPush.alias(uid))
                .setNotification(content, JPush.ios(content, 'happy', '+1'))
                .setOptions(null, 86400, null, true)
                .send(function(err, res) {
                    if (err) {
                        console.log(err.message);
                    } else {
                    }
                });
        }
//    }
    if(type=="9"){
        flowerdb.sendFlower(fromuid,fromuname,uid,uname,flower,function(err,result){
            if(err){
                return response.end(res,response.buildError(err.code),callback);
            }else{
                db.addMessage(0,uid,uname,fromuid,fromuname,content,type,function(err1,result1){
                    if(err1){
                        return response.end(res,response.buildError(err1.code),callback);
                    }
                    response.end(res,response.buildOK(),callback);
                });
            }
        })
    }else{
        var cid=0;
        if(req.body["cid"]){
            cid=req.body["cid"];
        }
        db.addMessage(cid,uid,uname,fromuid,fromuname,content,type,function(err,result){
            if(err){
                return response.end(res,response.buildError(err.code),callback);
            }
            response.end(res,response.buildOK(),callback);
        });
    }

};

exports.onAddMessage = function(req,res){
    var callback=null;
    var fromuid = req.body["fromuid"];
    var fromuname = req.body["fromuname"];
    var uid = req.body["uid"];
    var uname = req.body["uname"];
    var content = req.body["content"];
    var type = req.body["type"];
    if(type=="1"||type=="5"||type=="10"||type=="11"||type=="13"||type=="14"){
        client.push().setPlatform('ios', 'android')
            .setAudience(JPush.alias(uid))
            .setNotification(content, JPush.ios(content, 'happy', '+1'))
            .setOptions(null, 86400, null, true)
            .send(function(err, res) {
                if (err) {
                    console.log(err.message);
                } else {
                }
            });
    }
    db.addMessage(0,uid,uname,fromuid,fromuname,content,type,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};

exports.addWeiduMessage = function(req,res){
    var callback=null;
    talkdb.getWeiduList(req.body["uid"],function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }else{
            if(typeof(list)!="undefined"&&list.length>0){
                list.forEach(function(item){
                    var fromuid = item.fromUid;
                    var fromuname = item.name;
                    var uid = item.toUid+"";
                    var content="来自"+fromuname+"("+fromuid+")的未读消息。";
                    client.push().setPlatform('ios', 'android')
                        .setAudience(JPush.alias(req.body["uid"]))
                        .setNotification(content, JPush.ios(content, 'happy', '+1'))
                        .setOptions(null, 86400, null, true)
                        .send(function(err, res) {
                            if (err) {
                                console.log(err.message);
                            } else {
                            }
                        });
                    talkdb.updateStatusByUid(uid,function(err2,result2){
                        if(err){
                            return response.end(res,response.buildError(err2.code),callback);
                        }else{
                            db.addMessage(0,uid,"",fromuid,fromuname,content,1,function(err,result){
                                if(err){
                                    return response.end(res,response.buildError(err.code),callback);
                                }
                                response.end(res,response.buildOK(),callback);
                            });
                        }
                    });
                });
            }else{
                response.end(res,response.buildOK(),callback);
            }
        }
    });
};

exports.onUpdateMessageById = function(req,res){
    var callback=null;
    var uid = req.body["uid"];
    var detail = req.body["detail"];
    db.updateMessageById(uid,detail,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
    });
};

exports.onDelMessage = function(req,res){
    var callback=null;
    var mid = req.body["mid"];
    db.delMessageById(mid,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildOK(),callback);
    });
};
exports.onDelMessageByUid = function(req,res){
    var callback=null;
    var uid = req.body["uid"];
    db.delMessageByUid(uid,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildOK(),callback);
    });
};