/**
 * Created by Administrator on 2014/7/31.
 */

module.exports = {
    /*系统消息定义*/
    OK : 200 ,//操作成功
    FAIL : 400 ,//操作失败
    Unauthorized : 401 ,//没有授权
    ERROR : 500 ,//服务器内部错误

    AUTHCODE_ERROR : 20, //验证码错误
    AUTHCODE_DUE : 21 , //验证码过期


    /**用户消息定义*/
    PWD_ERROR : 41 , //密码不正确
    PWD_FORMAT_ERROR : 42 , //密码不符合规范
    PHONE_FORMAT_ERROR : 43 , //手机号码格式不正确
    PHONE_EXIST : 45 , //手机号码已经注册

    BLACKLIST : 44 , //用户被加入黑名单
    USER_NOT_EXIST : 46 , //用户不存在


    /**
     * 关于返回格式的说明
     * status : 状态值，具体定义见上面。
     * message : 消息描述。
     * data  : 返回数据集。在没有数据返回的情况下，可能为空。为了方便客户端统一处理，当数据集为空的时候，返回的也是空。
     *timestamp : 时间戳。只有在有数据集的情况下，才有时间戳。客户端可以根据时间戳来缓存数据。
     */
    buildResponse : function(status ,data, msg){
        var ret ;
        if(typeof(msg) === 'undefined' || msg == null || msg === ''){
            ret = {status: status, message: '', data: data };
        }else {
            ret = {status: status, data: data, message: msg , timestamp : Date.parse(new Date())};
        }
        return ret ;
    },

    buildOK : function(){
        return {status : 200 , message : ''};
    },

    buildError : function(message){
        return {status : 400 , message : message };
    },

    end : function(res,result,callback){
		if(callback){
			var a = JSON.stringify(result);
			res.end(callback+"('"+a+"')");
		}else{
			res.end( JSON.stringify(result));
		}
    }

};