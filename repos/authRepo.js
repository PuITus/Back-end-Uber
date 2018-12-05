var jwt = require('jsonwebtoken');
var rndToken = require('rand-token');
var moment = require('moment');
var Config = require('../config');
var db = require('../fn/mysql-db');

const SECRET = 'ABCDEF';
const AC_LIFETIME = 6; // seconds

exports.generateAccessToken = userEntity => {
    var payload = {
        user: userEntity,
        info: 'more info'
    }

    var token = jwt.sign(payload, SECRET, {
        expiresIn: AC_LIFETIME
    });

    return token;
}
exports.verifyAccessToken = (req, res) => {
    var token = req.body.token;
    if (token) {
        jwt.verify(token, SECRET, (err, payload) => {
            if (err) {
                res.json({
                    msg: 'INVALID TOKEN',
                    error: err
                })
            } else {
                res.json(JSON.stringify(payload));
            }
        });
    } else {
        res.json({
            msg: 'NO_TOKEN'
        })
    }
}
exports.verifyAccessTokenWS = (token,cb) => {
        jwt.verify(token, SECRET, (err, payload) => {
            if (err) {
                cb(err);
            } else {
             cb(null,payload);
            }
        });
}







exports.generateRefreshToken = () => {
    const SIZE = 80;
    return rndToken.generate(SIZE);
}

exports.updateRefreshToken = (userId, rfToken) => {
    return new Promise((resolve, reject) => {

        var sql = `delete from userRefreshTokenExt where User_ID = ${userId}`;
        db.insert(sql) // delete
            .then(value => {
                var rdt = moment().format('YYYY-MM-DD HH:mm:ss');
                sql = `insert into userRefreshTokenExt values(${userId}, '${rfToken}', '${rdt}')`;
                return db.insert(sql);
            })
            .then(value => resolve(value))
            .catch(err => reject(err));
    });
}

