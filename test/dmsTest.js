let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

chai.use(chaiHttp);
chai.should();

describe('Direct messaging API routes tests...', () => {

    // Change the token if you get unexpected 400 or 401 status..
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDUyODAzZWJhMmFiM2U2NGJmODU5YyIsImlhdCI6MTYxNTE2NTUyOH0.3-wnM0Pnna9dhJK8hkZZ6p7vMRdy4sgdUEg4hriYU3I';
    // Token for user
    // "user": {
    //     "_id": "60452803eba2ab3e64bf859c",
    //     "name": "Kishan Doshi",
    //     "email": "kishan@doshi2.com",
    //     "password": "$2a$10$3S2z81kRvWMBfMwGKu0A7OI1X4AtsuLpBdhNzAw8DEb.oNKXbvge.",
    //     "registeredOn": "2021-03-07T19:22:43.031Z",
    //     "__v": 0
    // }

    /**
     * GET API routes
     * This route will return chats with a user (provided Id in the header params) with user requesting the GET method
     */
    describe('dms GET route tests..', () => {
        it('It SHOULD GET direct messages with another user', done => {
            const id = '6045994cd232203f30ca9d93';
            chai.request(server)
            .get('/api/dms/' + id)
            .set('x-auth-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success').eq(true);
                res.body.should.have.property('dms').be.a('array');
                done();
            })

        })

        it('It SHOULD NOT GET direct messages with another user with invalid id', done => {
            const id = '6045994cd232203f30ca9d94';
            chai.request(server)
            .get('/api/dms/' + id)
            .set('x-auth-token', token)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('msg');
                done();
            })
        })

        it('It SHOULD NOT GET direct messages with another user without token', done => {
            const id = '6045994cd232203f30ca9d93';
            chai.request(server)
            .get('/api/dms/' + id)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('msg');
                done();
            })
        })

        it('It SHOULD NOT GET direct messages with another user with invalid token', done => {
            const id = '6045994cd232203f30ca9d93';
            chai.request(server)
            .get('/api/dms/' + id)
            .set('x-auth-token', token + 'a')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('msg');
                done();
            })
        })
    })

    /**
     * POST API routes
     * This route should send a message to a user
     */
    describe('dms POST route tests...', () => {
        /*
        it('It SHOULD SEND a message to the user with valid id and token', done => {
            const id = '6045994cd232203f30ca9d93';
            const message = { message: "This message is a test message." }
            chai.request(server)
                .post('/api/dms/' + id)
                .set('x-auth-token', token)
                .send(message)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('success').eq(true);
                    res.body.should.have.property('dm');
                    done();
                })
        })
        */
       
        it('It SHOULD NOT SEND a message to the user with invalid id', done => {
            const id = '6045994cd232203f30ca9d90';
            const message = { message: "This message is a test message." }
            chai.request(server)
                .post('/api/dms/' + id)
                .set('x-auth-token', token)
                .send(message)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    res.body.msg.should.be.eq('User not found.');
                    done();
                })
        })

        it('It SHOULD NOT SEND a message to the user with invalid token', done => {
            const id = '60459a53122c992a909cbc07';
            const message = { message: "This message is a test message." }
            chai.request(server)
                .post('/api/dms/' + id)
                .set('x-auth-token', token + 'a')
                .send(message)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    done();
                })
        })
    })

    /**
     * POST API routes
     * This route should send a message to a user
     */
    describe('dms DELETE API route tests...' , () => {

        /*
        it('It SHOULD DELETE direct message when id is valid', done => {
            // Direct msg id
            const id = '60459a53122c992a909cbc07';
            chai.request(server)
                .delete('/api/dms/' + id)
                .set('x-auth-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eq(true);
                    res.body.should.have.property('dm').be.a('object');
                    done();
                })
        })
        */

        it('It SHOULD NOT DELETE direct message when id is invalid', done => {
            // Direct msg id
            const id = '60459a53122c992a909cbc08';
            chai.request(server)
                .delete('/api/dms/' + id)
                .set('x-auth-token', token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    done();
                })
        })

        it('It SHOULD NOT DELETE direct message when token is invalid', done => {
            // Direct msg id
            const id = '60459a53122c992a909cbc08';
            chai.request(server)
                .delete('/api/dms/' + id)
                // .set('x-auth-token', token)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    done();
                })
        })
    })
})