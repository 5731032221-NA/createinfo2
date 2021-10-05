const config = require('../config');
const pool = require('node-jt400').pool(config);

const update_mpotf1p = require('../updatedata/update_mcrta7p');

module.exports.lookup = (async function (req, res, dtf, CUSTID, MBTNAM, MBTSUR) {
    //router.get('/:CUSTID/:MBTNAM/:MBTSUR', function (req, res) {
    
    
    console.log(req.params.CUST_COUNTRYCODE);
    var stmt = "select * from MBRFLIB/MCRTA7P MCRTA7P where MCRTA7P.MBID = '" + CUSTID + "'";
    result = await pool.query(stmt)

    console.log(result.length);
    console.log(result);
    // MCRTA7P.MBID  must not exist
    if (result.length > 0) {
        console.log('Lookup MCRTA7P : Exist');
        console.log('Update MCRTA7P');
            return true;
     }
     
     
    else {
        return false;
    }
    /*var uri_get = encodeURI('' + config.endpoint.api_mcard_command.protocol + '://' + config.endpoint.api_mcard_command.url + ':' + config.endpoint.api_mcard_command.port + '/api/mcard/update_mcrta7p/' + CUSTID + '/' + MBTNAM + '/' + MBTSUR);
    rp.get(uri_get)
        .then(function (result) {
            console.log('Update MCRTA7P : success');
            return true;
        })
        .catch(function (err) {
            console.log('Update MCRTA7P : fail');
            res.status(500);
            res.end();
            return;
        });



} else {
    return false;
}*/

});



