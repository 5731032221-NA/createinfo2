const config = require('../config');
const pool = require('node-jt400').pool(config);

module.exports.lookup = (async function (req, res, dtf, MBCODE) {


    console.log(MBCODE);
    var stmt = "select * from MBRFLIB/MVM02P MVM02P where MVM02P.MBCODE = '" + MBCODE + "'";
   /* pool.query(stmt)
        .then(function (result) {
            console.log(result.length);
            console.log(result);

            if (result.length > 0) {
                res.status(200);
                res.json(result);

            } else {
                res.status(404);
                res.end();
            }
        })
        .catch(function (err) {
            console.log(err);
        });
*/

    result = await pool.query(stmt)
    console.log(result.length);
    console.log(result);

    if (result.length > 0) {
        return true;
    }
    else {
        return false;
    }
});

