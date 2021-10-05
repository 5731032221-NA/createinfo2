const config = require('../config');
const pool = require('node-jt400').pool(config);

module.exports.update = (async function (req, res, dtf, MBCODE) {

    //router.post('/:MBCODE', function (req, res) {

    var date_str = '';
    var today = new Date();
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();

    var update_stmt = "update MBRFLIB/MVM02P ";
    update_stmt += " set MBCRE9=?";
    update_stmt += " where MBCODE='" + req.params.MBCODE + "'";
    var update_params = [0];



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
            "RESP_MSG": "Not success, Insert fail(MVM02P)"
        });
        res.end();
    }
});


