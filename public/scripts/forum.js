const { MongoDBCollectionNamespace } = require("mongodb");
const mongoose = require("mongoose");

// Define forum models
const post = new mongoose.Schema({
    creator: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        unique: true,
    },
    content: {
        type: String,
        default: undefined,
    },
});
post.methods.getCreator = () => { return creator; }
post.methods.getDate = () => { return createdAt; }
post.methods.getContent = () => { return content; }

forum_post = mongoose.model("Post", post);

const getNumPosts = async (num) => {
    const posts = await forum_post.find({}).limit(num);
    return posts;
}


const createNewPost = async (text, id) => {
    console.log(id, text);
    const newPost = new forum_post({
        creator: id,
        content: text,
    });
    await newPost.save();
}




module.exports.getNumPosts = getNumPosts;
module.exports.createNewPost = createNewPost;
