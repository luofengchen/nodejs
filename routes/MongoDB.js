var mongodb = require('mongodb').MongoClient;
const mongoDB = {
	//设置数据到MongoDB数据库 传入data类型 为 对象，封装内部已写好数组
	set: function(dburl, connname, data, req, res, callback) {
		mongodb.connect(dburl, (err, db) => {
			db.collection(connname, (err, coll) => {
				if(err) {
					res.send("连接错误!");
				} else {
					//				console.log("连接成功!");
					coll.insert([data], (err, result) => {
						callback(result);
						db.close();
					})
				}
			})
		})
	},
	//获取数据库中对应的值 需要传递 URL 数据库地址，集合名，寻找目标的参数ID，
	get: function(dburl, connname, data, req, res, callback) {
		mongodb.connect(dburl, (err, db) => {
			db.collection(connname, (err, collection) => {
				if(err) {
					res.send("连接错误");
				} else {
					collection.find(data)
						.toArray((err, result) => {
							callback(result);
							db.close();
						})
				}
			})
		})
	},
//删除单条文档,传参与其他方法相同，data为 单条文档的特有数据 比如（_id）
	del: function(dburl, connname, data, req, res, callback) {
		mongodb.connect(dburl, (err, db) => {
			db.collection(connname, (err, coll) => {
				if (err) {
					res.send("连接数据库失败");
				}else{
					coll.remove(data,(err,result)=>{
						callback(result);
						db.close();
					})
				}
			})
		})
	},

//更新数据updata数据库 目标数据
	update:function(dburl, connname, data1, data2, req, res, callback) {
		mongodb.connect(dburl, (err, db) => {
			db.collection(connname, (err, coll) => {
				if (err) {
					res.send("连接数据库失败");
				}else{
					coll.update(data1,{$set:data2},(err,result)=>{
						callback(result);
						db.close();
					})
				}
			})
		})
	}
}

module.exports = mongoDB;