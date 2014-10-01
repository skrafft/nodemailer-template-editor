/* Set process current directory to the right folder */
process.chdir(__dirname);

/* Load env variables */
var dotenv = require('dotenv');
dotenv.load();

/* Standard libs */
var express = require('express');
var path = require('path');
var fs = require('fs');
var http = require('http');
/* Routes */
var template = require('./routes/templates.js');

var app = express();

app.set('port', process.env.PORT || 4000);
app.use(express.logger(process.env.LOGGER));
app.use(express.urlencoded());
app.use(express.json());
app.use(express.cookieParser() );

/* Static content */
app.use("/js", express.static(path.join(__dirname, 'public/js')));
app.use("/lib", express.static(path.join(__dirname, 'public/lib')));
app.use("/css", express.static(path.join(__dirname, 'public/css')));
app.use("/img", express.static(path.join(__dirname, 'public/img')));
app.use("/fonts", express.static(path.join(__dirname, 'public/fonts')));
app.get('/templates', template.displayAll);
app.get('/tmp/:name', template.genTmp);
app.get('/templates/--new--', template.new);
app.post('/templates/--new--', template.add);
app.get('/templates/:name', template.display);
app.post('/templates/:name', template.update);
// Files
app.get('*', template.displayAll);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

