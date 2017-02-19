var should = require('should')
    , crypto = require('crypto')
    ;

describe('\nTesting ES in test script code for mocha', () => {

    it('\tWill run if ES is supported', (done) => {
        console.log(`\tHello world! ${(new Date()).getTime()}`);
        done();
    });

});

describe('\nTesting crypto hashing', () => {

    it('\tRuns crypto hashing with sha512', (done) => {
        //const algo = 'sha512';
        const algo = 'sha256';
        const hmac = crypto.createHmac(algo, 'F0rtyCAliber');
        hmac.on('readable', () => {
            const data = hmac.read();
            data.should.not.equal(null);
            data.should.not.equal(undefined);
            console.log(`\t${algo}: ${data.toString('base64')}`);
            return done();
        });
        hmac.write('Thirty1B3nd1ts!');
        hmac.end();
    });

});