const express = require('express');
const router = express.Router();
const querySql = require('../db/index')

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
router.post('/add', async (req, res, next) => {
    let {name, uuid} = req.body
    try {
        let department = await querySql('select * from department where name = ?', [name])
        if (!department || department.length === 0) {
            await querySql('insert into department(name,minister,createTime) value(?,?,NOW())',
                [name, uuid])
            res.send({code: 1, msg: "添加"})
        } else {
            res.send({code: -1, msg: "部门已存在"})
        }
    } catch (err) {
        res.status(404).send({code: -1, msg: "系统异常"})
        console.log(err)
        next(err)
    }
});

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
router.post('/update', async (req, res, next) => {
    let {id, name, uuid} = req.body
    try {
        await querySql('update department set name = ?,minister = ? where id = ?',
            [name, uuid, id])
        res.send({code: 1, msg: "添加"})
    } catch (err) {
        res.status(404).send({code: -1, msg: "系统异常"})
        console.log(err)
        next(err)
    }
});

module.exports = router;
