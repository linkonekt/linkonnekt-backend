const express = require("express");
const router = express.Router();
const controller = require("../controllers/creators.controller");
const verify = require("../../auth/verifyToken");

//GET all creators
router.get("/list", controller.getAllCreators);
//GET creators by name
router.get("/list/name/:search", verify, controller.nameSearch);
//GET creators by category
router.get("/list/category/:category", verify, controller.categoryFilter);
//get top 5 creators
router.get("/top5", controller.top5);
//GET creators by username
router.get("/profile/:username", controller.getProfile);
//get all invitations
router.get("/invitations", verify, controller.invitations);
//post user email
router.post("/addemail", controller.addEmail);
//post invitation
router.post("/postinvite", controller.postInvite);
//post about
router.patch("/editabout", verify, controller.editAbout);

// //GET hotels by ratings
// router.get("/list/rating/:rating", controller.rateFilter);

// router.post("/book", verify, controller.book);

module.exports = router;
