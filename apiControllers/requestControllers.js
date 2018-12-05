var express = require('express');
var requestRepo = require('../repos/requestRepo');

var router = express.Router();

router.get('/', (req, res) => {
	requestRepo.loadAll()
		.then(rows => {
			res.json(rows);
		}).catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})
router.post('/', (req, res) => {
	var user = req.token_payload.user;
	console.log(user);
	if(user.AccountType_ID==1)
	{
		requestRepo.add(req.body)
		.then(value => {
		
			res.statusCode = 201;
			res.json(req.body);
		})
		.catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
	}
	else{
		res.statusCode = 401;
			res.end('You are not allowed');
	}
	
})

module.exports = router;