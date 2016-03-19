var express = require('express');
var app = express();
var roberDB = require('./roberDB');
var RoberDB = new roberDB('mysql-letstalk.alwaysdata.net', 'letstalk_data', 'letstalk', 'letstalkapp');
var log = require('color-logs')(true, true, __filename);
app.set('port', (process.env.PORT || 5000));
var async = require('async');

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

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