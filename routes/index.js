const express = require("express");
const axios = require("axios");
const passport = require("passport");
const OpenAI = require("openai");
const marked = require("marked");
const router = express.Router();

const {
    ensureAuthenticated,
    ensureGuest,
} = require("../middleware/authMiddleware");

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:3000/",
});

// create open ai instance
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// @desc    login landing page
// @route   GET/
router.get("/", ensureGuest, (req, res) => {
    res.render("login", {
        layout: "login",
    });
});

/* router.post("/", (req, res) => {
    //console.log(req.body ? req.body : "no body found");
    // User login data
    const userData = {
        email: req.body.email,
        password: req.body.password,
    };
    //console.log(userData);
    // Make a POST request to the login route in "auth.js" using Axios
    axiosInstance.post("auth/login", userData);
});
 */

router.get("/goback", (req, res) => {
    res.redirect("back");
});

router.get("/logout", ensureAuthenticated, (req, res) => {
    console.log("logout called: ", req.session.cookie);
    console.log("\n==============================");

    console.log(`req.body.username -------> ${req.body.username}`);
    console.log(`req.body.password -------> ${req.body.password}`);

    console.log(`\n req.session.passport -------> `);
    console.log(req.session.passport);

    console.log(`\n req.user -------> `);
    console.log(req.user);

    console.log("\n Session and Cookie");
    console.log(`req.session.id -------> ${req.session.id}`);
    console.log(`req.session.cookie -------> `);
    console.log(req.session.cookie);

    console.log("===========================================\n");
    req.logOut(() => {
        res.redirect("/");
    });
});

// @desc    register account
// @route   GET/
router.get("/register", ensureGuest, (req, res) => {
    res.render("register", {
        layout: "login",
    });
});
// @desc    dashboard
// @route   GET/dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
    const user = req.user;
    const data = { username: user.email ? user.email : user.username };
    console.log(user, "user");
    res.render("dashboard", {
        layout: "main",
        data: data,
    });
});

router.get("/learn", ensureAuthenticated, (req, res) => {
    const user = req.user;
    const data = { username: user.email ? user.email : user.username };
    res.render("learn", {
        layout: "main",
        data: data,
    });
});

router.get("/learn/stream", ensureAuthenticated, async (req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Connection", "keep-alive");
    const question = req.query.question;
    const chunkList = [];

    res.flushHeaders(); // flush the headers to establish SSE with client

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "user",
                content: `${question} . answer should wrap every token`, //Answer must be in markdown format. Prioritize answering in list format with ol and ul tags for all numbered items.`, //Please answer in markdown format. Please make sure lists are properly formatted.`,
            },
        ],
        stream: true,
    });

    for await (const chunk of chatCompletion) {
        // const message = chunk.replace(/^data: /, "");
        //console.log(chunk.choices[0].delta.content);

        if (chunk.choices[0].finish_reason !== "stop") {
            console.log(chunk.choices);
            // if (chunk.choices[0].delta.content.match(/\n/)) {
            //    continue;
            // }
            //chunkList.push(chunk.choices[0].delta.content);
            // console.log(chunk.choices[0].delta.content);
            // if (chunk.choices[0].finish_reason !== "stop")
            // str += `${chunk.choices[0].delta.content}`;
        }

        if (chunk.choices[0].finish_reason === "stop") {
            // console.log("string i want:");
            //const str = chunkList.join("").replace(/\n+/g, "</br>");
            // console.log(str);

            res.write(`data: Stream has ended\n\n`);
            res.end();
            return;
        }
        res.write(`data: ${chunk.choices[0].delta.content}\n\n`);
    }
});

/* router.get("/learn/stream", ensureAuthenticated, async (req, res) => {
    // const user = req.user;
    // const data = { username: user.email ? user.email : user.username };

    const question = req.query.question;
    console.log("\n\n\nquestion they asked: ", question);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    // number of chunks to send back at at time
    const chunkSize = 20;
    const responseChunks = [];
    const sendChunks = () => {
        let dataStr = "";
        for (let i = 0; i < chunkSize; i++) {
            if (responseChunks.length > 0) {
                const chunk = responseChunks.shift();

                res.write(`data: ${chunk}\n\n}`);
                // console.log(chunk, "chunk");
            } else {
                // No more chunks to send
                //res.end();
                //return;
            }
        }
        //console.log(dataStr);
        // console.log(marked.parse(dataStr));
    };

    // Send the initial response header
    // Set response headers for Server-Sent Events

    //sendChunks();

    // ask chat gpt for the answer
    const ask = async () => {
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: `${question} and please make sure answer is in markdown friendly output and don't use h3 tags.`,
                },
            ],
            stream: true,
        });

        for await (const chunk of chatCompletion) {
            // res.write(`data: ${chunk.choices[0].delta.content}\n\n}`);
            if (chunk.choices[0].delta.content)
                responseChunks.push(chunk.choices[0].delta.content);
            if (responseChunks.length == chunkSize) sendChunks();
            //}
            // console.log(chunk);
        }
       
       console.log(chatCompletion);
        console.log(chatCompletion.choices[0].message);
        const markdown = marked.parse(
            chatCompletion.choices[0].message.content
        );

        const responseData = {
            response: markdown,
        };
        res.send(responseData); 
        //console.log(chatCompletion);
    };
    ask();
}); */

router.post(
    "/",
    passport.authenticate("local-login", {
        successRedirect: "/dashboard", // Redirect to the dashboard upon successful login
        failureRedirect: "/", // Redirect back to the login page if login fails
        failureFlash: true, // Enable flash messages for error handling
    })
);
router.post("/register", ensureGuest, (req, res) => {
    //console.log(req.body ? req.body : "no body found");
    // User registration data
    const userData = {
        email: req.body.email,
        password: req.body.password,
    };
    console.log(userData);
    // Make a POST request to the registration route in "auth.js" using Axios
    axiosInstance
        .post("auth/register", userData)
        .then((response) => {
            console.log("response for auth/register", response);
            if (response.status === 200) {
                // Registration was successful, you can redirect the user
                res.redirect("/dashboard");
            } else {
                // Registration failed, display an error message
                res.render("register", {
                    error: "Registration failed. Please try again.",
                });
            }
        })
        .catch((error) => {
            console.error("Registration error:", error);
            res.render("register", {
                error: "Registration failed. Please try again.",
            });
        });
});
// this needs to be the last route defined
// redirect all routes to home, anything that would 404 just goes back to home
router.all("*", (req, res, next) => {
    // allow google auth routes, but that's it
    if (
        req.url.substring(0, 20) === "/auth/google/callback" ||
        req.url.substring(0, 11) === "/auth/google"
    )
        res.redirect("/");
    else next();
});

module.exports = router;
