let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

chai.use(chaiHttp);
chai.should();

describe('User API Tests...', () => {

    describe('Registering a new user', () => {
        /* 
        it('It should REGISTER A NEW USER with unique email successfully', done => {
            const newUser = {
                name: 'Kishan Doshi',
                email: 'kishan@doshi2.com',
                password: 'passwordT1',
                confirmPassword: 'passwordT1'
            }
            chai.request(server)
            .post('/api/users')
            .send(newUser)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success').eq(true);
                res.body.should.have.property('user').be.a('object');
                res.body.should.have.property('user');
                res.body.user.should.have.property('name');
                res.body.user.should.have.property('email');
                res.body.user.should.have.property('password');
                res.body.user.should.have.property('registeredOn');
                // password should be hash and not plain text password
                res.body.user.password.should.not.eq(newUser.password);
                done();
            })
        })
        */

       describe('Registering new user should fail', () => {
            it('It should NOT REGISTER AN EXISTING USER with same email address', done => {
                // Choose email id of an existing user and with a good password strength
                const newUser = {
                    name: 'Kishan Doshi',
                    email: 'kishan@doshi2.com',
                    password: 'passwordT1',
                    confirmPassword: 'passwordT1'
                }
                chai.request(server)
                .post('/api/users')
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    res.body.msg.should.be.eq('User already exists.');
                    done();
                })
            })

            it('It should NOT REGISTER A USER WITHOUT a required param', done => {
                // Comment out atleast 1 newUser param to run this test
                const newUser = {
                    // name: 'Kishan Doshi',        // REQUIRED
                    email: 'kishan@doshi2.com',     // REQUIRED
                    password: 'passwordT1',         // REQUIRED
                    confirmPassword: 'passwordT1'   // REQUIRED
                }
                chai.request(server)
                .post('/api/users')
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    res.body.msg.should.be.eq('Please enter all fields.');
                    done();
                })
            })

            it('It should NOT REGISTER A USER WITH INVALID email address', done => {
                // Comment out atleast 1 newUser param to run this test
                const newUser = {
                    name: 'Kishan Doshi',           // REQUIRED
                    email: 'kishan@doshi2',     // REQUIRED
                    password: 'passwordT1',         // REQUIRED
                    confirmPassword: 'passwordT1'   // REQUIRED
                }
                chai.request(server)
                .post('/api/users')
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    res.body.msg.should.be.eq('Please enter a valid email address.');
                    done();
                })
            })

            it('It should NOT REGISTER A USER WITH a password with length > 8', done => {
                // Comment out atleast 1 newUser param to run this test
                const newUser = {
                    name: 'Kishan Doshi',           // REQUIRED
                    email: 'kishan@doshi10.com',     // REQUIRED
                    password: 'passdT1',         // REQUIRED
                    confirmPassword: 'passdT1'   // REQUIRED
                }
                chai.request(server)
                .post('/api/users')
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    res.body.msg.should.be.eq('Password should be of 8 Character minimum.');
                    done();
                })
            })

            it('It should NOT REGISTER A USER WITH a weak password', done => {
                // Comment out atleast 1 newUser param to run this test
                const newUser = {
                    name: 'Kishan Doshi',           // REQUIRED
                    email: 'kishan@doshi10.com',     // REQUIRED
                    password: 'passdasdas1',         // REQUIRED
                    confirmPassword: 'passdasdas1'   // REQUIRED
                }
                chai.request(server)
                .post('/api/users')
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    res.body.msg.should.be.eq('Password should contain atleast 1 Uppercase, 1 Lowercase & 1 Number.');
                    done();
                })
            })

            it('It should NOT REGISTER A USER WITH confirm password does not match', done => {
                // Comment out atleast 1 newUser param to run this test
                const newUser = {
                    name: 'Kishan Doshi',           // REQUIRED
                    email: 'kishan@doshi10.com',     // REQUIRED
                    password: 'PasswordT1',         // REQUIRED
                    confirmPassword: 'Password1T'   // REQUIRED
                }
                chai.request(server)
                .post('/api/users')
                .send(newUser)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    res.body.msg.should.be.eq('Password does not match.');
                    done();
                })
            })
        })
    })
})