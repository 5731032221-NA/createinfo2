const config = require('../config');
const pool = require('node-jt400').pool(config);

module.exports.insert = (async function (req, res, dtf, MBCODE) {
    //router.post('/:MBCODE', function (req, res) {

    var date_str = '';
    var today = new Date();
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
    var contacthome = '';
    if (typeof req.body.CONTACT_HOME != 'undefined') {
        contacthome = req.body.CONTACT_HOME;
    }

    var insert_log = "insert into MBRFLIB/MPOTF1P";
    insert_log += " (MBCODE,MBTNAM,MBTSUR,MBEXP,MBID,MBBIRH,MBHTEL,MBPTEL,MBDAT,MBDATS,MBSTS,MBPOINT,MBACT)";
    //insert_log += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
    insert_log += " values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
    //insert_log += " values(?,?,?,?,?,?,?,?,?,?)";

    var insert_log_params = [
        MBCODE //MBCODE
        , req.body.DEMO_TH_NAME //MBTNAM
        , req.body.DEMO_TH_SURNAME //MBTSUR
        , 999912 //MBEXP
        , req.body.CUST_ID_OR_PASSPORT //MBID
        , req.body.DEMO_DOB //MBBIRH
        , contacthome //MBHTEL
        , req.body.CONTACT_MOBILE //MBPTEL
        , parseInt(date_str) //MBDAT
        , parseInt(date_str) //MBDATS
        , 'A' //MBSTS
        , 0 //MBPOINT
        , 'A' //MBACT
    ];

    //MCRR2P - not implemented yet
    //point_log2_stmt = "";
    console.log('insert_log');
    console.log(insert_log);
    var result = await pool.insertAndGetId(insert_log, insert_log_params);

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
            "RESP_MSG": "Not success, Insert fail(MPOTF1P)"
        });
        res.end();
    }
});



