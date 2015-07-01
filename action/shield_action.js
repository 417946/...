var db = require('./../dao/shield_dao');
var frienddb = require('./../dao/friend_dao');
var contactsdb = require('../routes/mysql/dboperator');
var response = require('../routes/common/response');
var config = require('../config').config;

exports.onAddShield = function(req,res){
    var callback=null;
    var uid = req.body.uid;
    var sid = req.body.sid;
    db.addShield(uid,sid,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }else{
            contactsdb.delFromContract(sid,uid,function(err1){
                if(err1){
                    return response.end(res,response.buildError(err1.code),callback);
                }else{
                    frienddb.delFriends(sid,uid,function(err2){
                        if(err2){
                            return response.end(res,response.buildError(err2.code),callback);
                        }else{
                            return response.end(res,response.buildOK(),callback);
                        }
                    });
                }
            });
        }
    });
};
exports.onDelShield = function(req,res){
    var callback=null;
    var uid = req.body.uid;
    var sid = req.body.sid;
    db.delShield(uid,sid,function(err,result){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildOK(),callback);
    });
};

exports.onGetShieldList = function(req,res){
    var callback=null;
    db.getShieldList(req.body.uid,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildResponse(response.OK,list),callback);
    });
};
exports.onGetShieldConList = function(req,res){
    var callback=null;
    db.getShieldConList(req.body.uid,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildResponse(response.OK,list),callback);
    });
};
exports.onGetShieldById = function(req,res){
    var callback=null;
    db.getShieldById(req.body.uid,req.body.sid,function(err,list){
        if(err){
            return response.end(res,response.buildError(err.code),callback);
        }
        return response.end(res,response.buildResponse(response.OK,list),callback);
    });
};


