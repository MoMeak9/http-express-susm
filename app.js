const express = require('express');
const createError = require('http-errors');
const path = require('path');
const app = express();
const cors = require('cors');
const expressJWT = require('express-jwt');
const {PRIVATE_KEY, whitelist} = require('./config/constant');
const routers = require('./routes');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: false}));
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routers);

app.listen(9000, () => {
    console.log('Server start on http://localhost:9000');
});

module.exports = app;
