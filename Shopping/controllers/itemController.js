const axios = require("axios");

//Renders the page for a single list and its items, wqith sorting funcitonality
exports.getListById = async (req, res) => {
    try {
      if (!req.session.isloggedin) {
            return res.redirect("/login");
        }
      const listId = req.params.id;
      //Get sort nd filter parameters from the URL query string
      const { sortBy, order, filterByCategory } = req.query;

      const listDetailsEndpoint = `http://localhost:3002/lists/${listId}`;
      //Add all params to the items API endpoint if they exist
      const listItemsEndpoint = `http://localhost:3002/items/list/${listId}?sortBy=${sortBy || ''}&order=${order || ''}&filterByCategory=${filterByCategory || ''}`;
  
      const [listResponse, itemsResponse] = await Promise.all([
        axios.get(listDetailsEndpoint),
        axios.get(listItemsEndpoint)
      ]);
  
      //Define the categories for dropdown menu
      const categories = ["Fruit", "Vegetables", "Dairy", "Meat", "Bakery", "Pantry", "Household"];

      //Render the view, passing the current sorting and filter state
      res.render("viewList", {
        list: listResponse.data.result[0],
        items: itemsResponse.data.result,
        user: req.session.name,
        sortBy: sortBy,
        order: order,
        categories: categories, 
        currentCategory: filterByCategory 
      });
    } catch (error) {
      res.status(500).send("Error fetching list.");
    }
  };


//Renders the page to add a new item 
exports.getAddItemPage = (req, res) => {
  if (!req.session.isloggedin) {
            return res.redirect("/login");
        }
    const listId = req.params.listId;
    const categories = ["Fruit", "Vegetables", "Dairy", "Meat", "Bakery", "Pantry", "Household"];
    res.render("addItem", { listId, categories, status: req.query.status, user: req.session.name });
};

//Handles creating a new item 
exports.postNewItem = async (req, res) => {
    try {
      if (!req.session.isloggedin) {
            return res.redirect("/login");
        }
      const listId = req.params.listId;
      const { itemName, quantity, category, notes } = req.body;
      const dataToSend = { list_id: listId, item_name: itemName, quantity, category, notes };
      const endpoint = `http://localhost:3002/items`;
      await axios.post(endpoint, dataToSend);
      res.redirect(`/item/new/${listId}?status=added`);
    } catch (error) {
      res.status(500).send("Error creating item.");
    }
};

//Renders the page to edit an item 
exports.getEditItemPage = async (req, res) => {
    try {
      if (!req.session.isloggedin) {
            return res.redirect("/login");
        }
      const itemId = req.params.id;
      const endpoint = `http://localhost:3002/items/${itemId}`;
      const response = await axios.get(endpoint);
      const categories = ["Fruit", "Vegetables", "Dairy", "Meat", "Bakery", "Pantry", "Household"];
      res.render("editItem", { item: response.data.result[0], categories, error: req.query.error, user: req.session.name });
    } catch (error) {
      res.status(500).send("Error fetching item.");
    }
};

//  Handles updating an item 
exports.postUpdateItem = async (req, res) => {
    try {
      if (!req.session.isloggedin) {
            return res.redirect("/login");
        }
      const itemId = req.params.id;
      const { listId, itemName, quantity, category, notes, purchaseStatus } = req.body;
      const dataToSend = { item_name: itemName, quantity, category, notes, purchase_status: purchaseStatus === 'on' ? 1 : 0 };
      const endpoint = `http://localhost:3002/items/${itemId}`;
      await axios.put(endpoint, dataToSend);
      res.redirect(`/list/${listId}`);
    } catch (error) {
      res.status(500).send("Error updating item.");
    }
};

//Handles deleting an item
exports.postDeleteItem = async (req, res) => {
    try {
      if (!req.session.isloggedin) {
            return res.redirect("/login");
        }
        const itemId = req.params.id;
        const { listId } = req.body;
        const endpoint = `http://localhost:3002/items/${itemId}`;
        await axios.delete(endpoint);
        res.redirect(`/list/${listId}`);
    } catch (error) {
        res.redirect(`/item/edit/${req.params.id}?error=delete_failed`);
    }
};