const express = require('express');
const router = express.Router();
const querySql = require('../db/index')
const fs = require('fs');

// 新增活动
/**
 * @swagger
 * /activity/addActivity: # 接口地址
 *   post: # 请求体
 *     security:
 *      - token: []
 *     description: 新增活动 # 接口信息
 *     tags: [活动管理] # 模块名称
 *     produces:
 *       - application/x-www-form-urlencoded # 响应内容类型
 *     parameters: # 请求参数
 *       - name: studentID
 *         description: 名字
 *         in: formData
 *         required: true
 *         type: string # 可能的值有string、number、file（文件）等
 *       - name: realName
 *         description: 简介
 *         in: formData
 *         required: true
 *         type: string # 可能的值有string、number、file（文件）等
 *       - name: password
 *         description: 部门
 *         in: formData
 *         required: true
 *         type: string
 *       - name: role
 *         description: 分数
 *         in: formData
 *         required: true
 *         type: string
 *       - name: department
 *         description: 积分类型
 *         in: formData
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
 *             msg:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *       '500':
 *         description: 系统异常
 */
router.post('/addActivity', async (req, res, next) => {
    let {
        name,
        intro,
        startTime,
        finishTime,
        createUser,
        updateUser,
        score,
        activityType,
        department,
        scoreType
    } = req.body
    let {op} = req.user
    if (op !== 1) {
        res.send({code: -1, msg: "无权限"})
    } else {
        try {
            await querySql('insert into activityLog(name,intro,startTime,finishTime,createUser,updateUser,score,activityType,department,scoreType,createTime,updateTime) value(?,?,?,?,?,?,?,?,?,?,NOW(),NOW())',
                [name, intro, startTime, finishTime, createUser, updateUser, score, activityType, department, scoreType])
            res.send({code: 1, msg: "成功"})
        } catch (err) {
            console.log(err)
            next(err)
        }
    }
});

// 添加活动、违规记录  批量生成记录
/**
 * @swagger
 * /activity/addLog: # 接口地址
 *   post: # 请求体
 *     security:
 *      - token: []
 *     description: 添加活动、违规记录  批量生成记录
 *     tags: [活动管理] # 模块名称
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
 *             msg:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *       '500':
 *         description: 系统异常
 */
router.post('/addLog', async (req, res, next) => {
    let {activityID, participantUUIDList, createUser, studentID, realName} = req.body
    let {op} = req.user
    let errorList = []
    if (op !== 1) {
        res.send({code: -1, msg: "无权限"})
    } else {
        for (let i = 0; i < participantUUIDList.length; i++) {
            try {
                let log = await querySql('select * from activityLog where activityID = ? and participantUUID=?',
                    [activityID, participantUUIDList[i]])
                if (!log || log.length === 0) {
                    await querySql('insert into activityLog(activityID,participantUUID,createTime,createUser,studentID,realName) value(?,?,NOW(),?,?,?)',
                        [activityID, participantUUIDList[i], createUser, studentID, realName])
                } else {
                    errorList.push(participantUUIDList[i])
                }
            } catch (err) {
                console.log(err)
                next(err)
            }
        }
        res.send({code: 1, msg: `录入完成，已存在相同数据${errorList.toString()}`})
    }
});
// 编辑、删除记录
/**
 * @swagger
 * /activity/editLog: # 接口地址
 *   post: # 请求体
 *     security:
 *      - token: []
 *     description: 编辑、删除记录 # 接口信息
 *     tags: [活动管理] # 模块名称
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
 *             msg:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *       '500':
 *         description: 系统异常
 */


// 导出记录
/**
 * @swagger
 * /activity/exportLog: # 接口地址
 *   post: # 请求体
 *     security:
 *      - token: []
 *     description: 导出活动记录 # 接口信息
 *     tags: [活动管理] # 模块名称
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
 *             msg:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *       '500':
 *         description: 系统异常
 */


// 查询个人记录
/**
 * @swagger
 * /activity/queryPersonalLog: # 接口地址
 *   post: # 请求体
 *     security:
 *      - token: []
 *     description: 查询个人记录 # 接口信息
 *     tags: [活动管理] # 模块名称
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
 *             msg:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *       '500':
 *         description: 系统异常
 */
router.post('/queryPersonalLog', async (req, res, next) => {
    let {queryPage, querySize} = req.body
    let {uuid} = req.user
    try {
        let userinfo = await querySql('', [uuid])
        res.send({code: 1, msg: "成功", data: userinfo})
    } catch (err) {
        console.log(err)
        next(err)
    }
});

// 查询所有记录
/**
 * @swagger
 * /activity/queryAllLog: # 接口地址
 *   post: # 请求体
 *     security:
 *      - token: []
 *     description: 查询所有记录 # 接口信息
 *     tags: [活动管理] # 模块名称
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
 *             msg:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *       '500':
 *         description: 系统异常
 */
router.post('/queryAllLog', async (req, res, next) => {
    let {queryPage, querySize} = req.body
    const params = [(parseInt(queryPage) - 1) * parseInt(querySize), parseInt(querySize)]
    const sql = "select * from websites limit ?,?"
    let sqlTotal = 'select count(*) AS total from activityLog'
    let {op} = req.user
    if (op !== 1) {
        res.send({code: -1, msg: "无权限"})
    } else {
        try {
            let userinfo = await querySql('', [uuid])
            res.send({code: 1, msg: "成功", data: userinfo})
        } catch (err) {
            console.log(err)
            next(err)
        }
    }
});

module.exports = router;
