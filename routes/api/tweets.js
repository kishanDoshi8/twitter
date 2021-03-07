const express = require('express');
const router = express.Router();

// Tweet model
const Tweet = require('../../models/Tweet');

// @route   Get api/tweets 
// @Desc    Get all tweets
// @Access  Public
router.get('/', (req, res) => {
    Tweet.find()
        .sort({ timestamp: -1})
        .then(tweets => res.status(200).json({ success: true, tweets }))
        .catch(err => res.status(500).json({ success: false, msg: err }))
});

// @route   Get api/tweets/:id
// @Desc    Get tweet by id
// @Access  Public
router.get('/:id', (req, res) => {
    Tweet.findById(req.params.id)
        .then(tweet => {
            if(!tweet) return res.status(404).json({ success: false, msg: `Tweet with id: ${req.params.id} not found.`})
            res.status(200).json({ success: true, tweet })
        })
        .catch(err => res.status(404).json({ success: false, msg: err }))
});

// @route   Post api/tweet 
// @Desc    Create a tweet
// @Access  Public
router.post('/', (req, res) => {
    const newTweet = new Tweet( req.body );
    newTweet.save()
        .then(tweet => res.status(201).json({ success: true, tweet }))
        .catch(err => res.status(400).json({ success: false, msg: err }));
});

// @route   Put api/tweets 
// @Desc    Update a tweet
// @Access  Public
router.put('/:id', (req, res) => {
    Tweet.findOneAndUpdate({ _id: req.params.id },
        { $set: req.body }, 
        { new: true },
        (err, tweet) => {
            if(err) return res.status(400).json({ success: false, msg: err });
            if(!tweet) return res.status(404).json({ success: false, msg: `Tweet with id: ${req.params.id} was not found.` });
            res.json({ success: true, tweet });
    });
});

// @route   Delete api/tweets 
// @Desc    Delete a tweet
// @Access  Public
router.delete('/:id', (req, res) => {
    Tweet.findById(req.params.id)
        .then(tweet => {
            tweet.remove().then(() => res.status(200).json({ success: true, tweet })).catch(err => res.status(500).json({ success: false, msg: err }))
        })
        .catch(err => res.status(404).json({ success: false, msg: `Tweet with id: ${req.params.id} was not found.` }));
});

module.exports = router;