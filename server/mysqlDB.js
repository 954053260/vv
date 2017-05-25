/**
 * Created by hyt on 2017/3/10.
 */
var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'blog',
    port: 3306
});
/**
 * 操作数据库
 * @param sql string sql语句 必须
 * @param params 对象 sql传入参数 可选
 * @param callback function 回调函数 可选
 */
exports.query = function (sql, params, callback) {
    if (Object.prototype.toString.call(params) == '[object Function]') {
        callback = params;
        params = null;
    }
    pool.getConnection(function (err, conn) {
        if (err) console.log("POOL ==> " + err);
        conn.query(sql, params, function (err, rows) {
            if (err) console.log("CONN ==> " + err);
                callback(err, rows);
            conn.release();
        });
    });
};

/**
 * 转义的字符串
 */
exports.pool = pool;

