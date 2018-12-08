//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let User = require('../models/users');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');
let should = chai.should();
let jwt = require( 'jsonwebtoken');

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    let token = null;

    before(async () => {
        return new Promise(async(resolve, reject) => {
            try {
                await User.remove({});
                const user = new User({name: 'admin', password: '123456'});
                await user.save();
                // Create a token
                const payload = { user: user.name };
                const options = { expiresIn: '2d', issuer: 'marianoselvaggi' };
                const secret = process.env.JWT_SECRET;
                token = jwt.sign(payload, secret, options); 
                resolve();
            } catch (error) {
                reject(error);
            }            
        });
    });

    /*
    * Test the /GET route
    */
    describe('/GET users', () => {
        it('it should fail to GET all the users because of token', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.errors.should.be.eql('not authorized');
                done();
                });
        });

        it('it should pass to GET all the users because of token', (done) => {
            chai.request(server)
                .get('/users')
                .set('authorization', 'Barear ' + token)
                .end((err, res) => {
                    res.should.have.status(201);
                    // res.body.should.be.a('object');
                    // res.body.errors.should.be.eql('not authorized');
                done();
                });
        });

    });

});