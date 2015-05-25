/**
 * Created by zoey on 2015/5/24.
 */
var db = require('./dao/talk_dao');
function init(){
    var io = require('socket.io').listen(8080);
//io监听socket事件
    var clients = [];
    io.on('connection', function (connection) {
        console.log((new Date()) + ' Connection from origin ' + connection.id + '.');
        var json = { logicId:"conn_success"};
        connection.json.send(json);
        console.log((new Date()) + ' Connection accepted.');

        connection.on('message', function (message) {
            console.log(message);
            if (message.logicId == "login") {
//            clients[message.fromUid] = connection; //将用户名与连接对应
//            connection.fromUid = message.fromUid;
            }else if(message.logicId == "chat") {//用户发起会话
                clients[message.fromUid] = connection; //将用户名与连接对应
                connection.fromUid = message.fromUid;
                //1、查找该用户是否有历史消息
                var toUser = message.toUid;//会话目标
                //2、检查目标用户是否在线，若在线，转发用户请求
                db.addContent(message)
                connection.json.send(message);
                var objConnect = clients[toUser];
                if (objConnect) {
                    objConnect.json.send(message);
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