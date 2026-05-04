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
const dummyProducts = require("./utils/dummyProducts.js");
const filterProducts = require("./utils/filterProducts.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const crypto = require("crypto");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Strategy: LocalStrategy } = require("passport-local");
const User = require("./models/user.js");

const homeRouter = require("./routes/home.js");
const userRouter = require("./routes/user.js");
const resetRout = require("./routes/authRoutes.js");
const productsRouter = require("./routes/products.js");

const dbUrl = process.env.ATLUSDB_URL || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/initialweb";

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
  secret: process.env.SECRET || "initialweb-local-secret",
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

app.get("/", async (req, res, next) => {
  const products = filterProducts(dummyProducts, req.query).slice(0, 4);
  res.render("brightlife/home.ejs", {
    products,
    selectedCategory: req.query.category || "all",
    selectedPrice: req.query.price || "all",
  });
});

app.get("/product/:id", (req, res) => {
  const product = dummyProducts.find(
    (item) => String(item.id) === req.params.id,
  );

  if (!product) {
    req.flash("error", "Product not found");
    return res.redirect("/products");
  }

  res.render("products/product-details", { product });
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Logged in using Google!");
    res.redirect("/");
  },
);

app.use("/", userRouter);
app.use("/", homeRouter);
app.use("/products", productsRouter);
app.use("/", resetRout);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // agar response already sent ho, dobara send mat karo
  }
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message, statusCode });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`BrightLife is working at ${port}`);
});
