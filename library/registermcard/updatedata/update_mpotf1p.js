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
        var update_stmt = "update MBRFLIB/MPOTF1P ";
        update_stmt += " set MBTNAM=?,MBTSUR=?,MBEXP=?,MBID=?,MBBIRH=?,MBHTEL=?,MBPTEL=?,MBDAT=?,MBDATS=?,MBSTS=?,MBPOINT=?,MBACT=?";
        update_stmt += " where MBCODE='" + MBCODE + "' and MBDAT='" + parseInt(date_str) + "'";
        var update_params = [req.body.DEMO_TH_NAME, req.body.DEMO_TH_SURNAME, 999912, req.body.CUST_ID_OR_PASSPORT, req.body.DEMO_DOB, contacthome, req.body.CONTACT_MOBILE, parseInt(date_str), parseInt(date_str), 'A', 0, 'A'];
        /*
                pool.update(update_stmt, update_params)
        
                        .then(function (result) {
                                console.log(result.length);
                                console.log(result);
                                res.status(200);
                                res.json({});
                        })
                        .catch(function (err) {
                                res.status(500);
                                console.log(err);
                                res.end();
                        });*/

        var result = await pool.update(update_stmt, update_params)

        console.log(result.length);
        console.log(result);
        //res.status(200);
        //res.json({});

        //test res mpotf1p
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


