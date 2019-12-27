const express = require('express');
const admin = require('./routes/admin');
const contacts = require('./routes/contacts');
const app = express();
const port = 3000;
const nunjucks = require('nunjucks');
const logger = require('morgan');
const bodyParser = require('body-parser');


// db 관련
const db = require('./models');

// DB authentication
db.sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
    return db.sequelize.sync();
})
.then(() => {
    console.log('DB Sync complete.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

nunjucks.configure('template', {
    autoescape: true,
    express: app
});

// 미들웨어 셋팅
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req,res){
    res.send('first app');
});

// Routing
app.use('/admin', admin);
app.use('/contacts', contacts);

app.listen( port, function(){
    console.log('Express listening on port', port);
});