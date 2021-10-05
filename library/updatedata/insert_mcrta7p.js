const config = require('../config');
const pool = require('node-jt400').pool(config);


module.exports.insert = (async function (req, res, dtf, MBID, MBTNAM, MBTSUR) {
    //router.get('/:MBID/:MBTNAM/:MBTSUR', function (req, res) {

    var insert_custid = "insert into MBRFLIB/MCRTA7P";
    insert_custid += " (MBID,MBTNAM,MBTSUR)";
    //insert_custid += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
    insert_custid += " values(?,?,?)";
    //insert_custid += " values(?,?,?,?,?,?,?,?,?,?)";

    var insert_custid_params = [
        MBID //MBID
        , MBTNAM //MBTNAM
        , MBTSUR //MBTSUR

    ];
    var result = await pool.insertAndGetId(insert_custid, insert_custid_params);

    console.log(result.length);
    console.log(result);
    // res.status(200);
    // res.json({});

    if (result == 0) {
        return true;
    } else {
        res.status(500).json({
            "RESP_SYSCDE": 200,
            "RESP_DATETIME": dtf,
            "RESP_CDE": 500,
            "RESP_MSG": "Not success, Insert fail(MCRTA7P)"
        });
        res.end();
    }

});



