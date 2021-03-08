const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;

// Create User Schema
const TweetSchema = new Schema({
    userId: {
        type: String,
        validate: {
            // Check if this is a valid objectId
            validator: function (user) {
                return user == new ObjectID(user);
            },
            message: props => `${props.value} is not a valid userId`,
        },
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
    comments: [{
        userId: {
            type: String,
            validate: [
                // Check if this is a valid objectId
                function (user) {
                    console.log(user);
                    console.log(new ObjectID(user));
                    return user == new ObjectID(user);
                },
                props => `${props.value} is not a valid userId`,
            ],
            required: true,
        },
        commentBody: {
            type: String,
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        }
    }],
    tags: [String],
    // Save user Ids
    retweets: [{
        type: String,
        validate: {
            // Check if this is a valid objectId
            validator: function (user) {
                return user == new ObjectID(user);
            },
            message: props => `${props.value} is not a valid userId`,
        },
    }],
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Tweet = mongoose.model('tweet', TweetSchema);