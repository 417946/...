/**
 * Created by Administrator on 2014/7/31.
 */

module.exports = {
    /*系统消息定义*/
    OK : 200 ,//操作成功
    FAIL : 400 ,//操作失败
    Unauthorized : 401 ,//没有授权
    ERROR : 500 ,//服务器内部错误

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

    buildOK : function(data, msg){
//        return {status : 200 , message : ''};
        return this.buildResponse(200,data,msg);
    },

    buildError : function(message){
        return {status : 400 , message : message };
    },

    end : function(res,result,callback){
		if(callback){
			var a = JSON.stringify(result);
			res.end(callback+"('"+a+"')");
		}else{
//			res.end( JSON.stringify(result));
            res.json(result)
		}
    }

};