const config = require('../config');
const pool = require('node-jt400').pool(config);

module.exports.validatecardrang = (async function (mcard_bin_number, res){
    
                     let q3 =  await pool.query("select * from MBRFLIB/MCRTA45P where MBRANG = '" + mcard_bin_number + "'")
              if (q3.length > 0) {
                   return await q3;
              }
              else{
                  res.status(404).send({
                      "RESP_CDE": "301",
                      "RESP_MSG": "No record in CardRang"
                  });
              }

})
