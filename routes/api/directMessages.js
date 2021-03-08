const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// DirectMessage model
const DirectMessage = require('../../models/DirectMessage');


// @route   Get api/directMessages/:id
// @Desc    Get directMessage by id (where id is userId of opponent)
// @Access  Private
router.get('/:id', auth, (req, res) => {
    DirectMessage.findById(req.params.id)
        .then(directMessage => {
            if(!directMessage) return res.status(404).json({ success: false, msg: `DirectMessage with id: ${req.params.id} not found.`})
            res.status(200).json({ success: true, directMessage })
        })
        .catch(err => res.status(404).json({ success: false, msg: err }))
});

// @route   Post api/directMessage 
// @Desc    Create a directMessage
// @Access  Private
router.post('/', auth, (req, res) => {
    const newTweet = new DirectMessage( req.body );
    // if(req.body.tweetBody.length > 280) return res.status(400).json({ success: false, msg: 'DirectMessage cannot have more than 280 characters.'})
    newTweet.save()
        .then(directMessage => res.status(201).json({ success: true, directMessage }))
        .catch(err => res.status(400).json({ success: false, msg: err.message }));
});

// @route   Put api/directMessages 
// @Desc    Update a directMessage
// @Access  Private
router.put('/:id', auth, (req, res) => {
    DirectMessage.findOneAndUpdate({ _id: req.params.id },
        { $set: req.body }, 
        { new: true },
        (err, directMessage) => {
            if(!directMessage) return res.status(404).json({ success: false, msg: `DirectMessage with id: ${req.params.id} was not found.` });
            if(err) return res.status(400).json({ success: false, msg: err });
            res.json({ success: true, directMessage });
    });
});

// @route   Delete api/directMessages 
// @Desc    Delete a directMessage
// @Access  Private
router.delete('/:id', auth, (req, res) => {
    DirectMessage.findById(req.params.id)
        .then(directMessage => {
            directMessage.remove().then(() => res.status(200).json({ success: true, directMessage })).catch(err => res.status(500).json({ success: false, msg: err }))
        })
        .catch(err => res.status(404).json({ success: false, msg: `DirectMessage with id: ${req.params.id} was not found.` }));
});

module.exports = router;