const express = require('express');
// Routes
const usersRouter = require('../routes/users');
const activitiesRouter = require('../routes/activities');
const departmentRouter = require('../routes/department');
const swagger = require('../routes/swagger');

const router = express.Router();

router.use('/api/users', usersRouter);
router.use('/api/activity', activitiesRouter);
router.use('/api/department', departmentRouter);
router.use('/api', swagger);


module.exports = router;
