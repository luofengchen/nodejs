var express = require('express');
var router = express.Router();

router.get('/',function(req, res, next){
//	res.send("设置home")
	res.render('index',{title:'设置'})
});
module.exports = router






















