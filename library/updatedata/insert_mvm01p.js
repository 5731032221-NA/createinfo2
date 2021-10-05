const config = require('../config');
const pool = require('node-jt400').pool(config);

module.exports.insert = (async function (req, res, dtf, MBCODE, MBNAT, CTRY3, MBAGEN, MBTYPE) {
    //router.post('/:MBCODE/:MBNAT/:CTRY3/:MBAGEN/:MBTYPE', function (req, res) {


    var citizen = '';
    var passport = '';

    if (req.body.DEMO_NTNL == 'TH') {
        if (checkID(req.body.CUST_ID_OR_PASSPORT)) {
            citizen = req.body.CUST_ID_OR_PASSPORT;
        } else {
            res.status(400).json({
                "RESP_CDE": 402,
                "RESP_MSG": "Invalid Format cust_id_or_passport"
            });
            return;
        }
    }
    else {
        passport = req.body.CUST_ID_OR_PASSPORT;
    }

    if (req.body.DEMO_NTNL != 'TH') {
        citizen = CTRY3 + req.body.CUST_ID_OR_PASSPORT;
    }

    var date_str = '';
    var today = new Date();
    date_str = today.getFullYear().toString() + ((today.getMonth() + 1) < 10 ? '0' : '').toString() + (today.getMonth() + 1).toString() + (today.getDate() < 10 ? '0' : '').toString() + today.getDate();
    var age = parseInt(today.getFullYear().toString()) - parseInt(req.body.DEMO_DOB.toString().substr(0, 4));
    var insert_mcard_params = []
    var insert_mcard = "insert into MBRFLIB/MVM01P (";
    var insert_log_value = " values(";
     
    if(typeof req.body.CONTACT_OFFICE != 'undefined'){
        insert_mcard += "MBOTEL, " 
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.CONTACT_OFFICE);
    }
    if(typeof req.body.CONTACT_OFFICE_EXTENSION != 'undefined'){
        insert_mcard += "MBEXT, ";
        insert_log_value += "?,"
           insert_mcard_params.push(req.body.CONTACT_OFFICE_EXTENSION);
    }
    if(typeof req.body.ADD_ROOM_NUM != 'undefined'){
        insert_mcard += "MBROOM, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.ADD_ROOM_NUM)
    }
        insert_mcard += "MBAPP, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.MBBRH)
   
        insert_mcard += "MBCODE, "
        insert_log_value += "?,"
        insert_mcard_params.push(MBCODE)
    
    
        insert_mcard += "MBTTLE, "
        insert_log_value += "?,"
        if(req.body.DEMO_NTNL != 'TH'){
            insert_mcard_params.push("")
        }else{
            insert_mcard_params.push("คุณ")
        }
    
    if(typeof req.body.DEMO_TH_NAME != 'undefined'){
        insert_mcard += "MBTNAM, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.DEMO_TH_NAME)
    }
    if(typeof req.body.DEMO_TH_SURNAME != 'undefined'){
        insert_mcard += "MBTSUR, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.DEMO_TH_SURNAME)
    }
    if(typeof req.body.DEMO_EN_TITLE != 'undefined'){
        insert_mcard += "MBETLE, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.DEMO_EN_TITLE)
    }
    if(typeof req.body.DEMO_EN_NAME != 'undefined'){
        insert_mcard += "MBENAM, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.DEMO_EN_NAME)
    }
    if(typeof req.body.DEMO_EN_SURNAME != 'undefined'){
        insert_mcard += "MBESUR, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.DEMO_EN_SURNAME)
    }
        insert_mcard += "MBPUR, "
        insert_log_value += "?,"
        insert_mcard_params.push(11)
    
        insert_mcard += "MBEXP, "
        insert_log_value += "?,"
        insert_mcard_params.push(999912)
    
         insert_mcard += "MBID, "
         insert_log_value += "?,"
        insert_mcard_params.push(citizen)
    
    if(typeof req.body.DEMO_DOB != 'undefined'){
        insert_mcard += "MBBIRH, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.DEMO_DOB)
    }
        insert_mcard += "MBAGE, "
        insert_log_value += "?,"
        insert_mcard_params.push(age)
    
        insert_mcard += "MBPASS, "
        insert_log_value += "?,"
        insert_mcard_params.push(passport)
    
        insert_mcard += "MBNAT, "
        insert_log_value += "?,"
        insert_mcard_params.push(MBNAT)
    
    if(typeof req.body.DEMO_MRTLSTS != 'undefined'){
        insert_mcard += "MBHSTS, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.DEMO_MRTLSTS)
    }
    if(typeof req.body.DEMO_GENDER != 'undefined'){
        insert_mcard += "MBSEX, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.DEMO_GENDER)
    }
    if(typeof req.body.DEMO_HAVE_KIDS != 'undefined'){
        insert_mcard += "MBCHIL, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.DEMO_HAVE_KIDS)
    }
    if(typeof req.body.DEMO_OCCUP != 'undefined'){
        insert_mcard += "MBJOB, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.DEMO_OCCUP)
    }
        insert_mcard += "MBSINC, "
        insert_log_value += "?,"
        insert_mcard_params.push(parseInt(today.getFullYear().toString()))
    
    if(typeof req.body.ADD_HOUSE_NUM != 'undefined'){
        insert_mcard += "MBHNO, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.ADD_HOUSE_NUM)
    }
    if(typeof req.body.ADD_VILLAGE_1 != 'undefined'){
        insert_mcard += "MBHVIL, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.ADD_VILLAGE_1)
    }
    if(typeof req.body.ADD_VILLAGE_2 != 'undefined'){
        insert_mcard += "MBPLA, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.ADD_VILLAGE_2)
    }
    if(typeof req.body.ADD_FLOOR != 'undefined'){
        insert_mcard += "MBFLR, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.ADD_FLOOR)
    }
    if(typeof req.body.ADD_SOI != 'undefined'){
        insert_mcard += "MBHSOI, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.ADD_SOI)
    }
    if(typeof req.body.ADD_ROAD != 'undefined'){
        insert_mcard += "MBHRD, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.ADD_ROAD)
    }
    if(typeof req.body.ADD_SUB_DISTRICT != 'undefined'){
        insert_mcard += "MBHPFT, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.ADD_SUB_DISTRICT)
    }
    if(typeof req.body.ADD_DISTRICT != 'undefined'){
        insert_mcard += "MBHBOR, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.ADD_DISTRICT)
    }
    if(typeof req.body.ADD_PROVINCE != 'undefined'){
        insert_mcard += "MBHPRV, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.ADD_PROVINCE)
    }
    if(typeof req.body.ADD_POSTAL_CODE != 'undefined'){
        insert_mcard += "MBHPOS, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.ADD_POSTAL_CODE)
    }
    if(typeof req.body.CONTACT_HOME != 'undefined'){
        insert_mcard += "MBHTEL, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.CONTACT_HOME)
    }
    if(typeof req.body.CONTACT_MOBILE != 'undefined'){
        insert_mcard += "MBPTEL, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.CONTACT_MOBILE)
    }
   
        insert_mcard += "MBMEMC, "
        insert_log_value += "?,"  
        insert_mcard_params.push(MBTYPE)
        
    
        insert_mcard += "MBDAT, "
        insert_log_value += "?,"
        insert_mcard_params.push(parseInt(date_str))
    
    if(typeof req.body.CONTACT_EMAIL != 'undefined'){
        insert_mcard += "MBEMAIL, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.CONTACT_EMAIL)
    }
        insert_mcard += "MBBRH, "
        insert_log_value += "?,"
        insert_mcard_params.push(req.body.MBBRH)
    
        insert_mcard += "MBAGEN, "
        insert_log_value += "?,"
        insert_mcard_params.push(MBAGEN)
    
        insert_mcard += "MBFLP "
        insert_log_value += "?)"
         if(req.body.DEMO_NTNL != 'TH'){
             insert_mcard_params.push("A")
         }else{
             insert_mcard_params.push("")
         }
    
    
    //  if(insert_mcard_params[insert_mcard_params.length-1] == ','){
    //        insert_mcard_params = insert_mcard_params.slice(0 ,insert_mcard_params.length-1)
    //  }

     insert_mcard += ")";
     insert_mcard += insert_log_value;

    //MCRR2P - not implemented yet
    //point_log2_stmt = "";
    console.log('insert_mcard_stmt');
    console.log(insert_mcard_params);

    var result = await pool.insertAndGetId(insert_mcard, insert_mcard_params);

    console.log(result.length);
    console.log(result);

    //res.status(200);
    //res.json(result);
    if (result == 0) {
        return true;
    } else {
        res.status(500).json({
            "RESP_SYSCDE": 200,
            "RESP_DATETIME": dtf,
            "RESP_CDE": 500,
            "RESP_MSG": "Not success, Insert fail(MVM01P)"
        });
        res.end();
    }

});


function checkID(custid) {
    var ssn_ = custid;
    var sum = 0;
    console.log(ssn_);
    if (ssn_.length != 13) {
        console.log("Invalid Citizen ID - Length");
        return false;
    } else {
        for (i = 0, sum = 0; i < 12; i++)
            sum += parseFloat(ssn_.charAt(i)) * (13 - i);
        if ((11 - sum % 11) % 10 != parseFloat(ssn_.charAt(12))) {
            console.log("Invalid Citizen ID - Format");
            return false;
        } else {
            console.log("Valid Citizen ID");
            return true;
        }
    }
}


