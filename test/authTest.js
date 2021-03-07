let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

chai.use(chaiHttp);
chai.should();

describe('Auth API Tests...', () => {
    
    describe('Authenticating a user', () => {
        it('It SHOULD AUTHENTICATE a user with valid credentials', done => {
            const user = {
                email: 'kishan@doshi2.com',     // REQUIRED
                password: 'somePss1',         // REQUIRED
            }
            chai.request(server)
            .post('/api/auth')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success').eq(true);
                res.body.should.have.property('user').be.a('object');
                res.body.should.have.property('token');
                res.body.should.have.property('user');
                res.body.user.should.have.property('name');
                res.body.user.should.have.property('email');
                done();
            })
        })

        describe('Does not Authenticating a user', () => {
            it('It SHOULD NOT AUTHENTICATE a user with invalid email', done => {
                const user = {
                    email: 'kishan@doshi3.com',     // REQUIRED
                    password: 'somePss1',         // REQUIRED
                }
                chai.request(server)
                .post('/api/auth')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    res.body.msg.should.be.eq('Invalid Credentials.')
                    done();
                })
            })

            it('It SHOULD NOT AUTHENTICATE a user with incorrect password', done => {
                const user = {
                    email: 'kishan@doshi2.com',     // REQUIRED
                    password: 'somePss2',         // REQUIRED
                }
                chai.request(server)
                .post('/api/auth')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    res.body.msg.should.be.eq('Invalid Credentials.')
                    done();
                })
            })
        })
    })
})