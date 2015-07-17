var db = require('./../dao/friend_dao');
var response = require('../routes/common/response');
var fs 		   = require('fs');
var path 	   = require('path');
var config = require('../config').config;

exports.onAddFriend = function(req,res){
    var callback=null;
    // Parse file.
        if(req.files) {
            var file=req.files.head_img;
            // Read file.
            fs.readFile(file.path, function (err, data) {
                var name=new Date().getTime()+'.'+file.name.split('\.')[1];
                var p = path.join(config.upload_dir, name);
                // Save file.
                fs.writeFile(p, data, 'utf8', function (err) {
                    if (err) {
                        console.log(err)
                        return res.json(response.buildError('Something went wrong!'));
                    } else {
//                        res.json(response.buildOK('/uploads/'+p));
                        var user_id = req.body.user_id;
                        var sex = req.body.sex;
                        var birthday = req.body.birthday;
                        var head_img='http://115.29.42.238:5000/upload/'+name;
                        db.addFriend(req.body.name,user_id,sex,birthday,head_img,function(err,result){
                            if(err){
                                return response.end(res,response.buildError(err.code),callback);
                            }
                            response.end(res,response.buildOK(),callback);
                        });
                    }
                });
            });
        } else {
            var user_id = req.body.user_id;
            var sex = req.body.sex;
            var birthday = req.body.birthday;
            var head_img=req.body.head_img;
            db.addFriend(req.body.name,user_id,sex,birthday,head_img,function(err,result){
                if(err){
                    return response.end(res,response.buildError(err.code),callback);
                }
                response.end(res,response.buildOK(),callback);
            });
        }
};
exports.onEditFriend = function(req,res){
    var callback=null;
    // Parse file.
    if(req.files) {
        var file=req.files.head_img;
        // Read file.
        fs.readFile(file.path, function (err, data) {
            var name=new Date().getTime()+'.'+file.name.split('\.')[1];
            var p = path.join(config.upload_dir, name);
            // Save file.
            fs.writeFile(p, data, 'utf8', function (err) {
                if (err) {
                    console.log(err)
                    return res.json(response.buildError('Something went wrong!'));
                } else {
//                        res.json(response.buildOK('/uploads/'+p));
                    var fid = req.body["id"];
                    var sex = req.body["sex"];
                    var birthday = req.body["birthday"];
                    var head_img='http://115.29.42.238:5000/upload/'+name;
                    db.editFriend(fid,req.body["name"],sex,birthday,head_img,function(err,result){
                        if(err){
                            return response.end(res,response.buildError(err.code),callback);
                        }
                        response.end(res,response.buildOK(),callback);
                    });
                }
            });
        });
    } else {
        var fid = req.body["id"];
        var sex = req.body["sex"];
        var birthday = req.body["birthday"];
        db.editFriend(fid,req.body["name"],sex,birthday,"",function(err,result){
            if(err){
                return response.end(res,response.buildError(err.code),callback);
            }
            response.end(res,response.buildOK(),callback);
        });
    }
};
exports.onDelFriend = function(req,res){
    var callback=req.query.callback;
    var fid = req.query.fid;
    db.delFriend(fid,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildOK(),callback);
    });
};

exports.getFriendList = function(req,res){
    var callback=req.query.callback;
    db.getFriendList(req.query.uid,req.query.index,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};
exports.getFriendById = function(req,res){
    var callback=req.query.callback;
    db.getFriendById(req.query.fid,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};
exports.getContractByUid = function(req,res){
    var callback=req.query.callback;
    db.getContractByUid(req.query.uid,req.query.fid,req.query.status,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        response.end(res,response.buildResponse(response.OK,list),callback);
    });
};


