const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: { 
        type: String, 
        required: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' // This links the comment to the user who wrote it
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);