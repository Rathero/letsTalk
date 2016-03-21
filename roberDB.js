var log = require('color-logs')(true, true, __filename);
var mysql = require('mysql');

function RoberDB(host, db, user, password){
	this.host = host;
	this.user = user;
	this.pass = password;
	this.database = db;
    this.connection;
}

RoberDB.prototype.connectDB = function () {

	log.info('Conectando a DB...');

	this.connection = mysql.createConnection({
			host     : this.host,
			user     : this.user,
			password : this.pass,
			database : this.database
		});

	this.connection.connect();
}


RoberDB.prototype.requestTrendingTalks = function (callback) {

	var sql  = 'SELECT * FROM talks order by `id` desc limit 0,30';
	var inserts = [];
	sql = mysql.format(sql, inserts);
	log.debug(sql);
		this.connection.query(sql, function(err, rows, fields) {
		  if (err) throw err;

		  callback(err, rows);
		});
}

RoberDB.prototype.requestMessagesByTalk = function (id, callback) {

	var sql  = 'SELECT * FROM  `messages` WHERE  `talk_id` =' + id + ' ORDER BY  `creation_date` DESC LIMIT 0 , 30';
	var inserts = [];
	sql = mysql.format(sql, inserts);
	log.debug(sql);
		this.connection.query(sql, function(err, rows, fields) {
		  if (err) throw err;

		  callback(err, rows);
		});
}

RoberDB.prototype.saveTalk = function (talk, callback) {

	var sql  = 'INSERT INTO `letstalk_data`.`talks`(`id`, `title`, `description`,`user_creator`) VALUES (NULL, \'' + talk.title + '\',\'' + talk.description + '\',1);';
	var inserts = [];
	sql = mysql.format(sql, inserts);
	log.debug(sql);
		this.connection.query(sql, function(err, rows, fields) {
		  if (err) throw err;
		  callback(err, rows);
		});
}

RoberDB.prototype.saveMessage = function (message, callback) {

	var sql  = 'INSERT INTO `letstalk_data`.`messages` (`id`, `text`, `user`,`creation_date`,`talk_id`) VALUES (NULL, \'' + message.text + '\',1,now(),' + message.talkId + ');';
	var inserts = [];
	sql = mysql.format(sql, inserts);
	log.debug(sql);
		this.connection.query(sql, function(err, rows, fields) {
		  if (err) throw err;
		  callback(err, rows);
		});
}



module.exports = RoberDB;
