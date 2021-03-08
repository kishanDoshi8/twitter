const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

// Create commect schema
const CommentSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    commentBody: {
        type: String,
        required: true,
        validate: {
            validator: body => {
                return body.length <= 280;
            },
            message: () => `Comment should not exceed of length 280`,
        }
    },
    // save userId as liked
    likes: [String],
    comments: [{
        type: ObjectID,
        ref: 'CommentSchema',
    }],
    tags: [String],
    retweet: [String],
}, {
    timestamps: true,
})

// Create User Schema
const TweetSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    tweetBody: {
        type: String,
        required: true,
        validate: {
            validator: body => {
                return body.length <= 280;
            },
            message: () => `Tweet should not exceed of length 280`,
        }
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: [CommentSchema],
    tags: [String],
    // Save user Ids
    retweets: [String],
}, {
    timestamps: true,
});

module.exports = Tweet = mongoose.model('tweet', TweetSchema);