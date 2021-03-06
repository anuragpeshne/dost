
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var watcher = require('./routes/priceWatcher');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')( path.join(__dirname, 'public') ));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/priceWatch', watcher.priceWatch);
app.get('/getPriceMatrix', watcher.sendPriceMatrix);
app.get('/getBombMatrix', watcher.sendBombMatrix);
app.get('/users', user.list);

watcher.updatePrices();				//start recording prices
watcher.startBombarding();

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
