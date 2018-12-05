var mysql = require('mysql');

var createConnection = () => {
    return mysql.createConnection({
    	host: 'localhost',
    	user: 'root',
    	password: '',
    	database: 'uber'
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