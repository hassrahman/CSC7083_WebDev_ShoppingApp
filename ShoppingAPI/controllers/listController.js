const conn = require("./../utils/dbconn");

//new shoppoing list
exports.createList = async (req, res) => {
  try {
    //list details from the request body
    const { listName, description, targetShop, userId } = req.body;
    const insertSQL = "INSERT INTO shopping_lists (list_name, description, target_shop, user_id) VALUES (?, ?, ?, ?)";
    const values = [listName, description, targetShop, userId];
    const [result] = await conn.execute(insertSQL, values);
    res.status(201).json({
        status: "success",
        message: "Shopping list created successfully.",
        listId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ status: "failure", message: error.message });
  }
};

//all shopping lists for a user
exports.getAllListsForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const selectSQL = "SELECT * FROM shopping_lists WHERE user_id = ?";
    const [result] = await conn.execute(selectSQL, [userId]);
    res.status(200).json({ status: "success", result: result });
  } catch (error) {
    res.status(500).json({ status: "failure", message: error.message });
  }
};

//single shopping list by listID
exports.getListById = async (req, res) => {
  try {
    //get list ID from  URL params
    const listId = req.params.id;
    const selectSQL = "SELECT * FROM shopping_lists WHERE id = ?";
    const [result] = await conn.execute(selectSQL, [listId]);
    res.status(200).json({ status: "success", result: result });
  } catch (error) {
    res.status(500).json({ status: "failure", message: error.message });
  }
};

//  update list
exports.updateList = async (req, res) => {
  try {
    //Get list id from url and details from  body
    const listId = req.params.id;
    const { listName, description, targetShop } = req.body;
    const updateSQL = "UPDATE shopping_lists SET list_name = ?, description = ?, target_shop = ? WHERE id = ?";
    const values = [listName, description, targetShop, listId];
    await conn.execute(updateSQL, values);
    res.status(200).json({ status: "success", message: `List ID ${listId} updated.` });
  } catch (error) {
    res.status(500).json({ status: "failure", message: error.message });
  }
};

//delete list (if empty or all purchased marked)
exports.deleteList = async (req, res) => {
  try {
    const listId = req.params.id;
    //first get all items on the list to check their purchase status
    const checkItemsSQL = "SELECT purchase_status FROM list_items WHERE list_id = ?";
    const [items] = await conn.execute(checkItemsSQL, [listId]);
    
    //check if  list can be deleted. yes if empty or if all items purchased.
    const canDelete = items.every(item => item.purchase_status === 1);

    if (!canDelete) {
      //if condition not met, send 403 error
      return res.status(403).json({
        status: "failure",
        message: "List cannot be deleted because it contains items that have not been purchased.",
      });
    }
    //if condition metdelete list
    const deleteSQL = "DELETE FROM shopping_lists WHERE id = ?";
    await conn.execute(deleteSQL, [listId]);
    res.status(200).json({ status: "success", message: `List ID ${listId} deleted.` });
  } catch (error) {
    res.status(500).json({ status: "failure", message: error.message });
  }
};