const express = require('express');
const router = express.Router();
const service = require('../services/activitiesServive');
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
router.post('/addActivity', service.addActivity);

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
router.post('/addLog', service.addLog);

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
router.get('/exportLog',service.exportLog);

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
router.post('/queryPersonalLog', service.queryPersonalLog);

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
router.post('/queryAllLog', service.queryAllLog);

module.exports = router;
