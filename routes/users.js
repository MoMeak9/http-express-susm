const express = require('express');
const router = express.Router();
const querySql = require('../db/index');
const {PWD_SALT, PRIVATE_KEY, EXPIRES, serverAddress} = require('../config/constant');
const {md5, upload} = require('../uitls');
const {v4: uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
const service = require('../services/userService');

// 更改为主要负责路由以及路由文档

// 登入
/**
 * @swagger
 * /users/login: # 接口地址
 *   post: # 请求体
 *     description: 用户登入 # 接口信息
 *     tags: [用户模块] # 模块名称
 *     produces:
 *       - application/x-www-form-urlencoded # 响应内容类型
 *     parameters: # 请求参数
 *       - name: studentID
 *         description: 用户名
 *         in: formData
 *         required: true
 *         type: string # 可能的值有string、number、file（文件）等
 *       - name: password
 *         description: 用户密码
 *         in: formData # 参数的位置，可能的值有 "query", "header", "path" 或 "cookie" 没有formData，但是我加了不报错
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Ok
 *         schema: # 返回体说明
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *               description: 1 成功 -1 失败
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *       '500':
 *         description: 系统异常
 */
router.post('/login', service.login);

// 创建新用户
/**
 * @swagger
 * /users/register: # 接口地址
 *   post: # 请求体
 *     security:
 *      - token: []
 *     description: 人员录入 # 接口信息
 *     tags: [用户模块] # 模块名称
 *     produces:
 *       - application/x-www-form-urlencoded # 响应内容类型
 *     parameters: # 请求参数
 *       - name: studentID
 *         description: 学号
 *         in: formData
 *         required: true
 *         type: string # 可能的值有string、number、file（文件）等
 *       - name: realName
 *         description: 真实姓名
 *         in: formData
 *         required: true
 *         type: string # 可能的值有string、number、file（文件）等
 *       - name: password
 *         description: 初始密码，默认与学号相同
 *         in: formData # 参数的位置，可能的值有 "query", "header", "path" 或 "cookie" 没有formData，但是我加了不报错
 *         required: true
 *         type: string
 *       - name: role
 *         description: 角色
 *         in: formData # 参数的位置，可能的值有 "query", "header", "path" 或 "cookie" 没有formData，但是我加了不报错
 *         required: true
 *         type: string
 *       - name: department
 *         description: 部门 1 网媒 2 宣传
 *         in: formData # 参数的位置，可能的值有 "query", "header", "path" 或 "cookie" 没有formData，但是我加了不报错
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Ok
 *         schema: # 返回体说明
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *               description: 1 成功 -1 失败
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *       '500':
 *         description: 系统异常
 */
router.post('/register', async (req, res, next) => {
    let {studentID, password, realName, role, department} = req.body
    try {
        let user = await querySql('select * from users where studentID = ?', [studentID])
        if (!user || user.length === 0) {
            let uuid = uuidv4()
            password = md5(password + PWD_SALT)
            await querySql('insert into users(uuid,studentID,password,realName,role,department,createTime) value(?,?,?,?,?,?,NOW())',
                [uuid, studentID, password, realName, role, department])
            res.send({code: 1, msg: "注册成功"})
        } else {
            res.send({code: -1, msg: "该账户已存在"})
        }
    } catch (err) {
        res.status(404).send({code: -1, msg: "系统异常"})
        console.log(err)
        next(err)
    }
});

// 个人资料查询 自带更新一次个人总分
/**
 * @swagger
 * /users/getUserInfo: # 接口地址
 *   get: # 请求体
 *     security:
 *      - token: []
 *     description: 人员信息 # 接口信息
 *     tags: [用户模块] # 模块名称
 *     produces:
 *       - application/x-www-form-urlencoded # 响应内容类型
 *     responses:
 *       '200':
 *         description: Ok
 *         schema: # 返回体说明
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *               description: 1 成功 -1 失败
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *       '500':
 *         description: 系统异常
 */
router.get('/getUserInfo', async (req, res, next) => {
    let {uuid} = req.user
    try {
        let userinfo = await querySql('select DATE_FORMAT(createTime,"%Y-%m-%d %H:%i:%s") AS createTime,No,age,studentID,department,score,grade,ranking,role from users where uuid = ?', [uuid])
        res.send({code: 1, msg: "成功", data: userinfo[0]})
    } catch (err) {
        console.log(err)
        next(err)
    }
});

// 查询所有用户信息
/**
 * @swagger
 * /users/getAllUser: # 接口地址
 *   get: # 请求体
 *     security:
 *      - token: []
 *     description: 获取所有人员信息 # 接口信息
 *     tags: [用户模块] # 模块名称
 *     produces:
 *       - application/x-www-form-urlencoded # 响应内容类型
 *     responses:
 *       '200':
 *         description: Ok
 *         schema: # 返回体说明
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *               description: 1 成功 -1 失败
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *       '500':
 *         description: 系统异常
 */
router.get('/getAllUser', async (req, res, next) => {
    let {op} = req.user
    if (op === 1) {
        try {
            let userinfo = await querySql('select DATE_FORMAT(createTime,"%Y-%m-%d %H:%i:%s") AS createTime,No,age,studentID,department,score,grade,ranking,role,uuid from users')
            res.send({code: 1, msg: "成功", data: userinfo})
        } catch (err) {
            console.log(err)
            next(err)
        }
    } else {
        res.send({code: -1, msg: "无权限"})
    }
});

// 修改成员状态，删除成员等
/**
 * @swagger
 * /users/updateUser: # 接口地址
 *   post: # 请求体
 *     security:
 *      - token: []
 *     description: 人员信息更新，数量大，不再一一列举 # 接口信息
 *     tags: [用户模块] # 模块名称
 *     produces:
 *       - application/x-www-form-urlencoded # 响应内容类型
 *     parameters: # 请求参数
 *     responses:
 *       '200':
 *         description: Ok
 *         schema: # 返回体说明
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *               description: 1 成功 -1 失败
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *       '500':
 *         description: 系统异常
 */
router.post('/updateUser', async (req, res, next) => {
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
    } = req.body
    let {op, uuid} = req.user
    if (op === 1 && uuid !== userUuid) {
        //    修改他人信息
        try {
            await querySql('update users set realName = ?,age = ?,updateUser = ?,updateTime = NOW(),department = ?,grade = ?,ranking = ?,role = ?,intro = ?,op = ? where uuid = ?',
                [realName, age, updateUser, department, grade, ranking, role, intro, opLevel, userUuid])
            res.send({code: 1, msg: '更新成功', data: null})
        } catch (err) {
            console.log(err)
            next(err)
        }
    } else {
        //    修改自己信息
        try {
            await querySql('update users set realName = ?,age = ?,updateUser = ?,updateTime = NOW(),department = ?,score = ?,grade = ?,ranking = ?,role = ?,intro = ?,op = ? where uuid = ?',
                [realName, age, updateUser, department, grade, ranking, role, intro, opLevel, uuid])
            res.send({code: 1, msg: '更新成功', data: null})
        } catch (err) {
            console.log(err)
            next(err)
        }
    }
})

// 文件上传
/**
 * @swagger
 * /users/uploadImage: # 接口地址
 *   post: # 请求体
 *     security:
 *      - token: []
 *     description: 人员录入 # 接口信息
 *     tags: [用户模块] # 模块名称
 *     produces:
 *       - application/x-www-form-urlencoded # 响应内容类型
 *     parameters: # 请求参数
 *       - name: img
 *         description: 文件
 *         in: formData
 *         required: true
 *         type: file # 可能的值有string、number、file（文件）等
 *     responses:
 *       '200':
 *         description: Ok
 *         schema: # 返回体说明
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *               description: 1 成功 -1 失败
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *       '500':
 *         description: 系统异常
 */
router.post('/uploadImage', upload.single('img'), async (req, res, next) => {
    let {uuid} = req.user
    if (uuid != null || uuid !== '') {
        let imgPath = req.file.path.split('public')[1]
        let imgUrl = serverAddress + imgPath
        res.send({code: 1, msg: '上传成功', data: {imgUrl: imgUrl, name: req.file.originalname}})
    } else {
        res.send({code: -1, msg: '未登入'})
    }
});

module.exports = router;

