if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const crypto = require("crypto");
const contactRouter = require("./routes/contactRoutes.js");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Strategy: LocalStrategy } = require("passport-local");
const User = require("./models/user.js");
const blogRouter = require("./routes/blogRoutes.js");

const homeRouter = require("./routes/home.js");
const userRouter = require("./routes/user.js");
const authRouter = require("./routes/authRoutes.js");
const productsRouter = require("./routes/products.js");

const dbUrl = process.env.ATLUSDB_URL || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/brightlifepharmacy";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("DB connection skipped or failed:", err.message);
  });

async function main() {
  try {
    await mongoose.connect(dbUrl);
  } catch (err) {
    if (process.env.ATLUSDB_URL || process.env.MONGODB_URI) {
      throw err;
    }
  }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Fallback placeholder for missing image.png requests
app.get('/image.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'image.png'));
});

const hasMongoSessionStore = Boolean(process.env.ATLUSDB_URL || process.env.MONGODB_URI);
const store = hasMongoSessionStore
  ? MongoStore.create({
      mongoUrl: dbUrl,
      touchAfter: 24 * 60 * 60,
    })
  : undefined;

if (store) {
  store.on("error", (err) => {
    console.log("error in mongo session store", err);
  });
}

const sessionOptions = {
  store,
  secret: process.env.SECRET || "brightlifepharmacy-local-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.set("trust proxy", 1);

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate()),
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.DOMAIN + "/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         let email = profile.emails[0].value;
//         let name = profile.displayName;

//         // Check existing user
//         let existingUser = await User.findOne({ email });

//         if (existingUser) {
//           return done(null, existingUser);
//         }

//         // Create new user
//         let newUser = new User({
//           name,
//           email,
//           googleId: profile.id,
//           isVerified: true,
//         });

//         await newUser.save();
//         return done(null, newUser);
//       } catch (err) {
//         return done(err, null);
//       }
//     },
//   ),
// );

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  res.locals.currentPath = req.path;
  res.locals.cartCount = 2;
  next();
});

app.use("/", homeRouter);
app.use("/products", productsRouter);
app.use("/blogs", blogRouter);
app.use("/", userRouter);
app.use("/", authRouter);
app.use("/", contactRouter);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message, statusCode });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`BrightLife Server is listening on port ${PORT}`);
});
