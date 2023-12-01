const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureGuest, } = require("../middleware/authMiddleware");


// @desc    connect
// @route   GET/connect
router.get("/", ensureAuthenticated, async (req, res) => {
    const user = req.user;
    const data = { username: user.email ? user.email : user.username };
    console.log(user, "user");

    // Need to query for forum posts
    const {getNumPosts, getNumReplies} = require("../public/scripts/forum");
    
    const arrForum = await getNumPosts(10);
    for (const post in arrForum) {
        arrForum[post].replies = [];
        const repliesArr = await getNumReplies(10, arrForum[post]._id.valueOf());
        for (const reply in repliesArr) {
            arrForum[post].replies.push(repliesArr[reply]);
        }
    }
    console.log("Resolved?", arrForum);
    res.render("connect", {
        layout: "main",
        data: data,
        forumpost: arrForum,
    });
});

router.post("/create", ensureAuthenticated, (req, res) => {
    if (ensureAuthenticated) {
        const user = req.user;
        const data = { username: user.email ? user.email : user.username };
        const {createNewPost} = require("../public/scripts/forum");
        createNewPost(req.body.thread, data.username);
        res.redirect("/");
    }
});


router.post("/reply", ensureAuthenticated, (req, res) => {
    if (ensureAuthenticated) {
        const user = req.user;
        const data = { username: user.email ? user.email : user.username };
        const {replyToPost} = require("../public/scripts/forum");
        replyToPost(req.body.thread, data.username, req.body.parent);
        res.redirect("/");
    }
});

module.exports = router;