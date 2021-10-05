const config = require('../config');
const pool = require('node-jt400').pool(config);

const update_mvm02p = require('./update_mvm02p');
const insert_mvm02p = require('./insert_mvm02p');
const lookup_mvm02p = require('../lookup/lookup_mvm02p');

module.exports.upsert = (async function (req, res, dtf, MBCODE) {
        //router.post('/:MBCODE', function (req, res) {

        console.log('Lookup MVM02P');

        let lookup = await lookup_mvm02p.lookup(req, res, dtf, MBCODE);
        if (lookup == true) {
                console.log('Lookup MVM02P : Exist');
                console.log('Update MVM02P');
                let update = await update_mvm02p.update(req, res, dtf, MBCODE);
                
                return update;

        } else {
                console.log('Lookup MVM02P : Not Exist');
                console.log('Insert MVM02P');
                let insert = await  insert_mvm02p.insert(req, res, dtf, MBCODE);
                return insert;

        }

});

