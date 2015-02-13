var express  = require('express');
var path     = require('path');
var bodyParser = require('body-parser');
var app = express();
var expressValidator = require('express-validator'),
    routes=require('./router/index');


    var allowCrossDomain = function (req,res,next){
        res.header('Access-Control-Allow-Origin','*');
        res.header('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers','Origin,Authorization,X-Requested-Width,Content-Type');
        next();
    };

    app.use('/bower_components',  express.static(__dirname + '/bower_components'));

/*Set EJS template Engine*/
    app.set('views','./views');
    app.set('view engine','ejs');

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
    app.use(bodyParser.json());
    app.use(expressValidator());



    app.use('/',routes);







var server = app.listen(2000,function(){

   console.log("Listening to port %s",server.address().port);

});
module.exports =app;
