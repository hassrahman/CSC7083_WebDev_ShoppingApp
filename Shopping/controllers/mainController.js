const axios = require("axios");

//Renders the welcome page or the user dashboard 
exports.getHomePage = async (req, res) => {
  try {
    if (!req.session.isloggedin) {
      return res.render("welcome");
    }
    const userId = req.session.userid;
    const endpoint = `http://localhost:3002/lists/user/${userId}`;
    const response = await axios.get(endpoint);
    res.render("index", { lists: response.data.result, user: req.session.name });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send("Error fetching data.");
  }
};

//Renders the analytics page 
exports.getAnalyticsPage = async (req, res) => {
    try {
        if (!req.session.isloggedin) {
            return res.redirect("/login");
        }
        const userId = req.session.userid;
        const endpoint = `http://localhost:3002/stats/${userId}`;
        const response = await axios.get(endpoint);
        res.render("analytics", { stats: response.data.result, user: req.session.name });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).send("Error fetching analytics.");
    }
};