var crypto = require('crypto');
var db = require('./mysql/dboperator')
var tools = require('./tools/tools')
var log = require('../common').log;
var user = require('./user');
var todayInfo = require('./todayInfo.js');
var userManager = require('./userManager.js');

var userInfo = require('./userInfo.js').userInfo;

//当用户点击登陆按钮时被触发
exports.onLogin = function(req,res){

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });

    //检验ID
    result = { error: "" };
    if(!req.body['uid']){
        result.error = '请输入您的ID';
        res.end(JSON.stringify(result));
    }
    //检查密码
    else if (!req.body['pass']) {
        result.error = '请输入您的密码';
        res.end(JSON.stringify(result));
    }
    else {
        log("user:" + req.body['uid'] + " login with password:" + req.body['pass']);
        var info = new userInfo();
        info.uid = req.body['uid'];
        info.password = req.body['pass'];

        db.userLogin(info, function (err) {
            //查询失败
            if (err) {
                result.error = err;
            }
            res.end(JSON.stringify(result));
        });
    }
    
};

var response = require('./common/response')
var _ = require('underscore');
var nodemailer = require('nodemailer');
var http =require('http');
var check =require('./util/check');
/**
 * 发送验证码
 * @param arg phone/email
 */
exports.authcode = function (req, res) {
    var authnum =/*123456;zyytmp*/_.random(100000,999999);
    var content = authnum+"（验证码）如非本人操作，请忽略本短信。";
    console.log(content);
    var key = "a2ce1cc346b221d86dc9";
    var user = "zoey4lee";
    var arg = req.query.arg;
    if(check.isPhone(arg)) {
        var MESSAGE_URL = 'http://utf8.sms.webchinese.cn/?Uid='+user+'&Key='+key+'&smsMob='+arg+'&smsText='+content;
        console.log(MESSAGE_URL)
        var httpReq = http.request(MESSAGE_URL, function (result) {

            result.on('data', function (chunk) {
                if(chunk>0){
                    console.log("session="+JSON.stringify(req.session));
                    if(req.session.auth){
                        var interval = util.timestamp() - req.session.auth.timestamp ;
                        if(interval < 3*1000){ //3秒之后，才能重新发送验证码，防止被攻击
                            return ;
                        }
                    }
//                    req.session.auth = {'authcode' : authnum , 'timestamp' : util.timestamp()};
                    return res.json(response.buildResponse(response.OK , "发送成功，请等待。 "+content));
                }
                console.log('BODY: ' + chunk);
            });
            result.on('error', function (err) {
                console.log('RESPONSE ERROR: ' + err);
                return res.json(response.buildError("发送失败"));
            });
        });
        httpReq.end();
    }else if(check.isEmail(arg)){
        content = "<b>您好，感谢您注册万历，<br>验证码:"+authnum+" （在10分钟内有效，10分钟后需要重新提交） </b>"+
            "<br><br><div style='color:#8d8d8d'>本邮件由系统自动发送，请勿直接回复！如有任何疑问，请联系我们的客服人员。"+
            "<br>联系方式：QQ：<span style='border-bottom:1px dashed #ccc;z-index:1'>417946;</span></div>";
        //res.json(response.buildError("不是手机号码"));
        var transporter = nodemailer.createTransport({
            service: '163',
            auth: {
                user: 'wanli20150309@163.com',
                pass: '383492'
            }
        });

        var mailOptions = {
            from: '万历<wanli20150309@163.com>', // sender address
            to: arg, // list of receivers
            subject: '万历 邮箱激活验证邮件', // Subject line
            html: content// plaintext body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
            }else{
                console.log('Message sent: ' + info.response);
            }
        });
    }
    return res.json(response.buildResponse(response.OK , authnum ));
};