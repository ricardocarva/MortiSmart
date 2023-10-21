// bring in dependencies
const path = require("path");
const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const flash = require("express-flash");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");

const { MongoClient, ServerApiVersion } = require("mongodb");
const { ensureAuthenticated } = require("./middleware/authMiddleware");

// load config
dotenv.config({ path: "./config/config.env" });

// passport config
require("./config/passport")(passport);

// connect the database
connectDB();

// init app
const app = express();

// init morgan for logging in dev mode only
if (process.env.NODE_ENV === "development") {
    // register morgan middleware with app
    app.use(morgan("dev"));
}

// handlebars for templating
app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// session
app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 3600000 }, //1 hour
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// passport and middleware
app.use(passport.initialize());
app.use(passport.session());

//app.use(ensureAuthenticated);

// enable flash messages
app.use(flash());

// static folder set to public
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

// listen for incoming requests on specified port
const PORT = process.env.PORT || 3000;
app.listen(
    PORT,
    console.log(
        `Server is running in ${[process.env.NODE_ENV]} on port ${PORT}`
    )
);
