const config = require('../config');
const pool = require('node-jt400').pool(config);

module.exports.lookup = (async function (req, res) {

    var questionnair = req.body.QUESTIONNAIRE;
    //List!!!!!!!!
    //var insert_custid = "insert into MBRFLIB/MVM04P";
    //insert_custid += " (MBCODE,COCAT,COCODE,COSTS,COADAT)";

    if (questionnair.length == 0) return true;
    var stmt = "select * from MBRFLIB/INTR01P where";
    let count = questionnair.length;
    console.log("count:" + count);

    for (var i = 0; i < questionnair.length; i++) {
        console.log("l1");
        let cat = await Object.keys(questionnair[i]);
        console.log(cat);
        let code_list = await questionnair[i][cat[0]];
        console.log(code_list);
        for (var j = 0; j < code_list.length; j++) {
            stmt += " (COCODE='" + code_list[j] + "' and COCAT='" + cat[0] + "') or";
            console.log(stmt);
        }
        if ((i + 1) == questionnair.length) {
            stmt = await stmt.substring(0, stmt.length - 3);
            //const result = await pool.batchUpdate('INSERT INTO MBRFLIB/MVM04P (MBCODE,COCAT,COCODE,COSTS,COADAT) values(?,?,?,?,?)', data);
            console.log(stmt);
            result = await pool.query(stmt)
            console.log(result.length);
            console.log(result);

            if (result.length == count) {
                return true;
            }
            else {
                return false;
            }
        }
    }

});


