const config = require('./config_gen');
const pool = require('node-jt400').pool(config);

module.exports.creatembcode = (async function (req, res,CARDRANGE) {
        //router.get('/:CARDRANGE', function (req, res) {
        //console.log(CARDRANGE);
        
        const myProgram = pool.pgm('GENMC', [{
                type: 'CHAR',
                precision: 20,
                scale: 0,
                name: 'Range'
        },
        {
                type: 'CHAR',
                precision: 20,
                scale: 0,
                name: 'Result'
        }
        ]);

       



        var myP = await myProgram({
                Range: CARDRANGE,
                Result: ''
        });
        return myP;
});
