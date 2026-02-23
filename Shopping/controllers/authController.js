const axios = require("axios");

//Renders the page with the registration form 
exports.getRegisterPage = (req, res) => {
  res.render("register", { error: null });
};

//Handles new user registration 
exports.postRegister = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    const endpoint = `http://localhost:3002/users/register`;
    await axios.post(endpoint, { fullName, username, email, password });
    res.redirect("/login?status=registered");
  } catch (error) {
    res.render("register", { error: error.response.data.message });
  }
};

//Renders the login page 
exports.getLoginPage = (req, res) => {
  res.render("login", { status: req.query.status, error: null });
};

//Handles user login 
exports.postLogin = async (req, res) => {
  try {
    const { username, userpass } = req.body;
    const endpoint = `http://localhost:3002/users/login`;
    const response = await axios.post(endpoint, { username, password: userpass });

    req.session.isloggedin = true;
    req.session.userid = response.data.userId;
    req.session.name = username;
    
    req.session.save(err => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).send("Error saving session.");
      }
      res.redirect("/");
    });
  } catch (error) {
    res.render("login", { status: null, error: error.response.data.message });
  }
};

//Handles user logout 
exports.getLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};