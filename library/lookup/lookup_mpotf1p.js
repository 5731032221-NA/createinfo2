const config = require('../config');
const pool = require('node-jt400').pool(config);

//router.get('/:MBCODE', function (req, res) {
module.exports.lookup = (async function (req, res, dtf, MBCODE) {

    var date_str = '';
    var today = new Date();
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();



    console.log(req.params.CUST_ID_OR_PASSPORT);
    var stmt = "select * from MBRFLIB/MPOTF1P MPOTF1P where MPOTF1P.MBCODE = '" + MBCODE + "' and MPOTF1P.MBDAT='" + parseInt(date_str) + "'";
    result = await pool.query(stmt)

    console.log(result.length);
    console.log(result);

    if (result.length > 0) {

        return result;
    }
    else {
        return result;
    }



});
