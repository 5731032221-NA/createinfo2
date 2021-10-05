const config = require('../config');
const pool = require('node-jt400').pool(config);

module.exports.update = (async function (req, res, dtf, MBID, MBTNAM, MBTSUR) {

    //router.get('/:MBID/:MBTNAM/:MBTSUR', function (req, res) {

    var date_str = '';
    var today = new Date();
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();

    var update_stmt = "update MBRFLIB/MCRTA7P ";
    update_stmt += " set MBTNAM=?,MBTSUR=?";
    update_stmt += " where MBID='" + MBID + "'";
    var update_params = [MBTNAM, MBTSUR];

    /*pool.update(update_stmt, update_params)
        .then(function (result) {
            console.log(result.length);
            console.log(result);
            res.status(200);
            res.json({});
        })
        .catch(function (err) {
            res.status(500);
            console.log(err);
            res.end();
        });*/
    var result = await pool.update(update_stmt, update_params)

    console.log(result.length);
    console.log(result);

    if (result == 0) {
        return true;
    } else {
        res.status(500).json({
            "RESP_SYSCDE": 200,
            "RESP_DATETIME": dtf,
            "RESP_CDE": 500,
            "RESP_MSG": "Not success, Insert fail(MCRTA7P)"
        });
        res.end();
    }
});

