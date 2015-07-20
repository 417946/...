/**
 * Created by zoey on 2015/5/24.
 */
var db = require('./dao/talk_dao');
var msgdb = require('./dao/message_dao');
exports.init=function(){
    var io = require('socket.io').listen(8080);
//io监听socket事件
    var clients = [];
    io.on('connection', function (connection) {
//        console.log((new Date()) + ' Connection from origin ' + connection.id + '.');
        var json = { logicId:"conn_success"};
        connection.json.send(json);
//        console.log((new Date()) + ' Connection accepted.');

        connection.on('message', function (message) {
//            console.log(message);
            if (message.logicId == "login") {
            clients[message.fromUid] = connection; //将用户名与连接对应
            connection.fromUid = message.fromUid;
            }else if(message.logicId == "chat") {//用户发起会话
                //1、查找该用户是否有历史消息
                var toUser = message.toUid;//会话目标
                //2、检查目标用户是否在线，若在线，转发用户请求
                if (message.msg_type == "1" || message.msg_type == "5") {
                    db.addContent(message)
                }
                message.datetime = new Date().format("yyyy-MM-dd hh:mm:ss");
                connection.json.send(message);
                var objConnect = clients[toUser];
                console.log("objConnect:" + objConnect);
                if (objConnect) {
                    objConnect.json.send(message);
                } else {
                    var JPush = require("./node_modules/jpush-sdk/lib/JPush/JPush.js");
                    var client = JPush.buildClient('9191662bec0b4c1e53a4bacb', 'dcd935740eabc1e1863488f9');
                    var content = message.content;
                    if (message.msg_type == "1" || message.msg_type == "5") {
                        var tmpcontent=message.fromUname+':' + content;
                        if(message.msg_type == "5"){
                            tmpcontent=message.fromUname+':[图片]';
                        }
                        client.push().setPlatform('ios', 'android')
                            .setAudience(JPush.alias(message.toUid))
                            .setNotification(tmpcontent, JPush.ios(tmpcontent, 'happy', '+1'))
                            .setOptions(null, 86400, null, true)
                            .send(function (err, res) {
                                if (err) {
                                    console.log(err.message);
                                } else {
                                }
                            });
                    }
//                    else if (message.msg_type == "2") {
//                        content = message.fromUname + "(" + message.fromUid + ")" + "请求加您为好友。";
//                        client.push().setPlatform('ios', 'android')
//                            .setAudience(JPush.alias(message.toUid))
//                            .setNotification(content, JPush.ios(content, 'happy', '+1'))
//                            .setOptions(null, 86400, null, true)
//                            .send(function (err, res) {
//                                if (err) {
//                                    console.log(err.message);
//                                } else {
//                                }
//                            });
//                    } else if (message.msg_type == "3") {
//                        content = message.fromUname + "(" + message.fromUid + ")" + "请求关注您。";
//                        client.push().setPlatform('ios', 'android')
//                            .setAudience(JPush.alias(message.toUid))
//                            .setNotification(content, JPush.ios(content, 'happy', '+1'))
//                            .setOptions(null, 86400, null, true)
//                            .send(function (err, res) {
//                                if (err) {
//                                    console.log(err.message);
//                                } else {
//                                }
//                            });
//                    } else if (message.msg_type == "4") {
//                        client.push().setPlatform('ios', 'android')
//                            .setAudience(JPush.alias(message.toUid))
//                            .setNotification(content, JPush.ios(content, 'happy', '+1'))
//                            .setOptions(null, 86400, null, true)
//                            .send(function (err, res) {
//                                if (err) {
//                                    console.log(err.message);
//                                } else {
//                                }
//                            });
//                    } else if (message.msg_type == "6") {
//                        content = "收到" + message.fromUname + "(" + message.fromUid + ")" + "送来的福报。";
//                        client.push().setPlatform('ios', 'android')
//                            .setAudience(JPush.alias(message.toUid))
//                            .setNotification(content, JPush.ios(content, 'happy', '+1'))
//                            .setOptions(null, 86400, null, true)
//                            .send(function (err, res) {
//                                if (err) {
//                                    console.log(err.message);
//                                } else {
//                                }
//                            });
//                    }
                    msgdb.addMessage(message.toUid,message.toUname,message.fromUid,message.fromUname,content,message.msg_type);
                }
            }
        });
        // user disconnected
        connection.on('disconnect', function (socket) {
            console.log("关闭连接:" + socket);
            if(connection.fromUid){
                delete clients[connection.fromUid];//删除用户的连接
            }
        });

    });
}