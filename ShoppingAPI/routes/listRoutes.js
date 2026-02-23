const express = require("express");
const listController = require("./../controllers/listController");
const router = express.Router();

//API routes for managing shopping lists
router.post("/", listController.createList);
router.get("/user/:userId", listController.getAllListsForUser);
router.get("/:id", listController.getListById);
router.put("/:id", listController.updateList);
router.delete("/:id", listController.deleteList);

module.exports = router;