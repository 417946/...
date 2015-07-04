/**
 * Created by zoey on 2015/7/2.
 */
/**
 * 二十四节气数据，节气点时间（单位是分钟）
 * 从0小寒起算
 */
var termInfo = [0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
var DATA = {
    solarTerm: ['小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪','冬至'] //二十四节气
};
/**
 * 某年的第n个节气为几日
 * 31556925974.7为地球公转周期，是毫秒
 * 1890年的正小寒点：01-05 16:02:31，1890年为基准点
 * @param {Number} y 公历年
 * @param {Number} n 第几个节气，从0小寒起算
 * 由于农历24节气交节时刻采用近似算法，可能存在少量误差(30分钟内)
 */
function getTerm(y,n) {
    var offDate = new Date( ( 31556925974.7*(y-1890) + termInfo[n]*60000  ) + Date.UTC(1890,0,5,16,2,31) );
    return(offDate.getUTCDate());
};

/**
 * 获取公历年一年的二十四节气
 * 返回key:日期，value:节气中文名
 */
function getYearTerm(year){
    var res = {};
    var month = 0;
    for(var i=0;i<24;i++){
        var day = getTerm(year,i);
        if(i%2==0)month++
        res[formateDayD4(month-1,day)] = DATA.solarTerm[i];
    }
    return res;
};
var formateDayD4 = function(month,day){
    month = month+1;
    month = month<10 ? '0'+month : month;
    day = day<10 ? '0'+day : day;
    return 'd'+month+day;
};
exports.getTerm=getTerm;
exports.getYearTerm=getYearTerm;
exports.formateDayD4=formateDayD4;