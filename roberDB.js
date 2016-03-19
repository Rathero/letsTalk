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

	var sql  = 'SELECT * FROM talks';
	var inserts = [];
	sql = mysql.format(sql, inserts);
	log.debug(sql);
		this.connection.query(sql, function(err, rows, fields) {
		  if (err) throw err;

		  callback(err, rows);
		});
}

module.exports = RoberDB;
