const config = require('../config');
const pool = require('node-jt400').pool(config);

module.exports.insert = (async function (req, res, dtf, MBCODE) {
    //router.post('/:MBCODE', function (req, res) {

    var insert_mvm02 = "insert into MBRFLIB/MVM02P";
    insert_mvm02 += " (MBAPP,MBCODE,MBCRE9)";
    //insert_mvm02 += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
    insert_mvm02 += " values(?,?,?)";
    //insert_mvm02 += " values(?,?,?,?,?,?,?,?,?,?)";

    var insert_mvm02_params = [
        02 //MBAPP
        , MBCODE //MBCODE
        , 0 //MBCRE9
    ];

    //MCRR2P - not implemented yet
    //point_log2_stmt = "";
    console.log('insert_mvm02');
    console.log(insert_mvm02);

    var result = await pool.insertAndGetId(insert_mvm02, insert_mvm02_params);

    console.log(result.length);
    console.log(result);
    //res.status(200);
    //res.json({});
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


