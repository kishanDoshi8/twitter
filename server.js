const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');

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

app.use('/api/users', users)

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on post: ${port}`));