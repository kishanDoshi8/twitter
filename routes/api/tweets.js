const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// Tweet model
const Tweet = require('../../models/Tweet');

// @route   Get api/tweets 
// @Desc    Get all tweets
// @Access  Private
router.get('/', auth, (req, res) => {
    Tweet.find()
        .sort({ timestamp: -1})
        .then(tweets => res.status(200).json({ success: true, tweets }))
        .catch(err => res.status(500).json({ success: false, msg: err }))
});

// @route   Get api/tweets/:id
// @Desc    Get tweet by id
// @Access  Private
router.get('/:id', auth, (req, res) => {
    Tweet.findById(req.params.id)
        .then(tweet => {
            if(!tweet) return res.status(404).json({ success: false, msg: `Tweet with id: ${req.params.id} not found.`})
            res.status(200).json({ success: true, tweet })
        })
        .catch(err => res.status(404).json({ success: false, msg: err }))
});

// @route   Post api/tweets
// @Desc    Create a tweet
// @Access  Private
router.post('/', auth, (req, res) => {
    const newTweet = new Tweet( req.body );
    if(req.body.tweetBody.length > 280) return res.status(400).json({ success: false, msg: 'Tweet cannot have more than 280 characters.'})
    newTweet.save()
        .then(tweet => res.status(201).json({ success: true, tweet }))
        .catch(err => res.status(400).json({ success: false, msg: err.message }));
});

// @route   GET api/tweets/comments/:id
// @Desc    Get all comments of a post by id
// @Access  Private
router.post('/comments/:id', auth, (req, res) => {
    new Tweet.findById(req.params.id)
        .then(tweet => {
            if(!tweet) return res.status(404).json({ success: false, msg: 'No comments found.' })
            return res.status(200).json({success: true, comments: tweet.comments})
        })
        .catch(err => res.status(500).json({ success: false, msg: err }))
});

// @route   PSOT api/tweets/comments/:id
// @Desc    POST a comment to a post by id
// @Access  Private
router.post('/comments/:id', auth, (req, res) => {
    const comment = {
        userId: req.user.id,
        commentBody: req.body.comment,
    }

    new Tweet.findOneAndUpdate({ _id: req.params.id }, {
        $push: {
            comments: comment,
        }
    }).then(tweet => {
            return res.status(200).json({success: true, comments: tweet.comments})
        })
        .catch(err => res.status(404).json({ success: false, msg: err }))
});

// @route   Put api/tweets 
// @Desc    Update a tweet
// @Access  Private
router.put('/:id', auth, (req, res) => {
    Tweet.findOneAndUpdate({ _id: req.params.id },
        { $set: req.body }, 
        { new: true },
        (err, tweet) => {
            if(!tweet) return res.status(404).json({ success: false, msg: `Tweet with id: ${req.params.id} was not found.` });
            if(err) return res.status(400).json({ success: false, msg: err });
            res.json({ success: true, tweet });
    });
});

// @route   Delete api/tweets 
// @Desc    Delete a tweet
// @Access  Private
router.delete('/:id', auth, (req, res) => {
    Tweet.findById(req.params.id)
        .then(tweet => {
            tweet.remove().then(() => res.status(200).json({ success: true, tweet })).catch(err => res.status(500).json({ success: false, msg: err }))
        })
        .catch(err => res.status(404).json({ success: false, msg: `Tweet with id: ${req.params.id} was not found.` }));
});

module.exports = router;