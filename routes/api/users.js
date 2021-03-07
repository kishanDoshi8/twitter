const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// User Model
const User = require('../../models/User');


/*******
 * 
 *  ONLY FOR TESTING!
 * 
 */
// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get('/', (req, res) => {
    User.find()
        .select('-password')
        .then(users => res.json({ success: true, users }))
        .catch(err => res.json({ success: false, msg: err }));
})

// @route   POST /api/users
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
    let { name, email, password, confirmPassword } = req.body;

    // Validation
    if(!name || !email || !password || !confirmPassword) return res.status(400).json({ success: false, msg: 'Please enter all fields.' });
    
    // Email validation
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(regexEmail)) return res.status(400).json({ success: false, msg: 'Please enter a valid email address.'})

    User.findOne({ email })
        .then(user => {
            if(user) return res.status(400).json({ success: false, msg: 'User already exists.' })

            // Password validation
            if(password === confirmPassword) {
                // Password match
                // Check security level of password
                // 1. Length of 8 char
                if(password.length < 8) return res.status(400).json({ success: false, msg: 'Password should be of 8 Character minimum.' })
                // 2. Atleast 1 Upper case
                // 3. Atleast 1 lower case
                // 4. Atleasst 1 digit
                const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/
                if(regex.test(password)) {
                    // Password hashing
                    bcrypt.genSalt(10, (err, salt) => {
                        if(err) return res.status(500).json({ success: false, msg: err });
                        bcrypt.hash(password, salt, (err, hash) => {
                            if(err) return res.status(500).json({ success: false, msg: err });
                            // new password = hash;
                            let newUser = new User({ name, email, password: hash });
                            // Registering the user
                            newUser.save()
                                .then(user => res.status(201).json({ success: true, user}))
                                .catch(err => res.status(500).json({ success: false, msg: err }))
                        })
                    })
                } else {
                    // Password did not pass the security criteria
                    return res.status(400).json({ success: false, msg: 'Password should contain atleast 1 Uppercase, 1 Lowercase & 1 Number.'})
                }
            } else {
                // Password does not match
                return res.status(400).json({ success: false, msg: 'Password does not match.' })
            }
        })
        .catch(err => {
            console.error(err);
        })
    
})

module.exports = router;