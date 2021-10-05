const config = require('../config');
const pool = require('node-jt400').pool(config);

//  POST /api/inquiry_partner

module.exports.lookup = (async function (req, res,dtf, CUST_COUNTRYCODE) {

  // get mcard
  
  console.log(CUST_COUNTRYCODE);
  var stmt = "select CM100MP.CNTRYCD3,CM100MP.MBNAT from MBRFLIB/CM100MP CM100MP where CM100MP.CNTRYCD2 = '" + CUST_COUNTRYCODE + "'";
  var result = await pool.query(stmt)

  console.log(result.length);
  console.log(result);

  if (CUST_COUNTRYCODE == '' || typeof CUST_COUNTRYCODE == 'undefined' || CUST_COUNTRYCODE == 'XX') {
    //res.status(200);
    //res.json({});
    return result;
  }
  else if (result.length > 0) {
    //res.status(200);
    //res.json(result);
    return result;
  }
  else {
        res.status(500).json({
            "RESP_SYSCDE": 200,
            "RESP_DATETIME": dtf,
            "RESP_CDE": 500,
            "RESP_MSG": "Not success, lookup fail(CM100MP)"
        });
        res.end();
    }



});

