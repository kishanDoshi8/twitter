const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require("dotenv").config('../../');

// User Model
const User = require('../../models/User');

// @route   POST /api/auth
// @desc    Auth user
// @access  Public
router.post('/' , (req, res) => {
    let { email, password } = req.body;

    // Validation
    if(!email || !password) return res.status(400).json({ success: false, msg: 'Please enter all fields' });

    let invalidErrorMsg = 'Invalid Credentials.';
    User.findOne({ email })
        .then(user => {
            if(!user) return res.status(401).json({ success: false, msg: invalidErrorMsg })

            // Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) return res.status(401).json({ success: false, msg: invalidErrorMsg })

                    let jwtSecret = process.env.myJwtSecret;
                    if(!jwtSecret) return res.status(500).json({ success: false, msg: 'Something went wrong. Please try again later.' })
                    jwt.sign(
                        { id : user._id },
                        jwtSecret,
                        // { expiresIn: 21600 },
                        (err, token) => {
                            res.status(200).json({ success: true, token, user })
                        }
                    )
                })
        })
})

module.exports = router;