let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

chai.use(chaiHttp);
chai.should();

describe('Tweets API Tests...', () => {

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDUyODAzZWJhMmFiM2U2NGJmODU5YyIsImlhdCI6MTYxNTE2NTUyOH0.3-wnM0Pnna9dhJK8hkZZ6p7vMRdy4sgdUEg4hriYU3I';

    /**
     * GET /api/tweets
     */
    describe('GET api route tests', () => {

        it('It should GET all tweets successfully', done => {
            chai.request(server)
                .get('/api/tweets')
                .set('x-auth-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eq(true);
                    res.body.should.have.property('tweets').be.a('array');
                    done();
                })
        })

        it('It should GET a tweet by id successfully', done => {
            const id = '60456cea3d79f90b50cfddfa';
            chai.request(server)
                .get('/api/tweets/' + id)
                .set('x-auth-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('success').eq(true);
                    res.body.should.have.property('tweet').be.a('object');
                    res.body.tweet.should.have.property('userId');
                    res.body.tweet.should.have.property('tweetBody');
                    done();
                })
        })

        it('It should NOT GET a tweet with invalid id param', done => {
            const id = '60455b92851a2c265cad8d54';
            chai.request(server)
                .get('/api/tweets/' + id)
                .set('x-auth-token', token)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    done();
                })
        })

        it('It should NOT GET a tweet with invalid token', done => {
            const id = '60455b92851a2c265cad8d54';
            chai.request(server)
                .get('/api/tweets/' + id)
                .set('x-auth-token', token + 'a')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    done();
                })
        })

        it('It should NOT GET a tweet without a token', done => {
            const id = '60455b92851a2c265cad8d54';
            chai.request(server)
                .get('/api/tweets/' + id)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('msg');
                    done();
                })
        })
    })

    /**
     * POST /api/tweets
     */
    describe('POST API routes tests...', () => {

        /*
        it('It SHOULD POST a tweet with a valid userId and body', done => {
            const newTweet = {
                userId: '60452803eba2ab3e64bf859c',
                tweetBody: 'I gotta feeling... that tonights gonna be a good night..',
            }
            chai.request(server)
            .post('/api/tweets')
            .set('x-auth-token', token)
            .send(newTweet)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('success').eq(true);
                res.body.should.have.property('tweet').be.a('object');
                res.body.tweet.should.have.property('userId');
                res.body.tweet.should.have.property('tweetBody');
                res.body.tweet.should.have.property('timestamp');
                done();
            })
        })
        */

        it('It SHOULD NOT POST a tweet with an invalid userId', done => {
            const newTweet = {
                userId: '60452803eba2ab3e64bf8asd3ac',
                tweetBody: 'I gotta feeling... that tonights gonna be a good night..',
            }
            chai.request(server)
            .post('/api/tweets')
            .set('x-auth-token', token)
            .send(newTweet)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('msg');
                done();
            })
        })

        it('It SHOULD NOT POST a tweet with tweetBody with more than 280 chars', done => {
            const newTweet = {
                userId: '60456cea3d79f90b50cfddfa',
                // tweetBody with length 281
                tweetBody: 'Lorem ipsum dolor sit amet, aconsectetur adipiscing elit. Pellentesque pharetra nulla in sem finibus pharetra. Nulla dignissim vestibulum est, eget tincidunt sapien suscipit sed. Proin vel nulla malesuada, pellentesque eros id, lobortis ligula. Nam semper neque in posuere vivamus.',
            }
            chai.request(server)
            .post('/api/tweets')
            .set('x-auth-token', token)
            .send(newTweet)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('msg');
                done();
            })
        })

        it('It SHOULD NOT POST a tweet without a valid token', done => {
            const newTweet = {
                userId: '60456cea3d79f90b50cfddfa',
                tweetBody: 'Lorem ipsum dolor sit amet, vivamus.',
            }
            chai.request(server)
            .post('/api/tweets')
            .set('x-auth-token', token + 'a')
            .send(newTweet)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('msg');
                done();
            })
        })

        it('It SHOULD NOT POST a tweet without a token', done => {
            const newTweet = {
                userId: '60456cea3d79f90b50cfddfa',
                tweetBody: 'Lorem ipsum dolor sit amet, vivamus.',
            }
            chai.request(server)
            .post('/api/tweets')
            .send(newTweet)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('msg');
                done();
            })
        })
    })

    /**
     * PUT /api/tweets
     */
    describe('PUT API routes tests...', () => {
        it('It SHOULD UPDATE the tweet with existing tweet', done => {
            const id = '60456cea3d79f90b50cfddfa'
            const tweetToUpdate = {
                likes: 2,
            }
            chai.request(server)
            .put('/api/tweets/' + id)
            .set('x-auth-token', token)
            .send(tweetToUpdate)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success').eq(true);
                res.body.should.have.property('tweet');
                res.body.tweet.should.have.property('userId');
                res.body.tweet.should.have.property('tweetBody');
                res.body.tweet.should.have.property('likes').eq(2);
                done();
            })
        })

        it('It SHOULD NOT UPDATE the tweet with invalid tweet._id', done => {
            const id = '604566d7bb61d821184b5043'
            const tweetToUpdate = {
                likes: 2,
            }
            chai.request(server)
            .put('/api/tweets/' + id)
            .set('x-auth-token', token)
            .send(tweetToUpdate)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('msg');
                done();
            })
        })

        it('It SHOULD NOT UPDATE the tweet with invalid token', done => {
            const id = '604566d7bb61d821184b5043'
            const tweetToUpdate = {
                likes: 2,
            }
            chai.request(server)
            .put('/api/tweets/' + id)
            .set('x-auth-token', token + 'a')
            .send(tweetToUpdate)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('msg');
                done();
            })
        })

        it('It SHOULD NOT UPDATE the tweet without a token', done => {
            const id = '604566d7bb61d821184b5043'
            const tweetToUpdate = {
                likes: 2,
            }
            chai.request(server)
            .put('/api/tweets/' + id)
            .send(tweetToUpdate)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('msg');
                done();
            })
        })
    })


    /**
     * DELETE /api/tweets
     */
    describe('DELETE API routes tests...', () => {
        /*
        it('It SHOULD DELETE the tweet with valid tweet._id', done => {
            const id = '604566d7bb61d821184b5044';
            chai.request(server)
            .set('x-auth-token', token)
            .delete('/api/tweets/' + id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success').eq(true);
                res.body.should.have.property('tweet');
                res.body.tweet.should.have.property('userId');
                res.body.tweet.should.have.property('tweetBody');
                done();
            })
        })
        */

        it('It SHOULD NOT DELETE the tweet with invalid tweet._id', done => {
            const id = '604566d7bb61d821184b5043'
            chai.request(server)
            .delete('/api/tweets/' + id)
            .set('x-auth-token', token)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('msg');
                done();
            })
        })

        it('It SHOULD NOT DELETE the tweet with invalid token', done => {
            const id = '604566d7bb61d821184b5043'
            chai.request(server)
            .delete('/api/tweets/' + id)
            .set('x-auth-token', token + 'a')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('msg');
                done();
            })
        })

        it('It SHOULD NOT DELETE the tweet without a token', done => {
            const id = '604566d7bb61d821184b5043'
            chai.request(server)
            .delete('/api/tweets/' + id)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('success').eq(false);
                res.body.should.have.property('msg');
                done();
            })
        })
    })
})