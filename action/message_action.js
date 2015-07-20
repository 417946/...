var db = require('./../dao/message_dao');
var flowerdb = require('./../dao/flower_dao');
var response = require('../routes/common/response');

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
    var JPush = require("../node_modules/jpush-sdk/lib/JPush/JPush.js");
    var client = JPush.buildClient('9191662bec0b4c1e53a4bacb', 'dcd935740eabc1e1863488f9');
    var flower;
//    if(req.body["systemType"]=="android"||req.body["systemType"]=="ios"){
        if(type=="1"||type=="5"){
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
        }
//    }
    if(type=="9"){
        flowerdb.sendFlower(fromuid,fromuname,uid,uname,flower,function(err,result){
            if(err){
                return response.end(res,response.buildError(err.code),callback);
            }else{
                db.addMessage(uid,uname,fromuid,fromuname,content,type,function(err1,result1){
                    if(err1){
                        return response.end(res,response.buildError(err1.code),callback);
                    }
                    response.end(res,response.buildOK(),callback);
                });
            }
        })
    }else{
        db.addMessage(uid,uname,fromuid,fromuname,content,type,function(err,result){
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
//    var rid=req.body["rid"];
    var JPush = require("../node_modules/jpush-sdk/lib/JPush/JPush.js");
    var client = JPush.buildClient('9191662bec0b4c1e53a4bacb', 'dcd935740eabc1e1863488f9');
    if(req.body["systemType"]=="android"||req.body["systemType"]=="ios"){
        if(type=="1"||type=="5"){
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
    }
    db.addMessage(uid,uname,fromuid,fromuname,content,type,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildOK(),callback);
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
    var callback=req.query.callback;
    var mid = req.body["mid"];
    db.delMessageById(mid,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildOK(),callback);
    });
};
exports.onDelMessageByUid = function(req,res){
    var callback=req.query.callback;
    var uid = req.body["uid"];
    db.delMessageByUid(uid,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildOK(),callback);
    });
};