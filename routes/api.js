var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Post = mongoose.model('Post');
var Bride = mongoose.model('Bride');


//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects

	//allow all get request methods
	if(req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	// if the user is not authenticated then redirect him to the login page
	return res.redirect('#/login');
};

//Register the authentication middleware
router.use('/posts', isAuthenticated);
router.route('/posts')
	//creates a new post
	.post(function(req, res){
		var post = new Post();
		post.text = req.body.text;
		post.username = req.body.created_by;
		post.save(function(err, post) {
			if (err){
				return res.send(500, err);
			}
			return res.json(post);
		});
	})
	//gets all posts
	.get(function(req, res){
		Post.find(function(err, data){
			if(err){
				return res.send(500, err);
			}
			return res.send(200,data);
		});
	});

//post-specific commands. likely won't be used
router.route('/posts/:id')
	//gets specified post
	.get(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);
			res.json(post);
		});
	}) 
	//updates specified post
	.put(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);

			post.username = req.body.created_by;
			post.text = req.body.text;

			post.save(function(err, post){
				if(err)
					res.send(err);

				res.json(post);
			});
		});
	})
	//deletes the post
	.delete(function(req, res) {
		Post.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);
			res.json("deleted :(");
		});
	});


router.use('/brides', isAuthenticated);
router.route('/brides')
	//creates a new bride
	.post(function(req, res){
		var bride = new Bride();
		//all var in bride
				bride.created_at = req.body.created_at;
				bride.b_id = req.body.b_id;
				bride.first_name = req.body.first_name;
				bride.last_name = req.body.last_name;
				bride.email = req.body.email;
				bride.phone1 = req.body.phone1;
				bride.phone2 = req.body.phone2;
				bride.adress = req.body.adress;
				bride.date_event = req.body.date_event;
				bride.dress_type = req.body.dress_type;
				bride.dress_type2 = req.body.dress_type2;
				bride.day_service = req.body.day_service;
				bride.price = req.body.price;
				bride.remark = req.body.remark;
		bride.save(function(err,bride) {
			if (err){
				return res.send(500,err);
			}
			return res.json(bride);
		});

	})
	//gets all brides
	.get(function(req, res){
		Bride.find(function(err, data){
			if(err){
				return res.send(500, err);
			}
			return res.send(200,data);
		});
	});
router.route('/brides/:id')
	//gets specified bride
	.get(function(req, res){
		Bride.findById(req.params.id, function(err, bride){
			if(err){
			 	return	res.send(err);
			}
		return res.json(bride);
		});
	})
	//updates specified bride
	.put(function(req, res){
		Bride.findById(req.params.id, function(err, bride){
			if(err){
			 	return	res.send(err);
			}
			else{
				bride.created_at = req.body.created_at;
				bride.b_id = req.body.b_id;
				bride.first_name = req.body.first_name;
				bride.last_name = req.body.last_name;
				bride.email = req.body.email;
				bride.phone1 = req.body.phone1;
				bride.phone2 = req.body.phone2;
				bride.adress = req.body.adress;
				bride.date_event = req.body.date_event;
				bride.dress_type = req.body.dress_type;
				bride.dress_type2 = req.body.dress_type2;
				bride.day_service = req.body.day_service;
				bride.price = req.body.price;
				bride.remark = req.body.remark;
				bride.save(function(err, bride){
						if(err)
							return	res.send(err);
						return res.json(bride);
						});
			}
		});
	})
	//deletes the bride	
	.delete(function(req, res) {
		Bride.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
			 return	res.send(err);
		return res.json("deleted :(");
		});
	});
module.exports = router;


