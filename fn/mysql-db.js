var mysql = require('mysql');

var createConnection = () => {
    return mysql.createConnection({
    	host: 'ec2-107-21-125-209.compute-1.amazonaws.com',
    	user: 'kiegajnyngpwrs',
    	password: 'cdad120574e7165d6f972ed79f3233e136711a993dde0b5387bfc9385e6c6afb',
    	database: 'd7khr1v5k6j3e0',
        port:5432
    });
}

exports.load = sql => {
    return new Promise((resolve, reject) => {
        var cn = createConnection();
        cn.connect();
        cn.query(sql, (err, rows, fields) => {
            if (err) {
            	reject(err);
            } else {
            	resolve(rows);
            }

            cn.end();
        });
    });
}

exports.insert = sql => {
    return new Promise((resolve, reject) => {
        var cn = createConnection();
        cn.connect();
        cn.query(sql, (err, value) => {
            if (err) {
                reject(err);
            } else {
                resolve(value);
            }

            cn.end();
        });
    });
}