const express = require("express");
const router = express.Router();
const controller = require("../controllers/creators.controller");
// const verify = require("../verifyToken");

//GET all creators
router.get("/list", controller.getAllCreators);
//GET creators by name
router.get("/list/name/:search", controller.nameSearch);
//GET creators by category
router.get("/list/category/:category", controller.categoryFilter);
//GET creators by username
router.get("/:username", controller.getProfile);
// //GET hotels by ratings
// router.get("/list/rating/:rating", controller.rateFilter);

// router.post("/book", verify, controller.book);

module.exports = router;
