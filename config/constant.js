/**
 * Created by Yihui_Shi on 2021/8/6 10:21
 */
module.exports = {
    PWD_SALT: 'NodeBlogFoMe',
    PRIVATE_KEY: 'NodeBlogFoMYTOKEN',
    EXPIRES: 60 * 60 * 24,
    serverAddress: 'https://app.yihuiblog.top',
    whitelist: [
        '/api/users/login',
        '/api/users/register',
        /^\/api\/api-docs\/.*/,
        /^\/\/uploads\/\/.*/]
}
