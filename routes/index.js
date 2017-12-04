var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var db_url = 'mongodb://localhost:27017/user';
var fs = require('fs');
var mongoff = require('./MongoDB');
var ObjectID = require('mongodb').ObjectID;
var async = require('async');
var detail;
var change;
/* GET home page. */
router.get('/', function(req, res) {
	console.log(req.session.user);
	res.render('index', {
		title: req.session.user
	});
});
router.get('/relogo', function(req, res) {
	req.session.destroy((err) => {
		if(err) {
			console.log(err);
		} else {
			//			req.session.user = undefined;
			//			res.render('index',{});
			res.redirect('/');
		}
	})
})

router.get('/logo', (req, res, next) => {
	res.render('logo', {})
})
router.get('/joinin', (req, res, next) => {
	res.render('joinin')
})
router.get('/form', (req, res, next) => {
	res.render('form')

})
router.get('/body', (req, res, next) => {
	res.render('form')
})


router.get('/detail/search',(req, res, next)=>{
	res.render('search') 
})


router.get('/tzym1', (req, res) => {
	var id = req.query.id;
	var id = {
		_id:ObjectID(id)
	};
	mongoff.get(db_url, "liuyan",id,req,res,(data) => {
			data[0]['type'] = 1;
			console.log(data[0])
//			console.log(data)
			req.session.detail = data[0];
			console.log("tzym1输出",req.session.detail)
			if (data.length >= 1) {
				res.send("1")
			}else{
				res.send("0")
			}
		})
})
router.get('/tzym2', (req, res) => {
	mongoff.get(db_url, "liuyan",{},req,res,(data) => {
//			console.log(data)
//			console.log(data)
			req.session.detail1 = data;
			console.log("tzym2输出",req.session.detail1)
			if (data.length >= 1) {
				res.send("1")
			}else{
				res.send("0")
			}
		})
})
//tzym2
router.get("/detail",(req,res)=>{
	mongoff.get(db_url, "liuyan",{},req,res,(data) => {
//			console.log(data)
			console.log(data)
			if (data.length >= 1) {
				res.render('detail',{data:data})
			}
		})
})
router.get('/detail/change', (req, res) => {
	console.log(req.session.detail);
	res.render('change',{data:req.session.detail})
})

router.get('/query', (req, res) => {
	res.send(req.query);
})

router.get('/search',(req,res)=>{
	var title = req.query.title; 
	var zz_gs = RegExp(title);
	console.log(zz_gs);
	mongodb.connect(db_url,(err,db)=>{
		db.collection('liuyan',(err,coll)=>{
			coll.find({title : zz_gs}).sort({_id:-1}).toArray((err,d)=>{
				console.log(d)
				res.send(d)
			})
		})
	})
})

//获取数据库中的留言,并提交到网页里面
router.get('/liuyan', (req, res) => {
//	var data = req.body;
	console.log("输出:",req.query)
	let fyid = req.query['fyid'];
	fyid = fyid ? fyid : 1;
	//每页展示的量
	let ymsize = 4;
	//总页数
	let zys = 0;
	//总的数据
	let counts = 0;
	mongodb.connect(db_url, (err, db) => {
		db.collection('liuyan', (err, coll) => {
			async.series([
				function(cb) {
					coll.find({}).toArray((err, result) => {
						//此时计算总页数
						zys = Math.ceil(result.length / ymsize);
						counts = result.length;
						// 上一页 峰值
						fyid = fyid <= 1 ? 1 : fyid;
						// 下一页 峰值
						fyid = fyid >= zys ? zys : fyid;
						cb(null, '');
					})
				},
				function(cb) {
					coll.find({}).sort({
						_id: -1
					}).skip((fyid - 1) * ymsize).limit(ymsize).toArray((err, result) => {
						cb(null, result)
					})
				}

			], function(err, data) {
				//					console.log(data);
				res.render('liuyan', {
					result: data[1],
					zys: zys,
					counts: counts,
					ymsize: ymsize,
					fyid: fyid,
				})
				db.close();
			})
		})
	})
})

module.exports = router;