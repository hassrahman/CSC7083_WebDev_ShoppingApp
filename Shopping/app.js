require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const path = require("path");
const router = require("./routes/shoppingRoutes");


//create express ap 
const app = express();
//set view engine
app.set("view engine", "ejs");

//middleware
//morgan for logging HTTP requests
app.use(morgan("tiny"));

// serve static files (CSS, images) from the 'public' folder
//none yet, maybe add logo etc. 
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));


app.use(
  session({
    secret: "a-password-123", 
    resave: false,
    saveUninitialized: false,
  })
);

//mounting router
app.use("/", router);


const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log(`Shopping frontend listening on port ${PORT}`);
});