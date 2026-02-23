//import the database connection and bcrypt library
const conn = require("./../utils/dbconn");
const bcrypt = require("bcrypt");

//user reg
exports.registerUser = async (req, res) => {
  try {
    //https://stackoverflow.com/questions/40076638/compare-passwords-bcryptjs 
    //https://www.freecodecamp.org/news/how-to-hash-passwords-with-bcrypt-in-nodejs/
    
    //get user data from the incoming request body
    const { fullName, username, email, password } = req.body;
    //hash the password with a cost factor of 10 for security
     //using await to signal time consuming function; bcrypt by design is supposed to be time consuming to make it expensive for hackers using brute force methods
    const hashedPassword = await bcrypt.hash(password, 10);
    //prep the SQL query to insert the new user
    const insertSQL = "INSERT INTO users (full_name, username, email, password) VALUES (?, ?, ?, ?)";
    //prep  array of values, using the hashed password
    const values = [fullName, username, email, hashedPassword];
    const [result] = await conn.execute(insertSQL, values);
    //send a success response with the new users ID
    res.status(201).json({
      status: "success",
      message: `User '${username}' registered successfully.`,
      userId: result.insertId,
    });
  } catch (error) {
    //catch specific dupe entry errors from the database
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ status: "failure", message: "Username or email already exists." });
    }
    //catch any other errors
    res.status(500).json({ status: "failure", message: error.message });
  }
};

//login
exports.loginUser = async (req, res) => {
  try {
    //Get username and password from the request body
    const { username, password } = req.body;
    //prep  SQL to find the user by their unique username
    const findUserSQL = "SELECT * FROM users WHERE username = ?";
    const [rows] = await conn.execute(findUserSQL, [username]);

    //check if user was found AND if they have a password stored
    if (rows.length === 0 || !rows[0].password) {
      return res.status(401).json({ status: "failure", message: "Invalid credentials" });
    }

    //get the full user object from the result
    const user = rows[0];
    //compare the submitted password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      //If passwords match, send a success response
      res.status(200).json({ status: "success", message: "Login successful.", userId: user.id });
    } else {
      //iff no match, send an error
      res.status(401).json({ status: "failure", message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ status: "failure", message: "An internal server error occurred." });
  }
};