/**
 * Created by zoey on 2015/6/25.
 */
var path = require('path');
exports.config = {
    upload_dir: path.join(__dirname, 'public', 'upload'),
    upload_talk_dir: path.join(__dirname, 'public', 'upload/talk/img'),
    upload_talk_voice_dir: path.join(__dirname, 'public', 'upload/talk/voice')
};



