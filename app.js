
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var webreg = require('./routes/webreg');
var http = require('http');
var path = require('path');
var flash = require('connect-flash');
var login = require('./routes/login.js');
var reg = require('./routes/reg.js');
var modifyInfo = require('./routes/modifyInfo.js');
var xianmiao = require('./routes/xianmiao.js');
var maker = require('./routes/dataMaker.js');
var todayInfo = require('./routes/todayInfo.js');
var khfk = require('./routes/khfk.js');
var comm = require('./common.js');
var userManager = require('./routes/userManager.js');
var deviceid = require('./routes/deviceid.js');
var participle = require('./routes/participle.js');
var voice_query = require('./routes/voice_query.js');
var voice_query1 = require('./routes/voice_query1.js');
var set_colour = require('./routes/set_colour.js');
var get_colour = require('./routes/get_colour.js');
var feedback = require('./routes/feedback.js');
var contacts = require('./routes/contacts.js');
var compass = require('./routes/compass.js');
var select_date = require('./routes/select_date.js');
var match = require('./routes/match.js');
var user_query = require('./routes/user_query.js');
var add_bless = require('./routes/add_bless.js');
var reg_4_wechat = require('./routes/reg_4_wechat.js');
var modify_info_4_wechat = require('./routes/modify_info_4_wechat.js');
var voice_query_4_wechat = require('./routes/voice_query_4_wechat.js');
var user_query_4_wechat = require('./routes/user_query_4_wechat.js');
var push_4_index = require('./routes/push_4_index.js');
var push_4_friend = require('./routes/push_4_friend.js');
var push_4_login = require('./routes/push_4_login.js');
var attention = require('./routes/attention.js');
var get_energy = require('./routes/get_energy.js');
var get_support_question = require('./routes/get_support_question.js');
var give_away_bless = require('./routes/give_away_bless.js');
var get_bless = require('./routes/get_bless.js');
var get_luck = require('./routes/get_luck.js');
var reg_notice = require('./routes/reg_notice.js');
var lunar_calendar = require('./routes/lunar_calendar.js');
var survey_feedback = require('./routes/survey_feedback.js');
var community = require('./action/community_action.js');
var user_detail = require('./action/user_action.js');
var message = require('./action/message_action.js');
var friend = require('./action/friend_action.js');
var talk = require('./action/talk_action.js');
var payrecord = require('./action/payrecord_action.js');

var segment = require("nodejieba");
segment.loadDict("./node_modules/nodejieba/dict/jieba.dict.utf8", "./node_modules/nodejieba/dict/hmm_model.utf8");

var app = express();

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride()); //֧�ֶ���http����������Put,delete�ȣ������������֧��
app.use(express.cookieParser('your secret here'));

app.use(express.session());
//app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//��ʼ�����
comm.init();

app.get('/', routes.index);
app.get('/dateDetail', routes.dateDetail);
app.post('/login', login.onLogin);
app.get('/webreg', webreg.reg);
app.post('/webreg', webreg.onPostReg);
app.post('/webreg_flystar', webreg.onFlystar);
app.post('/reg', reg.onReg);
app.post('/deviceid', deviceid.onPostId);
app.post('/modifyInfo', modifyInfo.onModify);
app.post('/xianmiao', xianmiao.onXianMiao);
app.post('/todayinfo', todayInfo.onGetInfo);
app.get('/todayinfo', todayInfo.onGetInfo);
app.post('/userinfo', userManager.onGetInfo);
app.post('/khfk', khfk.onFk);
app.post('/participle', participle.onParticiple);
app.post('/voice_query', voice_query.onVoiceQuery);
app.get('/voice_query', voice_query1.onVoiceQuery);
app.post('/set_colour', set_colour.onSetColour);
app.post('/get_colour', get_colour.onGetColour);
app.post('/feedback', feedback.onFeedback);
app.post('/contacts', contacts.onContract);
app.post('/edit_contacts', contacts.onEditContracts);
app.post('/compass', compass.onCompass);
app.post('/select_date', select_date.onSelectDate);
app.post('/select_time', select_date.onSelectTime);
app.post('/match', match.onMatch);
app.get('/match', match.onMatch2);
app.post('/user_query', user_query.onUserQuery);
app.post('/add_bless', add_bless.onAddBless);
app.post('/reg_4_wechat', reg_4_wechat.onRegForWeChat);
app.post('/modify_info_4_wechat', modify_info_4_wechat.onModifyForWeChat);
app.post('/voice_query_4_wechat', voice_query_4_wechat.onVoiceQueryForWeChat);
app.post('/user_query_4_wechat', user_query_4_wechat.onUserQueryForWeChat);
app.post('/push_4_index', push_4_index.onPushForIndex);
app.post('/push_4_friend', push_4_friend.onPushForFriend);
app.post('/push_4_login', push_4_login.onPushForLogin);
app.post('/attentions', attention.onAttention);
app.post('/get_energy', get_energy.onGetEnergy);
app.post('/get_support_question', get_support_question.onGetSupportQuestion);
app.post('/give_away_bless', give_away_bless.onGiveAwayBless);
app.post('/find_bless', get_bless.onFindNewReceiveBless);
app.post('/get_bless', get_bless.onGetBless);
app.post('/get_luck', get_luck.onGetLuck);
app.get('/reg_notice', reg_notice.onRegNotice);
app.get('/friendjy', reg_notice.onFriendJy);

app.get('/add_topic', community.onAddTopic);
app.get('/add_comment', community.onAddComment);
app.get('/add_topic_user', community.onAddTopicUser);
app.get('/del_topic', community.onDelTopic);
app.get('/del_comment', community.onDelComment);
app.get('/del_topic_user', community.onDelFromTopicUser);
app.get('/get_topic_by_uid', community.onGetTopicByUserId);
app.get('/get_hot_topic', community.onGetHotTopicList);
app.get('/get_comm_list', community.onGetCommList);
app.get('/get_topic_list', community.onGetTopicList);
app.get('/get_topic_by_id', community.onGetTopicById);

app.get('/add_friend', friend.onAddFriend);
app.get('/edit_friend', friend.onEditFriend);
app.get('/del_friend', friend.onDelFriend);
app.get('/get_friend_list', friend.getFriendList);
app.get('/get_friend_by_id', friend.getFriendById);

app.get('/get_msg_list', message.onGetMessageById);

app.get('/get_user_detail', user_detail.onGetUserDetailById);
app.post('/user_flower', user_detail.onUpdateFlower);

app.get('/lunarToSolar', lunar_calendar.lunarToSolar);
app.get('/survey_feedback', survey_feedback.onSurveyFeedback);
app.get('/authcode', login.authcode);
app.get('/talk/getFriendList', talk.getFriendList);
app.get('/talk/addFriend', talk.onAddFriend);
app.get('/talk/getHistory', talk.getHistory);

app.get('/get_record_list', payrecord.getRecordList);
app.get('/add_record', payrecord.onAddRecord);
app.get('/check_record', payrecord.checkRecord);

userManager.GetInstance();

//maker.makeData(1940, 2051);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
require('./talk.js').init();