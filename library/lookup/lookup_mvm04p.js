const config = require('../config');
const pool = require('node-jt400').pool(config);

//  POST /api/inquiry_partner

module.exports.lookup = (async function (req, res,MBCODE,COCAT) {

  // get mcard
  console.log(CUST_COUNTRYCODE);
  var stmt = "select * from MBRFLIB/MVM04P where MBCODE = '" + MBCODE + "' and COCAT = '"+"'";
  result = await pool.query(stmt)

  console.log(result.length);
  console.log(result);

  return result;

});

