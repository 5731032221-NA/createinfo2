const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const lookup_country = require('./library/lookup/lookup_country');
const lookup_mcrta7p = require('./library/lookup/lookup_mcrta7p');
const lookup_mpotf1p = require('./library/lookup/lookup_mpotf1p');
const lookup_mvm01p = require('./library/lookup/lookup_mvm01p');
const lookup_intr01p = require('./library/lookup/lookup_intr01p');
const lookup_config = require('./library/lookup/lookup_config');
const cardrang =  require('./library/lookup/lookup_cardrang');
const insert_mcrta7p = require('./library/updatedata/insert_mcrta7p');
const insert_mpotf1p = require('./library/updatedata/insert_mpotf1p');
const insert_mvm01p = require('./library/updatedata/insert_mvm01p');
const insert_mvm02p = require('./library/updatedata/insert_mvm02p');
const update_mpotf1p = require('./library/updatedata/update_mpotf1p');
const upsert_mvm02p = require('./library/updatedata/upsert_mvm02p');
const insert_mvm04p = require('./library/updatedata/insert_mvm04p');
const genmb = require('./library/genmb');
const datetime = require('./library/datetime');


const schema = require('./library/checkSchema');

app.listen(8124, function () {
    console.log('app listening on port 8121!');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/register', async function (req, res) {

 
    var dtf = await datetime.getdatetime();

    var custid = '';
    var mb = '';
    var ctry = '';
    var mb_type = '';
    var mbnat_ = '';
    var nlnt_ = '';
    var mb_agen = req.body.MBAGEN;
    //var MBHTEL_ = ''; //if (MBHTEL_ == '027777777' || MBPTEL_ == '027777777') {  console.log('Update PM110MP');
    //var MBPTEL_ = '';
    // create new card?
   
    var CARDRANGE = req.body.MCARD_BIN_NUMBER
    ///////////validate schema/////////////////
    // check schema
    //schema.checkSchema(req, res, dtf, "register");
    let checkschema = schema.checkSchema(req, res, dtf, "register", dtf);
    if (checkschema) {
        
    console.log('Validate Schema');
    if (req.body.DEMO_NTNL == 'TH') {
        if (checkID(req.body.CUST_ID_OR_PASSPORT)) {
            citizen = req.body.CUST_ID_OR_PASSPORT;
        }
    } else if (!req.body.DEMO_NTNL) {
        res.status(400).json({
            "RESP_CDE": 401,
            "RESP_MSG": "Not success, Missing Parameter demo_ntnl"
        });
        return;
    } else if (req.body.CUST_ID_OR_PASSPORT.length > 10) {
        res.status(400).json({
            "RESP_CDE": 402,
            "RESP_MSG": "Not success, Invalid Parameter cust_id_or_passport"
        });
        return;
    }
    if(typeof req.body.DEMO_MRTLSTS != 'undefined'){
        let mrtlsts = await lookup_config.getmrtlsts(req.body.DEMO_MRTLSTS,res)
        req.body.DEMO_MRTLSTS = mrtlsts[0].MBHSTS  
   }
    
    if(typeof req.body.DEMO_OCCUP != 'undefined'){
        let occup  = await lookup_config.getoccup(req.body.DEMO_OCCUP ,res)
        req.body.DEMO_OCCUP  = occup[0].MBJOB
    }


        // DEMO_NTNL != 'TH'
        let country_name = await lookup_country.lookup(req, res, dtf, req.body.DEMO_NTNL);
        //country_name = JSON.parse(result);
        ctry = country_name[0].CNTRYCD3;
        mbnat_ = country_name[0].MBNAT;
        if (req.body.DEMO_NTNL == 'TH') {
            custid = req.body.CUST_ID_OR_PASSPORT
        } else {
            custid = country_name[0].CNTRYCD3 + req.body.CUST_ID_OR_PASSPORT;
        }
        console.log(custid);
    


 


    let lookupmember_mcrta7p = await lookup_mcrta7p.lookup(req, res, dtf, custid, req.body.DEMO_TH_NAME, req.body.DEMO_TH_SURNAME);
    ////////////// exist customer ///////////////////
    if (lookupmember_mcrta7p == true) {
        let lookupmember_mvm01p = await lookup_mvm01p.lookup(req, res, dtf, custid, req.body.CUST_ID_OR_PASSPORT);
        ////////////// exist card //////////////////

        if (lookupmember_mvm01p.length != 0) {
            ///////// create more card //////////
            res.status(400).json({
                "RESP_SYSCDE": 400,
                "RESP_DATETIME": dtf,
                "RESP_CDE": 103,
                "RESP_MSG": "Not success, You already have a card"
            });
            

        }
        ///////////////////// not exist card ///////////////////////
        else {
            ////////////////////////don't forget parameter/////////////////////////////
    let type =  await cardrang.validatecardrang(CARDRANGE,res);
    mb_type = type[0].MBMEMC ;         
    let gen_mb = await genmb.creatembcode(req, res,CARDRANGE);
    console.log('Running number : ' + result.MBCODE_R);
    mb = await gen_mb.Result;
            let createnewcard = await create_new_card(req, res, dtf, mb, mbnat_, ctry, mb_agen, mb_type);
            if (createnewcard == true) {
                let intr01p = await lookup_intr01p.lookup(req, res);
                    if(intr01p){
                        res.status(200).json({
                            "RESP_SYSCDE": 200,
                            "RESP_DATETIME": dtf,
                            "RESP_CDE": 102,
                            "RESP_MSG": "Success, found many MCard (already have cust_id)",
                            "MCARD_NUM": mb,
                            "CARD_TYPE": mb_type/*,
                            "CARD_EXPIRY_DATE": "999912",
                            "CARD_POINT_BALANCE": 0,
                            "CARD_POINT_EXPIRY": "999912",
                            "CARD_POINT_EXP_DATE": "999912"*/
                        });
                    }else{
                        res.status(200).json({
                            "RESP_SYSCDE": 200,
                            "RESP_DATETIME": dtf,
                            "RESP_CDE": 102,
                            "RESP_MSG": "Success, Warning missing data in INTR01P and found many MCard (already have cust_id)",
                            "MCARD_NUM": mb,
                            "CARD_TYPE": mb_type/*,
                            "CARD_EXPIRY_DATE": "999912",
                            "CARD_POINT_BALANCE": 0,
                            "CARD_POINT_EXPIRY": "999912",
                            "CARD_POINT_EXP_DATE": "999912"*/
                        });
                    }
            }
        }



        ////////////// not exist customer ///////////////////////
    } else {
        
        
        let lookupmember_mvm01p = await lookup_mvm01p.lookup(req, res, dtf, custid, req.body.CUST_ID_OR_PASSPORT);
        ////////////////// exist card //////////////////////
        if (lookupmember_mvm01p.length != 0) {
            ////////////// create more card ////////////////
            res.status(400).json({
                "RESP_SYSCDE": 400,
                "RESP_DATETIME": dtf,
                "RESP_CDE": 103,
                "RESP_MSG": "Not success, You already have a card"
            });
            
        }
        /////////////// not exist card ///////////////////////
        else {
             let type =  await cardrang.validatecardrang(CARDRANGE,res);
             mb_type = type[0].MBMEMC ;
	     let gen_mb = await genmb.creatembcode(req, res,CARDRANGE);
    console.log('Running number : ' + result.MBCODE_R);
    mb = await gen_mb.Result;
            ////////////////////////don't forget parameter////////////////////////
            let createnewcustomer = await create_new_customer(req, res, dtf, custid, mb, mbnat_, ctry, mb_agen, mb_type);
                                            
            if (createnewcustomer == true) {
                let intr01p = await lookup_intr01p.lookup(req, res);
                    if(intr01p){
                        res.status(200).json({
                            "RESP_SYSCDE": 200,
                            "RESP_DATETIME": dtf,
                            "RESP_CDE": 101,
                            "RESP_MSG": "Success",
                            "MCARD_NUM": mb,
                            "CARD_TYPE": mb_type/*,
                            "CARD_EXPIRY_DATE": "999912",
                            "CARD_POINT_BALANCE": 0,
                            "CARD_POINT_EXPIRY": "999912",
                            "CARD_POINT_EXP_DATE": "999912"
                       */
			 });
                    }else{
                        res.status(200).json({
                            "RESP_SYSCDE": 200,
                            "RESP_DATETIME": dtf,
                            "RESP_CDE": 101,
                            "RESP_MSG": "Success, Warning missing data in INTR01P",
                            "MCARD_NUM": mb,
                            "CARD_TYPE": mb_type/*,
                            "CARD_EXPIRY_DATE": "999912",
                            "CARD_POINT_BALANCE": 0,
                            "CARD_POINT_EXPIRY": "999912",
                            "CARD_POINT_EXP_DATE": "999912"*/
                        });
                    }
                }
            }
        }
    
    
    }
    
 
})

app.post('/forceregister', async function (req, res) {
  
    var dtf = await datetime.getdatetime();
    var custid = '';
    var mb = '';
    var ctry = '';
    var mb_type = '38';
    var mbnat_ = '';
    var nlnt_ = '';
    var mb_agen = req.body.MBAGEN;
    //var MBHTEL_ = ''; //if (MBHTEL_ == '027777777' || MBPTEL_ == '027777777') {  console.log('Update PM110MP');
    //var MBPTEL_ = '';
    // create new card?
    var create_new = '';
	
    var CARDRANGE = 710238;
        if (req.body.DEMO_NTNL == 'TH') {
                CARDRANGE =  710540; //710519
		mb_type = 'MC';
        }

    ///////////validate schema/////////////////
    // check schema
   let checkschema = schema.checkSchema(req, res, dtf, "register", dtf);
    if (checkschema) {

    console.log('Validate Schema');
    if (req.body.DEMO_NTNL == 'TH') {
        if (checkID(req.body.CUST_ID_OR_PASSPORT)) {
            citizen = req.body.CUST_ID_OR_PASSPORT;
        }
    } else if (!req.body.DEMO_NTNL) {
        res.status(400).json({
            "RESP_CDE": 401,
            "RESP_MSG": "Not success, Missing Parameter demo_ntnl"
        });
        return;
    } else if (req.body.CUST_ID_OR_PASSPORT.length > 10) {
        res.status(400).json({
            "RESP_CDE": 402,
            "RESP_MSG": "Not success, Invalid Parameter cust_id_or_passport"
        });
        return;
    }

        // DEMO_NTNL != 'TH'
        let country_name = await lookup_country.lookup(req, res, dtf, req.body.DEMO_NTNL);
        //country_name = JSON.parse(result);
        ctry = country_name[0].CNTRYCD3;
        mbnat_ = country_name[0].MBNAT;
        if (req.body.DEMO_NTNL == 'TH') {
            custid = req.body.CUST_ID_OR_PASSPORT
        } else {
            custid = country_name[0].CNTRYCD3 + req.body.CUST_ID_OR_PASSPORT;
        }
        console.log(custid);
    


 


    let lookupmember_mcrta7p = await lookup_mcrta7p.lookup(req, res, dtf, custid, req.body.DEMO_TH_NAME, req.body.DEMO_TH_SURNAME);
    ////////////// exist customer ///////////////////
    if (lookupmember_mcrta7p == true) {
        let lookupmember_mvm01p = await lookup_mvm01p.lookup(req, res, dtf, custid, req.body.CUST_ID_OR_PASSPORT);
        ////////////// exist card //////////////////

        if (lookupmember_mvm01p.length >= 0) {
            ///////// create more card //////////
             let gen_mb = await genmb.creatembcode(req, res,CARDRANGE);
    console.log('Running number : ' + result.MBCODE_R);
    mb = await gen_mb.Result;
	    let createnewcard = await create_new_card(req, res, dtf, mb, mbnat_, ctry, mb_agen, mb_type);
            if (createnewcard == true) {
                let intr01p = await lookup_intr01p.lookup(req, res);
                    if(intr01p){
                        res.status(200).json({
                            "RESP_SYSCDE": 200,
                            "RESP_DATETIME": dtf,
                            "RESP_CDE": 102,
                            "RESP_MSG": "Success, found many MCard (already have cust_id)",
                            "MCARD_NUM": mb,
                            "CARD_TYPE": mb_type,
                            "CARD_EXPIRY_DATE": "999912",
                            "CARD_POINT_BALANCE": 0,
                            "CARD_POINT_EXPIRY": "999912",
                            "CARD_POINT_EXP_DATE": "999912"
                        });
                    }else{
                        res.status(200).json({
                            "RESP_SYSCDE": 200,
                            "RESP_DATETIME": dtf,
                            "RESP_CDE": 102,
                            "RESP_MSG": "Success, Warning missing data in INTR01P and found many MCard (already have cust_id)",
                            "MCARD_NUM": mb,
                            "CARD_TYPE": mb_type,
                            "CARD_EXPIRY_DATE": "999912",
                            "CARD_POINT_BALANCE": 0,
                            "CARD_POINT_EXPIRY": "999912",
                            "CARD_POINT_EXP_DATE": "999912"
                        });
                    }
            }
           

        }
        ///////////////////// not exist card ///////////////////////
        



        ////////////// not exist customer ///////////////////////
    } else {
        
        
        let lookupmember_mvm01p = await lookup_mvm01p.lookup(req, res, dtf, custid, req.body.CUST_ID_OR_PASSPORT);
        ////////////////// exist card //////////////////////
        if (lookupmember_mvm01p.length >= 0) {
            ////////////// create more card ////////////////
             let gen_mb = await genmb.creatembcode(req, res,CARDRANGE);
    console.log('Running number : ' + result.MBCODE_R);
    mb = await gen_mb.Result;
	    let createnewcustomer = await create_new_customer(req, res, dtf, custid, mb, mbnat_, ctry, mb_agen, mb_type);
                                            
            if (createnewcustomer == true) {
                let intr01p = await lookup_intr01p.lookup(req, res);
                    if(intr01p){
                        res.status(200).json({
                            "RESP_SYSCDE": 200,
                            "RESP_DATETIME": dtf,
                            "RESP_CDE": 101,
                            "RESP_MSG": "Success",
                            "MCARD_NUM": mb,
                            "CARD_TYPE": mb_type,
                            "CARD_EXPIRY_DATE": "999912",
                            "CARD_POINT_BALANCE": 0,
                            "CARD_POINT_EXPIRY": "999912",
                            "CARD_POINT_EXP_DATE": "999912"
                        });
                    }else{
                        res.status(200).json({
                            "RESP_SYSCDE": 200,
                            "RESP_DATETIME": dtf,
                            "RESP_CDE": 101,
                            "RESP_MSG": "Success, Warning missing data in INTR01P",
                            "MCARD_NUM": mb,
                            "CARD_TYPE": mb_type,
                            "CARD_EXPIRY_DATE": "999912",
                            "CARD_POINT_BALANCE": 0,
                            "CARD_POINT_EXPIRY": "999912",
                            "CARD_POINT_EXP_DATE": "999912"
                        });
                    }
            }
           
        }
        
    
    }
    }
    
 
})

async function create_new_card(req, res, dtf, mb, mbnat_, ctry, mb_agen, mb_type) {
    
 //       var CARDRANGE = 710238; 
   //     if (req.body.DEMO_NTNL == 'TH') {
     //           CARDRANGE =  710540 //710519
      //  }
    //let gen_mb = await genmb.creatembcode(req, res,CARDRANGE);
    //console.log('Running number : ' + result.MBCODE_R);
    //mb = await gen_mb.Result;
    let insertmember_mvm01p = await insert_mvm01p.insert(req, res, dtf, mb, mbnat_, ctry, mb_agen, mb_type);
    if (insertmember_mvm01p == true) {
        let upsertmember_mvm02p = await upsert_mvm02p.upsert(req, res, dtf, mb);
        if (upsertmember_mvm02p == true) {
            // let insertmember_mvm03p = await insert_mvm01p.insert(req, res, mb ,mbnat_  ,ctry , mb_agen, mb_type);
            let insertmember_mvm04p = await insert_mvm04p.insert(req, res, dtf,mb);
            if (insertmember_mvm04p == true) {
                let lookupmember_mpotf1p = await lookup_mpotf1p.lookup(req, res, dtf, mb);
                if (lookupmember_mpotf1p.length == 0) {
                    let insertmember_mpotf1p = await insert_mpotf1p.insert(req, res, dtf, mb);
                    return true;
                } else {
                    let updatemember_mpotf1p = await update_mpotf1p.update(req, res, dtf, mb);
                    return true;
                }
            }
        }
    }
    
    
}

async function create_new_customer(req, res, dtf, custid, mb, mbnat_, ctry, mb_agen, mb_type) {
    
 //       var CARDRANGE = 710238; 
   //     if (req.body.DEMO_NTNL == 'TH') {
     //           CARDRANGE =  710540//710519
       // }
   // let gen_mb = await genmb.creatembcode(req, res,CARDRANGE);
   // console.log('Running number : ' + result.MBCODE_R);
   // mb = await gen_mb.Result;
    let insertmember_mcrta7p = await insert_mcrta7p.insert(req, res, dtf, custid, req.body.DEMO_TH_NAME, req.body.DEMO_TH_SURNAME);
    if (insertmember_mcrta7p == true) {
        let insertmember_mvm01p = await insert_mvm01p.insert(req, res, dtf, mb, mbnat_, ctry, mb_agen, mb_type);
        if (insertmember_mvm01p == true) {
            let upsertmember_mvm02p = await upsert_mvm02p.upsert(req, res, dtf, mb);
            if (upsertmember_mvm02p == true) {
                // let insertmember_mvm03p = await insert_mvm01p.insert(req, res, mb ,mbnat_  ,ctry , mb_agen, mb_type);
                let insertmember_mvm04p = await insert_mvm04p.insert(req, res, dtf,mb);
                if (insertmember_mvm04p == true) {
                    let lookupmember_mpotf1p = await lookup_mpotf1p.lookup(req, res, dtf, mb);
                    if (lookupmember_mpotf1p.length == 0) {
                        let insertmember_mpotf1p = await insert_mpotf1p.insert(req, res, dtf, mb);
                        return true;
                    } else {
                        let updatemember_mpotf1p = await update_mpotf1p.update(req, res, dtf, mb);
                        return true;
                    }
                }
            }
        }
    }
    
}

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
					console.log("Valid Citizen ID");					return true;
				}
			}
		}
