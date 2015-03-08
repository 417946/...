/**
 * Created by Administrator on 2014/7/19.
 */
var validator = require('validator');

/*
验证email
 */
exports.isEmail = function(str){
    return validator.isEmail(str);
};

/*
验证手机号码
 */
exports.isPhone = function(str){
    return /^1\d{10}$/.test(str);
};

/*
身份证
 */
exports.isIDCard = function(str){
    return /"^[1-9]([0-9]{14}|[0-9]{17})$"/.test(str);
};