var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express(),


    /*set bower libraries*/



/*Set EJS template Engine*/


/*MySql connection*/
connection  = require('express-myconnection'),
    mysql = require('mysql');

    app.use(

        connection(mysql,{
            host     : 'localhost',
            user     : 'root',
            password : '',
            database : 'nodejs',
            debug    : false //set true if you wanna see debug logger
        },'request')

    );




//RESTful route
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/home', function(req, res) {
  res.render('index');
});

/*------------------------------------------------------
*  This is router middleware,invoked everytime
*  we hit url /api and anything after /api
*  like /api/user , /api/user/7
*  we can use this for doing validation,authetication
*  for every route started with /api
--------------------------------------------------------*/
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});




//show the CRUD interface | GET
router.get('/user',function(req,res){


    req.getConnection(function(err,conn){


        if (err) return next("Cannot Connect");

        var query = conn.query('SELECT * FROM t_user',function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }


            res.render('user',{title:"RESTful Crud Example",data:rows});

         });

    });

});
//post data to DB | POST
router.post('/user',function(req,res){

    //validation
    req.assert('name','Name is required').notEmpty();
    req.assert('email','A valid email is required').isEmail();
    req.assert('password','Enter a password 6 - 20').len(6,20);

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO t_user set ? ",data, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});


//now for Single route (GET,DELETE,PUT)
var r2=router.route('/user/:user_id');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/user/:user_id it hit.

remove curut2.all() if you dont want it
------------------------------------------------------*/
r2.all(function(req,res,next){
    console.log("You need to smth about curut2 Route ? Do it here");
    console.log(req.params);
    next();
});

//get data to update
r2.get(function(req,res,next){

    var user_id = req.params.user_id;

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT * FROM t_user WHERE user_id = ? ",[user_id],function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("User Not found");

            res.render('edit',{title:"Edit user",data:rows});
        });

    });

});

//update data
r2.put(function(req,res){
    var user_id = req.params.user_id;

    //validation
    req.assert('name','Name is required').notEmpty();
    req.assert('email','A valid email is required').isEmail();
    req.assert('password','Enter a password 6 - 20').len(6,20);

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("UPDATE t_user set ? WHERE user_id = ? ",[data,user_id], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

//delete data
r2.delete(function(req,res){

    var user_id = req.params.user_id;

     req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM t_user  WHERE user_id = ? ",[user_id], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });
        //console.log(query.sql);

     });
});

//



router.get('/customer',function(req,res){


    req.getConnection(function(err,conn){


        // if (err) return next("Cannot Connect");

        // var query = conn.query('SELECT * FROM t_user',function(err,rows){

        //     if(err){
        //         console.log(err);
        //         return next("Mysql error, check your query");
        //     }


        //     res.render('user',{title:"RESTful Crud Example",data:rows});

        //  });
    res.render('c-registration');

    });

});


var r_products=router.route('/products');

r_products.get(function(req,res){


    req.getConnection(function(err,conn){


        // if (err) return next("Cannot Connect");

        // var query = conn.query('SELECT * FROM t_user',function(err,rows){

        //     if(err){
        //         console.log(err);
        //         return next("Mysql error, check your query");
        //     }


        //     res.render('user',{title:"RESTful Crud Example",data:rows});

        //  });
    res.render('p-registration');

    });

});

//now we need to apply our router here
module.exports =router;
