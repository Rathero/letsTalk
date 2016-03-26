var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var roberDB = require('./roberDB');
var RoberDB = new roberDB('mysql-letstalk.alwaysdata.net', 'letstalk_data', 'letstalk', 'letstalkapp');
var log = require('color-logs')(true, true, __filename);
app.set('port', (process.env.PORT || 5000));
var async = require('async');

app.use(express.static(__dirname + '/public'));
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

main();

/* LOGIC */

function main () {
	log.info('Inicializando mobile-api para Lets Talk...');
	RoberDB.connectDB();
}
app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/talks', talks);

app.post('/talks', postTalk);

app.post('/messages', postMessage);

app.get('/talks/:talkId/messages', messages);

var callback =  function (error, result, waterfallCallback) {
					waterfallCallback (error, result);
				};

function postTalk(req, res){
    log.info("Req: POST Talk");
	async.waterfall([
			function (waterfallCallback) {
				RoberDB.saveTalk(req.body, function (error, result) {
					waterfallCallback (error, result);
				});
			}
		]
		,function (error, result) {
			res.status(200).json(result)
	});
}

function talks (req, res) {
	log.info("Req: Talks");
	async.waterfall([
			function (waterfallCallback) {
				RoberDB.requestTrendingTalks(function (error, result) {
					waterfallCallback (error, result);
				});
			}
		]
		,function (error, result) {
			res.status(200).json(result)
	});
}

function messages(req, res){
    log.info("Req: GET Messages");
	async.waterfall([
			function (waterfallCallback) {
				RoberDB.requestMessagesByTalk(req.params.talkId, function (error, result) {
					waterfallCallback (error, result);
				});
			}
		]
		,function (error, result) {
			res.status(200).json(result)
	});
    
}


function postMessage(req, res){
    log.info("Req: POST MEssage");
	async.waterfall([
			function (waterfallCallback) {
				RoberDB.saveMessage(req.body, function (error, result) {
					waterfallCallback (error, result);
				});
			}
		]
		,function (error, result) {
			res.status(200).json(result)
	});
    
}
