const querySql = require('../db/index');

async function addDepartment(req, res, next) {
    let {name, uuid} = req.body;
    try {
        let department = await querySql('select * from department where name = ?', [name]);
        if (!department || department.length === 0) {
            await querySql('insert into department(name,minister,createTime) value(?,?,NOW())',
                [name, uuid]);
            res.send({code: 1, msg: "添加"});
        } else {
            res.send({code: -1, msg: "部门已存在"});
        }
    } catch (err) {
        res.status(500).send({code: -1, msg: "系统异常"});
        console.log(err);
        next(err);
    }
}

async function updateDepartment(req, res, next) {
    let {id, name, uuid} = req.body;
    try {
        await querySql('update department set name = ?,minister = ? where id = ?',
            [name, uuid, id]);
        res.send({code: 1, msg: "添加"});
    } catch (err) {
        res.status(500).send({code: -1, msg: "系统异常"});
        console.log(err);
        next(err);
    }
}

module.exports = {
    addDepartment,
    updateDepartment
};
