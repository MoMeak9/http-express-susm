const querySql = require('../db/index');
const {PWD_SALT, PRIVATE_KEY, EXPIRES} = require('../config/constant');
const {md5} = require('../uitls');
const jwt = require('jsonwebtoken');

async function login(req, res, next) {
    let {studentID, password} = req.body;
    try {
        let user = await querySql('select * from users where studentID = ?', [studentID]);
        password = md5(password + PWD_SALT);
        if (!user || user.length === 0) {
            res.send({code: -1, msg: "该账户不存在"});
        } else {
            let result = await querySql('select * from users where studentID = ? and password = ?', [studentID, password]);
            if (!result || result.length === 0) {
                res.send({code: -1, msg: "密码不正确"});
            } else {
                let token = jwt.sign({
                    uuid: result[0].uuid,
                    op: result[0].op
                }, PRIVATE_KEY, {expiresIn: EXPIRES});
                res.send({code: 1, msg: "登入成功", token: `Bearer ${token}`});
            }
        }
    } catch
        (err) {
        res.status(404).send({code: -1, msg: "系统异常"});
        console.log(err);
        next(err);
    }
}

module.exports = {
    login
};
