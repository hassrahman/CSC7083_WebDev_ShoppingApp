const express = require("express");
const itemController = require("./../controllers/itemController");
const router = express.Router();

//defines the API routes for managing list items
router.post("/", itemController.createItem);
router.get("/list/:listId", itemController.getItemsForList);
router.get("/:id", itemController.getItemById);
router.put("/:id", itemController.updateItem);
router.delete("/:id", itemController.deleteItem);

module.exports = router;