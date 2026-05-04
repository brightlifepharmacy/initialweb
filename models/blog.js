const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        default: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop" 
    },
    content: { 
        type: String, 
        required: true 
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);