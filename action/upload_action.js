/**
 * Created by zoey on 2015/6/26.
 */
var response = require('../routes/common/response');
var fs 		   = require('fs');
var path 	   = require('path');
var config = require('../config').config;
/**
 * 上传模块
 **/
exports.upload = function(req, res) {
    var callback=null;
    // Parse file.
    if(req.files) {
        var file=req.files.img;
        // Read file.
        fs.readFile(file.path, function (err, data) {
            var name=new Date().getTime()+'.'+file.name.split('\.')[1];
            console.log(config.upload_talk_dir);
            var p = path.join(config.upload_talk_dir, name);
            // Save file.
            fs.writeFile(p, data, 'utf8', function (err) {
                if (err) {
                    console.log(err)
                    return res.json(response.buildError('Something went wrong!'));
                } else {
//                        res.json(response.buildOK('/uploads/'+p));
                    var up_img='http://115.29.42.238:5000/upload/talk/img/'+name;
                    return res.json(response.buildOK(up_img));
                }
            });
        });
    }
};