const config = require('../config');
const pool = require('node-jt400').pool(config);

module.exports.getmrtlsts = (async function (mrtlsts , res) {
          let q3 =  await pool.query("Select MBHSTS, MBHSTN from MBRFLIB/MBD21P where MBHSTN= '" + mrtlsts +  "'")
              if (q3.length > 0) {
                   return await q3;
              }
              else{
                  res.status(404).send({
                      "RESP_CDE": "301",
                      "RESP_MSG": "No record in mrtlsts"
                  });
              }
})

module.exports.getoccup = (async function (occup , res) {
          let q3 =  await pool.query("Select MBJOB , MBJOBN from MBRFLIB/MBD25P where MBJOBN = '" + occup +  "'")
              if (q3.length > 0) {
                   return await q3;
              }
              else{
                  res.status(404).send({
                      "RESP_CDE": "301",
                      "RESP_MSG": "No record in occup"
                  });
              }
})
