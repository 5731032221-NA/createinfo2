const config = require('../config');
const pool = require('node-jt400').pool(config);


module.exports.insert = (async function (req, res, dtf, MBCODE) {
    //router.get('/:MBID/:MBTNAM/:MBTSUR', function (req, res) {
    
    var questionnair = await req.body.QUESTIONNAIRE;
   //res.send(req.body.QUESTIONNAIRE)
    //List!!!!!!!!
    //var insert_custid = "insert into MBRFLIB/MVM04P";
    //insert_custid += " (MBCODE,COCAT,COCODE,COSTS,COADAT)";
    COADAT = dtf.substr(0, 8);
    var data = [];
    if (questionnair.length === 0) return true;
    var cat =['fail'];
    //while (questionnair.length > 0) {
    for(var i =0;i<questionnair.length;i++){
        
        /*if(questionnair.length > 0){
            data.push([MBCODE, list[0].INTEREST_CAT, list[0].INTEREST_CODE, "", COADAT]);
        }*/
        //if(questionnair.length > 0){
        cat = await Object.keys(questionnair[i]);
        var code_list = await questionnair[i][cat[0]];
        //res.send(questionnair[0][cat[0]]);
        
        //while(code_list.length > 0){
        for(var j =0;j<code_list.length;j++){
            //if(code_list.length > 0){
            await data.push([MBCODE, cat[0],  code_list[j] , "", COADAT]);
            //}
            //var deletedItem =  code_list.splice(0, 1);
        }
        //if (questionnair.length == 0) {
        if((i+1) == questionnair.length){
            //res.send(data);
            try {
                const result = await pool.batchUpdate('INSERT INTO MBRFLIB/MVM04P (MBCODE,COCAT,COCODE,COSTS,COADAT) values(?,?,?,?,?)', data);
                console.log(result);
                // result is the number of updated rows for each row. [1, 1] in this case.
                if (result[0] >= 0) {
                return true;
            } else {
                res.status(500).json({
                    "RESP_SYSCDE": 200,
                    "RESP_DATETIME": dtf,
                    "RESP_CDE": 500,
                    "RESP_MSG": "Not success, Insert fail(MVM04P)"
                });
                res.end();
            }
            }
            catch (error) {
                res.send(error.stack);
                console.log('error');
                console.log(error);
            }
            
        }
       // var deletedItem = questionnair.splice(0, 1);
    }
    /*

    var insert_custid = "insert into MBRFLIB/MVM04P";
    insert_custid += " (MBCODE,COCAT,COCODE,COSTS,COADAT)";
    //insert_custid += " (MBAPP,MBCODE,MBID,MBTTLE,MBTNAM,MBTSUR,MBETLE,MBENAM,MBESUR,MBEXP)";
    insert_custid += " values(?,?,?,?,?)";
    //insert_custid += " values(?,?,?,?,?,?,?,?,?,?)";

    var insert_custid_params = [
        MBCODE 
        , //COCAT req.body.INTEREST_LIST.INTEREST_CAT
        , //COCODE req.body.INTEREST_LIST.INTEREST_CODE
        , "" //COSTS
        , COADAT
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
            "RESP_MSG": "Not success, Insert fail(MVM04P)"
        });
        res.end();
    }
}*/

});



