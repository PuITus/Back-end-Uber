var md5 = require('crypto-js/md5');

var db = require('../fn/mysql-db');

exports.add = userEntity => {
    var md5_pwd = md5(userEntity.Password);
    var sql = `insert into users(Username, Password, Name, AccountType_ID, Status) values('${userEntity.Username}', '${md5_pwd}','${userEntity.Name}','${userEntity.AccountType_ID}','${userEntity.Status}')`;
    console.log(sql);
    return db.insert(sql);
}

exports.login = loginEntity => {
    var md5_pwd = md5(loginEntity.pwd);
	var sql = `select * from users where Username = '${loginEntity.user}' and Password = '${md5_pwd}'`;
	return db.load(sql);
}
exports.get = ID => {
	var sql = `select * from users where ID = '${ID}'`;
	return db.load(sql);
}
exports.getRftoken = refreshToken => {
	var sql = `select * from userRefreshTokenExt where User_ID = '${refreshToken.ID}' and rfToken = '${refreshToken.rfToken}'`;
	return db.load(sql);
}







