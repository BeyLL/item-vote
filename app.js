var express = require('express');
//用来处理路径
var path = require('path');
//处理收藏夹图标
var favicon = require('serve-favicon');
//morgan是日志记录器，使用来在控制台中打印请求日志的
var logger = require('morgan');
//解析cookie，使用此中间件会在请求对象上挂载一个cookies
var cookieParser = require('cookie-parser');
//请求体中间件res.body
var bodyParser = require('body-parser');
//路由方法
var routes = require('./routes/route_app');

var app = express();
var ejs = require('ejs');

// view engine setup
//模板存放的根目录
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//设置渲染的方法
app.engine('.html', ejs.__express);
//设置模板引擎
app.set('view engine', 'html');// app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//使用收藏夹图标的中间件  /favicon.ico
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));//查看Morgan中的文档 dev是一个日志的格式
//处理请求体
//当请求体的类型是json的格式，用json处理。当请求体中的格式为查询字符串的格式(url中的key1=val1&key2=val2这与放置的位置没有关系，可以在url中也可以放在请求体中)的话要用urlencoded来处理
//中间件通过请求头中的Content-Type来判断是什么格式的
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());//req.cookies
//静态文件中间件，用来响应客户端对静态文件的请求
app.use(express.static(path.join(__dirname, 'public')));


//获得get请求，第一个参数是匹配内容，第二个参数是匹配成功后执行的回调函数
app.get('/vote/index', routes.index);  
app.get(/\/vote\/detail/, routes.detail);  
app.get('/vote/register', routes.register);  
app.get('/vote/search', routes.search); 
app.get('/vote/rule', routes.rule);

app.get('/vote/index/data', routes.index_data);
app.get(/\/vote\/index\/poll/, routes.index_poll);
app.get(/\/vote\/index\/search/, routes.index_search);
app.get(/\/vote\/all\/detail\/data/, routes.detail_data);

app.post(/\/vote\/register\/data/, routes.register_data);
app.post('/vote/index/info', routes.index_info);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
