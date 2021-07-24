const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use('/assets', express.static(__dirname + '/public'));

app.use('/', require('./routes/Route'));

const PORT = process.env.APP_PORT;
app.listen(PORT, ()=>{
    console.log(`Aplikasi berjalan di http://localhost:${PORT}`);
});