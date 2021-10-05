const config = require('./config_gen');
const pool = require('node-jt400').pool(config);


        var CARDRANGE = 710238; 
        
                CARDRANGE =  710519
        

        const myProgram =  pool.pgm('GENMC', [{
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
        // myProgram({
        //         Range: CARDRANGE,
        //         Result:''
        // }).then(function (result) {
        //         console.log(result);
        //         res.json({'MBCODE_R':result.Result});
        // })
        // .catch (function (err) {
        //         res.status(500);
        //         console.log(err);
        //         res.end();
        //         return;
        // });



        let myP =  myProgram({
                Range: CARDRANGE,
                Result: ''
        });
        
        console.log(myP)

   



