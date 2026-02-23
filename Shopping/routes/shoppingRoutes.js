const express = require("express");
const authController = require("./../controllers/authController");
const mainController = require("./../controllers/mainController");
const listController = require("./../controllers/listController");
const itemController = require("./../controllers/itemController");
const router = express.Router();

//Main Routes
router.get("/", mainController.getHomePage);
router.get("/analytics", mainController.getAnalyticsPage);

//Auth(entication:) Routes
router.get("/register", authController.getRegisterPage);
router.post("/register", authController.postRegister);
router.get("/login", authController.getLoginPage);
router.post("/login", authController.postLogin);
router.get("/logout", authController.getLogout);

// List Routes
router.get("/list/new", listController.getNewListPage);
router.post("/list/new", listController.postNewList);
router.get("/list/edit/:id", listController.getEditListPage);
router.post("/list/edit/:id", listController.postUpdateList);
router.post("/list/delete/:id", listController.postDeleteList);

//Item Routes 
router.get("/list/:id", itemController.getListById); //single list view
router.get("/item/new/:listId", itemController.getAddItemPage);
router.post("/item/new/:listId", itemController.postNewItem);
router.get("/item/edit/:id", itemController.getEditItemPage);
router.post("/item/edit/:id", itemController.postUpdateItem);
router.post("/item/delete/:id", itemController.postDeleteItem);

module.exports = router;