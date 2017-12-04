var express = require('express');
var app = express();
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var fs = require('fs');
var multiparty = require('multiparty');
var upload = require('./upload');
var mongoff = require('./MongoDB')
var ObjectID = require('mongodb').ObjectID;
var db_url = 'mongodb://localhost:27017/user';
//var db_url1 = 'mongodb://localhost:27017/liuyan';

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('404,找不到指定页面');
});

//注册
router.post('/join', (req, res, next) => {
	var name = req.body.username;
	var pass = req.body.password;
	var data1 = {
		username: name,
		password: pass
	};
	mongoff.get(db_url, 'users', data1, req, res, (data) => {
		console.log(data.length)
		if(data.length == 0) {
			mongoff.set(db_url, 'users', data1, req, res, (data) => {
				if (data.result.ok == 1) {
					res.send('1');
				}
			})
		} else if(data.length == 1) {
			res.send('0');
		}
	})
	//	
})

//登录
router.post('/logo', (req, res) => {
	var name = req.body.username;
	var pass = req.body.password;
	var data = {
		'username': name,
		'password': pass
	};
	mongoff.get(db_url, 'users', data, req, res, (data) => {
		if(data.length == 1) {
			console.log(data)
			req.session.user = data[0].username;
			res.send('1');
		} else {
			res.send('0');
		}
	})
})
// 更新数据库内容
router.post('/update',(req,res)=>{
//	console.log()
	var ls_sj = req.body;
	console.log(ls_sj)
//	var id = req.query.id;
	var id = {
		_id:ObjectID(req.body.id)
	};
	var data = {
		title:ls_sj.title,
		content:ls_sj.content
	}
	mongoff.update(db_url, "liuyan",id,data,req,res,(d)=>{
//		console.log(d)
		console.log(d.result);
		if (d.result.nModified == 1) {
			res.send('1')
			
		}else if (d.result.nModified == 0) {
			res.send('0')
		}
// 		d.result.nModified
	})
//	res.render('',);

})

// 提交 留言信息 并保存在数据库中
router.post("/setliuyan", (req, res) => {
	//	console.log(req.body);
	data = req.body;
	mongoff.set(db_url, 'liuyan', data, req, res, (result) => {
		if(result.result.ok == 1) {
			res.send("1")
		}
	})
})
router.post("/deladata", (req, res) => {
	if(req.body) {
		console.log(req.body);
		var id = req.body['_id'];
		var data = {
			_id: ObjectID(id)
		};
		mongoff.del(db_url, 'liuyan', data, req, res, (data) => {
			//			console.log(data);
			console.log(data.result)
			console.log(data.result.n)
			if(data.result.n) {
				res.send(`${data.result.n}`);
			}
		})
	}
})

router.post('/uploadImg', (req, res) => {
	upload(req, res);
})

module.exports = router;