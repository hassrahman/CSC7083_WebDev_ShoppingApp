const conn = require("./../utils/dbconn");

//neww item in list
exports.createItem = async (req, res) => {
  try {
    //get item details from the request body
    const { list_id, item_name, quantity, category, notes } = req.body;
    //prep SQL query
    const insertSQL = "INSERT INTO list_items (list_id, item_name, quantity, category, notes) VALUES (?, ?, ?, ?, ?)";
    //prep values for query
    const values = [list_id, item_name, quantity, category, notes];
    //run query
    const [result] = await conn.execute(insertSQL, values);
    res.status(201).json({
      status: "success",
      message: "Item added successfully.",
      itemId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ status: "failure", message: error.message });
  }
};


//all items for a list, sort and filter
exports.getItemsForList = async (req, res) => {
  try {
    const listId = req.params.listId;
    //get sort and filter params from query string
    const { sortBy, order, filterByCategory } = req.query;

    const allowedSortColumns = ['item_name', 'quantity', 'category', 'purchase_status', 'date_added'];
    const allowedOrder = ['asc', 'desc'];

    //start with the basic query and values arr
    let selectSQL = "SELECT * FROM list_items WHERE list_id = ?";
    const values = [listId];

    //if category filter provided, add to SQL query
    if (filterByCategory) {
      selectSQL += " AND category = ?";
      values.push(filterByCategory); // add cat. to the values arr
    }

    //if sort params exiswt, use ORDER BY clause
    if (allowedSortColumns.includes(sortBy) && allowedOrder.includes(order)) {
      selectSQL += ` ORDER BY ?? ${order.toUpperCase()}`;
      values.push(sortBy);
    }
    
   
    const [result] = await conn.query(selectSQL, values);

    res.status(200).json({ status: "success", result: result });
  } catch (error) {
    res.status(500).json({ status: "failure", message: error.message });
  }
};


//get single item by ListID
exports.getItemById = async (req, res) => {
    try {
      const itemId = req.params.id;
      const selectSQL = "SELECT * FROM list_items WHERE id = ?";
      const [result] = await conn.execute(selectSQL, [itemId]);
      res.status(200).json({ status: "success", result: result });
    } catch (error) {
      res.status(500).json({ status: "failure", message: error.message });
    }
  };

//update item
exports.updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { item_name, quantity, category, notes, purchase_status } = req.body;
    const updateSQL = "UPDATE list_items SET item_name = ?, quantity = ?, category = ?, notes = ?, purchase_status = ? WHERE id = ?";
    const values = [item_name, quantity, category, notes, purchase_status, itemId];
    await conn.execute(updateSQL, values);
    res.status(200).json({ status: "success", message: `Item ID ${itemId} updated.` });
  } catch (error) {
    res.status(500).json({ status: "failure", message: error.message });
  }
};

//delete item (if purchased)
exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const checkItemSQL = "SELECT purchase_status FROM list_items WHERE id = ?";
    const [items] = await conn.execute(checkItemSQL, [itemId]);

    if (items.length === 0) {
      return res.status(404).json({ status: "failure", message: "Item not found." });
    }
    //check if status is 'Purchased' (which is stored as 1)
    const canDelete = items[0].purchase_status === 1;

    if (!canDelete) {
      //If not purchased, send 403 error
      return res.status(403).json({
        status: "failure",
        message: "Item cannot be deleted unless its status is 'Purchased'.",
      });
    }
    //if purchased, proceed with deleting
    const deleteSQL = "DELETE FROM list_items WHERE id = ?";
    await conn.execute(deleteSQL, [itemId]);
    res.status(200).json({ status: "success", message: `Item ID ${itemId} deleted.` });
  } catch (error) {
    res.status(500).json({ status: "failure", message: error.message });
  }
};