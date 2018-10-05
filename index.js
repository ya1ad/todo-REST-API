const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const express_session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const todoRoutes = require("./routes/todos");
const authRouters = require("./routes/auth");
const { userModel } = require("./model/user");
const app = express();
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  express_session({
    secret: "lotoftodos",
    saveUninitialized: true,
    resave: false
  })
);

// passport config

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(userId, done) {
  userModel.findById(userId, (err, user) => done(err, user));
});
const local = new LocalStrategy((username, password, done) => {
  userModel
    .findOne({ username })
    .then(user => {
      if (!user || !user.validPassword(password)) {
        done(null, false, { message: "Invalid username/password" });
      } else {
        done(null, user);
      }
    })
    .catch(e => done(e));
});

passport.use("local", local);
app.use(express.json());
app.use("/api/todo", todoRoutes);
app.use("/auth", authRouters(passport));
app.get("/", (req, res) => {
  res.render("index");
});

/**
 * Database
 */
mongoose.set("useCreateIndex", true);
mongoose
  .connect(
    "mongodb://dbtask:dbtask1234@ds115353.mlab.com:15353/todonode",
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected!!"))
  .catch(err => console.log("Error-----------", err));

/**
 * PORT
 */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
