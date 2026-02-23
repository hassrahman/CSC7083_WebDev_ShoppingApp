const axios = require("axios");

//Renders the page to create a new list 
exports.getNewListPage = (req, res) => {
  if (!req.session.isloggedin) {
            return res.redirect("/login");
        }
  res.render("newList", { user: req.session.name });
};

//Handles creating a new list 
exports.postNewList = async (req, res) => {
  try {
    if (!req.session.isloggedin) {
            return res.redirect("/login");
        }

    const { listName, description, targetShop } = req.body;
    const dataToSend = { listName, description, targetShop, userId: req.session.userid };
    const endpoint = `http://localhost:3002/lists`;
    await axios.post(endpoint, dataToSend);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error creating list.");
  }
};

//Renders the page to edit a list 
exports.getEditListPage = async (req, res) => {
  if (!req.session.isloggedin) {
            return res.redirect("/login");
        }

    console.log("Sorting parameters received:", req.query); 

  try {
    const listId = req.params.id;
    const endpoint = `http://localhost:3002/lists/${listId}`;
    const response = await axios.get(endpoint);
    res.render("editList", { list: response.data.result[0], error: req.query.error, user: req.session.name });
  } catch (error) {
    res.status(500).send("Error fetching list details.");
  }
};

//Handles updating a list 
exports.postUpdateList = async (req, res) => {
  try {
    if (!req.session.isloggedin) {
            return res.redirect("/login");
        }

    const listId = req.params.id;
    const { listName, description, targetShop } = req.body;
    const endpoint = `http://localhost:3002/lists/${listId}`;
    await axios.put(endpoint, { listName, description, targetShop });
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error updating list.");
  }
};

//Handles deleting a list 
exports.postDeleteList = async (req, res) => {
    try {
if (!req.session.isloggedin) {
            return res.redirect("/login");
        }

        const listId = req.params.id;
        const endpoint = `http://localhost:3002/lists/${listId}`;
        await axios.delete(endpoint);
        res.redirect("/");
    } catch (error) {
        res.redirect(`/list/edit/${req.params.id}?error=delete_failed`);
    }
};