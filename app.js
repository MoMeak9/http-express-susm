const express = require('express');
const createError = require('http-errors');
const path = require('path');
const app = express();
const cors = require('cors');
const expressJWT = require('express-jwt');
const {PRIVATE_KEY, whitelist} = require('./config/constant');

// Routes
const usersRouter = require('./routes/users');
const activitiesRouter = require('./routes/activities');
const departmentRouter = require('./routes/department')
const swagger = require('./routes/swagger')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressJWT({
    secret: PRIVATE_KEY,
    // algorithms: ['RS256'],
    algorithms: ['HS256']
}).unless({
    path: whitelist //⽩名单,除了这⾥写的地址，其他的URL都需要验证
}));

// 配置路由路径
app.use('/api/users', usersRouter);
app.use('/api/activity', activitiesRouter);
app.use('/api/department', departmentRouter);
app.use('/api', swagger)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    console.log(err)
    if (err.name === 'UnauthorizedError') {
        // 这个需要根据⾃⼰的业务逻辑来处理
        res.status(401).send({code: -1, msg: 'token验证失败'});
    } else {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    }
});


app.listen(9000, () => {
    console.log(`Server start on http://localhost:9000`);
})

module.exports = app;
