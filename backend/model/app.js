const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var ObjectId = require('mongodb').ObjectID;
const blogsSchema = mongoose.Schema({
    postHead: { type: String, required: true },
    postContent: {type: String, required: true},
    publishDate: {type: Date, required: true, default: Date.now()},
    postImage: {type: String},
    categories: {type: String},
    createdBy: {type: String},
    likes: { type: Number, default: 0 },
    likedBy: { type: Array },
    dislikes: { type: Number, default: 0 },
    dislikedBy: { type: Array },
    comments: [{
        comment: { type: String },
        commentator: { type: String },
        email: { type: String },
        userImage: {type: String},
        commentDate: {
            type: Date,
            default: Date.now()
        },
        replies: [{
            name: { type: String },
            reply: { type: String },
            emailId: { type: String },
            replayDate: {
                type: Date,
                default: Date.now()
            },
        }]
    }]
})
const Blog = module.exports = mongoose.model('Blog', blogsSchema);
