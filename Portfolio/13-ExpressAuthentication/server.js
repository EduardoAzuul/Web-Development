require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");



const mongoUrl = "mongodb://127.0.0.1:27017/13Autentication";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

// Definition of a schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  googleId: String
});

const User = mongoose.model("User", userSchema);

userSchema.set("strictQuery", true);


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

/************* Data Base connection *************** */

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// ****************** Session and Passport Configuration *********************


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const GoogleStrategy = require("passport-google-oauth20").Strategy;

console.log("ENV CHECK:", {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  SESSION_SECRET: process.env.SESSION_SECRET
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {

    // Find or create user in DB
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) return done(null, existingUser);

    const newUser = new User({
      googleId: profile.id,
      username: profile.displayName,
      email: profile.emails?.[0]?.value 
    });

    await newUser.save();
    done(null, newUser);
  }
));



passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});


//=============================================================
//****************************ROUTES *********************** */
//=============================================================

app.get("/", (req, res) => {
  res.render(__dirname + "/public/html/index.ejs");
});

function requireLogin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.get("/secret", requireLogin, (req, res) => {
  res.render(__dirname + "/public/html/secret.ejs");
});

app.get("/register", (req, res) => {
  res.render(__dirname + "/public/html/register.ejs");
});


const bcrypt = require("bcrypt"); // For hashing passwords

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  console.log("📝 Registration data received:", req.body);

  // 1. Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 2. Save the user
  const newUser = new User({
    username,
    email,
    password: hashedPassword
  });

  await newUser.save();

  console.log("🆕 New user saved:", newUser);

  res.redirect("/secret");
});

// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
  
//   console.log("Login attempt:", req.body)
//   const foundUser = await User.findOne({ username })
//   if (foundUser) {
//     const match = await bcrypt.compare(password, foundUser.password)
//     if (match) {
//       console.log("Login successful for user:", username);
//       res.redirect("/secret");
//     } else {
//       console.log("Incorrect password for user:", username);
//       res.send("Incorrect password.");
//       redirect("/");
//     }
//   } else {
//     console.log("User not found:", username);
//     res.send("User not found.");
//     redirect("/");
//   }
// });

// app.post("/login", passport.authenticate("local", {
//   successRedirect: "/secret",
//   failureRedirect: "/"
// }));


app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});



// Google OAuth routes
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/secret");
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});