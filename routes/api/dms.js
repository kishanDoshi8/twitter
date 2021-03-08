const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// DirectMesssage model
const DirectMessage = require('../../models/DirectMessage');
// User model
const User = require('../../models/User');

// @route   Get api/dms/:id
// @Desc    Get direct message by id
// @Access  Private
router.get('/:id', auth, (req, res) => {
    // user id is injected by jwt token in the header
    const userId = req.user.id;
    const directedUser = req.params.id;
    
    // Find user and validate
    User.findById(directedUser)
        .then(user => {
            if(!user) return res.status(404).json({ success: false, msg: 'User not found.' })

            DirectMessage.find({ senderId: [userId, directedUser], recieverId: [userId, directedUser] })
            .sort({ timestamp: -1 })
            .then(dms => {
                    if(dms.length === 0) return res.status(404).json({ success: false, msg: `No message with this user.`})
                    return res.status(200).json({ success: true, dms })
                })
                .catch(err => res.status(404).json({ success: false, msg: err }))
        })
        .catch(err => res.status(500).json({ success: false, msg: err }))
    });

// @route   Post api/dms 
// @Desc    Send a Direct message
// @Access  Private
router.post('/:id', auth, (req, res) => {

    // Check if :id is valid
    User.findById(req.params.id)
        .then(user => {
            if(!user) return res.status(404).json({ success: false, msg: 'User not found.' })

            // user id is injected by jwt token in the header
            const dm = {
                senderId: req.user.id,
                recieverId: req.params.id,
                message: req.body.message
            }
            const newDM = new DirectMessage(dm);
            newDM.save()
                .then(dm => res.status(201).json({ success: true, dm }))
                .catch(err => res.status(400).json({ success: false, msg: err.message }));
        })
        .catch(err => res.status(500).json({ success: false, msg: err }))
});

// @route   Delete api/dms 
// @Desc    Delete a direct message
// @Access  Private
router.delete('/:id', auth, (req, res) => {
    DirectMessage.findById(req.params.id)
        .then(dm => {
            dm.remove().then(() => res.status(200).json({ success: true, dm })).catch(err => res.status(500).json({ success: false, msg: err }))
        })
        .catch(err => res.status(404).json({ success: false, msg: `Direct message not found.` }));
});

module.exports = router;