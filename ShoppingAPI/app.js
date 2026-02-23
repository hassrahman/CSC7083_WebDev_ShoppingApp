const dotenv = require("dotenv").config({ path: "./.env" });
//require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
//const router = require('./routes/scheduleroutes');


//import the router files
const userRoutes = require("./routes/userRoutes");
const listRoutes = require("./routes/listRoutes");
const itemRoutes = require("./routes/itemRoutes");
const statsRoutes = require("./routes/statsRoutes");

//creates express app
const app = express();

//adding middleware-
//morgan for logging HTTP requests to the console
app.use(morgan("tiny"));
//Middleware to parse URL-encoded bodies sebnt by html forms
app.use(express.urlencoded({ extended: true }));
//middleware to parse JSON
app.use(express.json());

//mounting routers
app.use("/users", userRoutes);
app.use("/lists", listRoutes);
app.use("/items", itemRoutes);
app.use("/stats", statsRoutes);


//get the port from the environment variable, or default to 3002 to fix the problem connecting that i'm having
const PORT = process.env.PORT || 3002;
//start the server and listen on the specified port
app.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log(`ShoppingAPI listening on port ${PORT}`);
});