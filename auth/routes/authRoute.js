const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const verify = require("../verifyToken");

router.post("/signup", controller.postSignupData);

router.post("/login", controller.postLoginData);

//auth with react-login
router.post("/oauthlogin", controller.postOuthLogin);

//signup with react-login
router.post("/oauthsignup", controller.postOuthSignup);

//sendmail
router.post("/sendmail", verify, controller.postSendmail);

//send invite mail
router.post("/sendinvitemail", verify, controller.postSendInvitemail);

router.post("/emailVerification", verify, controller.emailVerification);

router.get("/isAuth", verify, (req, res) => {
  res.json({ ok: 1 });
});

router.get("/isEmailVerified", verify, controller.isEmailVerified);

router.patch("/profileinfo", verify, controller.profileinfo);

router.post("/uploadDP", verify, controller.uploadDP);

module.exports = router;
