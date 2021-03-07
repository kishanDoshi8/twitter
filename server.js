const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const auth = require('./routes/api/auth');
const tweets = require('./routes/api/tweets');

require("dotenv").config();

const app = express();

app.use(express.json());

// DB Configuratoin
const mongoURI = process.env.mongoURI;
mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/tweets', tweets);

const port = process.env.PORT || 3000;

// For testing -> running tests when server is running on the same port
// if(!module.parent) {
//     app.listen(port, () => console.log(`Server started on post: ${port}`));
// }

app.listen(port, () => console.log(`Server started on post: ${port}`));

module.exports = app;