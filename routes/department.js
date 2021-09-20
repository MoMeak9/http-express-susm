const express = require('express');
const router = express.Router();
const service = require('../services/departmentService');

// 添加部门
/**
 * @swagger
 * /department/add: # 接口地址
 *   post: # 请求体
 *     security:
 *      - token: []
 *     description: 添加部门 # 接口信息
 *     tags: [部门管理模块] # 模块名称
 *     produces:
 *       - application/x-www-form-urlencoded # 响应内容类型
 *     parameters: # 请求参数
 *       - name: name
 *         description: 部门名称
 *         in: formData
 *         required: true
 *         type: string # 可能的值有string、number、file（文件）等
 *       - name: uuid
 *         description: 部长UUID
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
router.post('/add', service.addDepartment);

// 更改部门信息
/**
 * @swagger
 * /department/update: # 接口地址
 *   post: # 请求体
 *     security:
 *      - token: []
 *     description: 添加部门 # 接口信息
 *     tags: [部门管理模块] # 模块名称
 *     produces:
 *       - application/x-www-form-urlencoded # 响应内容类型
 *     parameters: # 请求参数
 *       - name: name
 *         description: 部门名称
 *         in: formData
 *         required: true
 *         type: string # 可能的值有string、number、file（文件）等
 *       - name: uuid
 *         description: 部长UUID
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
router.post('/update', service.updateDepartment);

module.exports = router;
