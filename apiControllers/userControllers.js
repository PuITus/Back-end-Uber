var express = require('express');
var userRepo = require('../repos/userRepo');
var authRepo = require('../repos/authRepo');

var router = express.Router();

router.post('/', (req, res) => {
	userRepo.add(req.body)
		.then(value => {
			res.statusCode = 201;
			res.json(req.body);
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})
router.post('/checkToken', (req, res) => {
	authRepo.verifyAccessToken(req,res);
})
router.post('/refreshToken', (req, res) => {
userRepo.getRftoken({ID:req.body.ID,rfToken: req.body.rfToken}).then(rows =>
{
	if(rows.length > 0)
	{
		
		userRepo.get(rows[0].User_ID)
		.then(rows2 => {
			if (rows2.length > 0) {
				var userEntity = rows2[0];
				var acToken = authRepo.generateAccessToken(userEntity);
				var rfToken = authRepo.generateRefreshToken();
				authRepo.updateRefreshToken(userEntity.ID, rfToken)
					.then(value => {
						res.json({
							auth: true,
							user: userEntity,
							access_token: acToken,
							refresh_token: rfToken
						})
					})
					.catch(err => {
						console.log(err);
						res.statusCode = 500;
						res.end('View error log on console');
					})
			} else {
				res.json({
					auth: false
				})
			}
		})


	}
	else{
		res.json({
			auth: false
		})
	}

})
})
router.post('/login', (req, res) => {
	userRepo.login(req.body)
		.then(rows => {
			if (rows.length > 0) {
				var userEntity = rows[0];
				var acToken = authRepo.generateAccessToken(userEntity);
				var rfToken = authRepo.generateRefreshToken();
				authRepo.updateRefreshToken(userEntity.ID, rfToken)
					.then(value => {
						res.json({
							auth: true,
							user: userEntity,
							access_token: acToken,
							refresh_token: rfToken
						})
					})
					.catch(err => {
						console.log(err);
						res.statusCode = 500;
						res.end('View error log on console');
					})
			} else {
				res.json({
					auth: false
				})
			}
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})

module.exports = router;