const querySql = require('../db/index');
const {PWD_SALT, PRIVATE_KEY, EXPIRES, serverAddress} = require('../config/constant');
const {md5} = require('../uitls');
const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');

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
        res.status(500).send({code: -1, msg: "系统异常"});
        console.log(err);
        next(err);
    }
}

async function register(req, res, next) {
    let {studentID, password, realName, role, department} = req.body;
    try {
        let user = await querySql('select * from users where studentID = ?', [studentID]);
        if (!user || user.length === 0) {
            let uuid = uuidv4();
            password = md5(password + PWD_SALT);
            await querySql('insert into users(uuid,studentID,password,realName,role,department,createTime) value(?,?,?,?,?,?,NOW())',
                [uuid, studentID, password, realName, role, department]);
            res.send({code: 1, msg: "注册成功"});
        } else {
            res.send({code: -1, msg: "该账户已存在"});
        }
    } catch (err) {
        res.status(500).send({code: -1, msg: "系统异常"});
        console.log(err);
        next(err);
    }
}

async function getUserInfo(req, res, next) {
    let {uuid} = req.user;
    try {
        let userinfo = await querySql('select DATE_FORMAT(createTime,"%Y-%m-%d %H:%i:%s") AS createTime,No,age,studentID,department,score,grade,ranking,role from users where uuid = ?', [uuid]);
        res.send({code: 1, msg: "成功", data: userinfo[0]});
    } catch (err) {
        console.log(err);
        next(err);
    }
}

async function getAllUser(req, res, next) {
    let {op} = req.user;
    if (op === 1) {
        try {
            let userinfo = await querySql('select DATE_FORMAT(createTime,"%Y-%m-%d %H:%i:%s") AS createTime,No,age,studentID,department,score,grade,ranking,role,uuid from users');
            res.send({code: 1, msg: "成功", data: userinfo});
        } catch (err) {
            console.log(err);
            next(err);
        }
    } else {
        res.send({code: -1, msg: "无权限"});
    }
}

async function updateUser(req, res, next) {

    let {
        realName,
        age,
        updateUser,
        department,
        grade,
        ranking,
        role,
        intro,
        opLevel,
        userUuid
    } = req.body;
    let {op, uuid} = req.user;
    if (op === 1 && uuid !== userUuid) {
        //    修改他人信息
        try {
            await querySql('update users set realName = ?,age = ?,updateUser = ?,updateTime = NOW(),department = ?,grade = ?,ranking = ?,role = ?,intro = ?,op = ? where uuid = ?',
                [realName, age, updateUser, department, grade, ranking, role, intro, opLevel, userUuid]);
            res.send({code: 1, msg: '更新成功', data: null});
        } catch (err) {
            console.log(err);
            next(err);
        }
    } else {
        //    修改自己信息
        try {
            await querySql('update users set realName = ?,age = ?,updateUser = ?,updateTime = NOW(),department = ?,score = ?,grade = ?,ranking = ?,role = ?,intro = ?,op = ? where uuid = ?',
                [realName, age, updateUser, department, grade, ranking, role, intro, opLevel, uuid]);
            res.send({code: 1, msg: '更新成功', data: null});
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}

async function uploadImage(req, res) {
    let {uuid} = req.user;
    if (uuid != null || uuid !== '') {
        let imgPath = req.file.path.split('public')[1];
        let imgUrl = serverAddress + imgPath;
        res.send({code: 1, msg: '上传成功', data: {imgUrl: imgUrl, name: req.file.originalname}});
    } else {
        res.send({code: -1, msg: '未登入'});
    }
}


module.exports = {
    login,
    register,
    getUserInfo,
    getAllUser,
    updateUser,
    uploadImage
};
