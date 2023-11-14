const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureGuest, } = require("../middleware/authMiddleware");


// @desc    connect
// @route   GET/connect
router.get("/", ensureAuthenticated, (req, res) => {
    const user = req.user;
    const data = { username: user.email ? user.email : user.username };
    console.log(user, "user");

    // Need to query for forum posts
    const {getNumPosts} = require("../public/scripts/forum");
    
    const arrForum = getNumPosts(10);
    arrForum.then((posts) => {
        console.log("Resolved?", posts);
        res.render("connect", {
            layout: "main",
            data: data,
            forumpost: posts,
        });
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

module.exports = router;