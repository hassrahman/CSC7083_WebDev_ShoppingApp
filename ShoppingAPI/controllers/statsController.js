const conn = require("./../utils/dbconn");

//stats for user
exports.getStats = async (req, res) => {
  try {
    const userId = req.params.userId;

    const totalListsSQL = "SELECT COUNT(*) AS totalLists FROM shopping_lists WHERE user_id = ?";
    const totalItemsSQL = "SELECT COUNT(*) AS totalItemsPurchased FROM list_items li JOIN shopping_lists sl ON li.list_id = sl.id WHERE sl.user_id = ? AND li.purchase_status = 1";
    const categorySQL = "SELECT category, COUNT(*) as itemCount FROM list_items li JOIN shopping_lists sl ON li.list_id = sl.id WHERE sl.user_id = ? AND li.purchase_status = 1 GROUP BY category";

    const [listsResult] = await conn.execute(totalListsSQL, [userId]);
    const [itemsResult] = await conn.execute(totalItemsSQL, [userId]);
    const [categoryResult] = await conn.execute(categorySQL, [userId]);

    //combine all results into a single stats object
    const stats = {
      totalLists: listsResult[0].totalLists,
      totalItemsPurchased: itemsResult[0].totalItemsPurchased,
      categoryCounts: categoryResult,
    };
    
    res.status(200).json({ status: "success", result: stats });
  } catch (error) {
    res.status(500).json({ status: "failure", message: error.message });
  }
};