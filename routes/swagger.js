const swaggerJSDoc = require('swagger-jsdoc');
const express = require("express");
const router = express.Router();
const swaggerUi = require('swagger-ui-express');

// Configuring
const swaggerOptions = {
    swaggerDefinition: {
        info: { // 必填
            title: '学生会管理系统',    // 必填，API名稱
            version: '1.0.0',       // 必填，API版本
            description: 'Example API for Medium, @pingyenchen',
            contact: {
                name: 'Yihui_Shi',
                email: '1308994506@qq.com',
                url: 'https://yihuiblog.top/'
            }
        },
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        basePath: '/api',
        securityDefinitions: {
            token: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "需要加上base",
            }
        }
    },
    apis: ['./routes/*.js'],   // API路徑，這是 swagger-jsdoc 用的參數
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = router;
