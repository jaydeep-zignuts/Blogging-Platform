const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp')

const blogSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    slug: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    // publish_date: { type: Date, required: true },
    
    blogImage: { type: String, required: true },
    
},
{
    timestamps : true
}

);

module.exports = mongoose.model("Blog", blogSchema);