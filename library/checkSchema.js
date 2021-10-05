const Joi = require('joi');


const _mandatory_template = {
    "register": Joi.object().keys({
        CUST_ID_OR_PASSPORT: Joi.any().required(),
        DEMO_TH_TITLE: Joi.any().optional(),
        DEMO_TH_NAME: Joi.any().required(),
        DEMO_TH_SURNAME: Joi.any().required(),
        DEMO_EN_TITLE: Joi.any().optional(),
        DEMO_EN_NAME: Joi.any().optional(),
        DEMO_EN_SURNAME: Joi.any().optional(),
        DEMO_DOB: Joi.any().required(),
        DEMO_NTNL: Joi.any().required(),
        DEMO_GENDER: Joi.any().required(),
        DEMO_MRTLSTS: Joi.any().optional(),
        DEMO_HAVE_KIDS: Joi.any().optional(),
        DEMO_OCCUP: Joi.any().optional(),
        ADD_HOUSE_NUM: Joi.any().optional(),
        ADD_MOO: Joi.any().optional(),
        //v2
        ADD_VILLAGE_1: Joi.any().optional(),
        ADD_VILLAGE_2: Joi.any().optional(),
        ADD_ROOM_NUM: Joi.any().optional(),
        //end v2
        ADD_FLOOR: Joi.any().optional(),
        ADD_SOI: Joi.any().optional(),
        ADD_ROAD: Joi.any().optional(),
        ADD_SUB_DISTRICT: Joi.any().optional(),
        ADD_DISTRICT: Joi.any().optional(),
        ADD_PROVINCE: Joi.any().optional(),
        ADD_POSTAL_CODE: Joi.any().optional(),
        CONTACT_MOBILE: Joi.any().optional(),
        CONTACT_HOME: Joi.any().optional(),
        CONTACT_EMAIL: Joi.any().optional(),
        //v2
        CONTACT_OFFICE: Joi.any().optional(),
        CONTACT_OFFICE_EXTENSION: Joi.any().optional(),
        MCARD_BIN_NUMBER: Joi.any().required(),
        //end v2
        MCARD_FLAG: Joi.any().optional(),
	    MBAGEN: Joi.any().optional(),
	    MBBRH: Joi.any().optional(),
        QUESTIONNAIRE: Joi.array().required(),
    }).or('CONTACT_MOBILE', 'CONTACT_EMAIL')
};


const _template = {
    "register": Joi.object().keys({
        CUST_ID_OR_PASSPORT: Joi.string().max(13),
        DEMO_TH_TITLE: Joi.string().max(15),
        DEMO_TH_NAME: Joi.string().max(23),
        DEMO_TH_SURNAME: Joi.string().max(30),
        DEMO_EN_TITLE: Joi.string().max(10),
        DEMO_EN_NAME: Joi.string().max(20),
        DEMO_EN_SURNAME: Joi.string().max(30),
        DEMO_DOB: Joi.string().max(8),
        DEMO_NTNL: Joi.string().max(2),
        DEMO_GENDER: Joi.string().max(10),
        DEMO_MRTLSTS: Joi.string().max(20),
        DEMO_HAVE_KIDS: Joi.number().max(99),
        DEMO_OCCUP: Joi.string().max(20),
        ADD_HOUSE_NUM: Joi.string().max(12),
        ADD_MOO: Joi.string().max(15),
        ADD_VILLAGE_1: Joi.string().max(50),
        ADD_VILLAGE_2: Joi.string().max(50),
        ADD_ROOM_NUM: Joi.string().max(15),
        ADD_FLOOR: Joi.string().max(10),
        ADD_SOI: Joi.string().max(20),
        ADD_ROAD: Joi.string().max(20),
        ADD_SUB_DISTRICT: Joi.string().max(15),
        ADD_DISTRICT: Joi.string().max(15),
        ADD_PROVINCE: Joi.string().max(15),
        ADD_POSTAL_CODE: Joi.number().max(99999),
        CONTACT_MOBILE: Joi.string().max(12),
        CONTACT_HOME: Joi.string().max(20),
        CONTACT_EMAIL: Joi.string().max(40),
        CONTACT_OFFICE: Joi.string().max(50),
        CONTACT_OFFICE_EXTENSION: Joi.number().max(99999),
        MCARD_BIN_NUMBER: Joi.number().max(999999),
        MCARD_FLAG: Joi.string().max(50),
    	MBAGEN: Joi.string().max(4),
    	MBBRH: Joi.string().max(4),
        QUESTIONNAIRE: Joi.array().required()
    })

}
// /validation/schema/:SCHEMANO
//router.post('/:SCHEMANO', function (req, res,SCHEMANO) {
module.exports.checkSchema = (async function (req, res, dtf, SCHEMANO) {
    console.log('check schema 1');
    /* if (SCHEMANO == 'REGISTER') {
         res.status(200);
         res.end();
     }*/
    let result = Joi.validate(req.body, _mandatory_template[SCHEMANO]);
    if (result.error === null) {
        let result = Joi.validate(req.body, _template[SCHEMANO]);
        if (result.error == null) {
            //res.status(200).send('Success');
            return true;
        } else {
            console.log(result);
            /* res.json({
                 "reason": "Invalid Format : " + result.error.details[0].context.key
             });*/
            //res.json(result.error.details[0].context.key);
            res.status(400);
            res.json({
                "RESP_SYSCDE": 200,
                "RESP_DATETIME": dtf,
                "RESP_CDE": 402,
                "RESP_MSG": "Invalid Parameter " + result.error.details[0].context.key.toLowerCase()
            });
            return true;
        }
    } else {
        console.log(result);
        //res.status(401).send('Missing Required Field');
        res.status(200);
        //res.json(result.error.details[0].context.key);
        res.status(400).json({
            "RESP_SYSCDE": 200,
            "RESP_DATETIME": dtf,
            "RESP_CDE": 401,
            "RESP_MSG": (result.error.details[0].context.key !== undefined) ?  "Missing Parameter " + result.error.details[0].context.key.toLowerCase() : "Missing Parameter " + result.error.details[0].message.toLowerCase()
        });
        return false;
    }
});


