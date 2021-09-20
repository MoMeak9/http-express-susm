const querySql = require('../db/index');

async function addActivity(req, res, next) {
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
    } = req.body;
    let {op} = req.user;
    if (op !== 1) {
        res.send({code: -1, msg: "无权限"});
    } else {
        try {
            await querySql('insert into activityLog(name,intro,startTime,finishTime,createUser,updateUser,score,activityType,department,scoreType,createTime,updateTime) value(?,?,?,?,?,?,?,?,?,?,NOW(),NOW())',
                [name, intro, startTime, finishTime, createUser, updateUser, score, activityType, department, scoreType]);
            res.send({code: 1, msg: "成功"});
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}

async function addLog(req, res, next) {
    let {activityID, participantUUIDList, createUser, studentID, realName} = req.body;
    let {op} = req.user;
    let errorList = [];
    if (op !== 1) {
        res.send({code: -1, msg: "无权限"});
    } else {
        for (let i = 0; i < participantUUIDList.length; i++) {
            try {
                let log = await querySql('select * from activityLog where activityID = ? and participantUUID=?',
                    [activityID, participantUUIDList[i]]);
                if (!log || log.length === 0) {
                    await querySql('insert into activityLog(activityID,participantUUID,createTime,createUser,studentID,realName) value(?,?,NOW(),?,?,?)',
                        [activityID, participantUUIDList[i], createUser, studentID, realName]);
                } else {
                    errorList.push(participantUUIDList[i]);
                }
            } catch (err) {
                console.log(err);
                next(err);
            }
        }
        res.send({code: 1, msg: `录入完成，已存在相同数据${errorList.toString()}`});
    }
}

async function queryPersonalLog(req, res, next) {
    let {queryPage, querySize} = req.body;
    let {uuid} = req.user;
    try {
        let userinfo = await querySql('', [uuid]);
        res.send({code: 1, msg: "成功", data: userinfo});
    } catch (err) {
        console.log(err);
        next(err);
    }
}

async function queryAllLog(req, res, next) {
    let {queryPage, querySize} = req.body;
    const params = [(parseInt(queryPage) - 1) * parseInt(querySize), parseInt(querySize)];
    const sql = "select * from websites limit ?,?";
    let sqlTotal = 'select count(*) AS total from activityLog';
    let {op} = req.user;
    if (op !== 1) {
        res.send({code: -1, msg: "无权限"});
    } else {
        try {
            let userinfo = await querySql('', [uuid]);
            res.send({code: 1, msg: "成功", data: userinfo});
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}

async function exportLog(req, res, next) {
    let {pareams} = req.query;
    console.log(pareams);
}

async function editLog(req, res, next) {
    console.log(req)
}

module.exports = {
    addActivity,
    addLog,
    queryPersonalLog,
    queryAllLog,
    exportLog,
    editLog
};
