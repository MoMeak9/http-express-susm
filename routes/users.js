const express = require('express');
const router = express.Router();
const {upload} = require('../uitls');
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
router.post('/register', service.register);

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
router.get('/getUserInfo', service.getUserInfo);

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
router.get('/getAllUser', service.getAllUser);

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
router.post('/updateUser', service.updateUser);

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
router.post('/uploadImage', upload.single('img'), service.uploadImage);

module.exports = router;

