const e = require("express");
const { MongoDBCollectionNamespace, ObjectId } = require("mongodb");
const mongoose = require("mongoose");

// Primary post model, used as-is for main posts, used as-component for replies
const post = new mongoose.Schema({
    parent: {
        type: ObjectId,
        default: null,
    },
    creator: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        default: undefined,
    },
});

// _id is an inherent unique indentifier in mongoDB

forum_post = mongoose.model("Post", post);

const getNumPosts = async (num) => {
    return await forum_post.find({parent: null || undefined}).limit(num).lean();
}

const getNumReplies = async (num, p_id) => {
    var ObjectId = mongoose.Types.ObjectId;
    return await forum_post.find({parent: new ObjectId(p_id)}).limit(num).lean();
}


const createNewPost = async (text, id) => {
    console.log(id, text);
    const newPost = new forum_post({
        creator: id,
        content: text,
    });
    await newPost.save();
}


const replyToPost = async (text, u_id, p_id) => {
    console.log("Generating a new reply...");
    console.log(u_id, text, p_id);
    var ObjectId = mongoose.Types.ObjectId;
    const newPost = new forum_post({
        parent: new ObjectId(p_id),
        creator: u_id,
        content: text,
    });
    console.log("Saving a new reply:", newPost);
    await newPost.save();
}

module.exports.getNumPosts = getNumPosts;
module.exports.getNumReplies = getNumReplies;
module.exports.createNewPost = createNewPost;
module.exports.replyToPost = replyToPost;
