const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const verify = require("../verifyToken");

router.post("/signup", controller.postSignupData);

router.post("/login", controller.postLoginData);

//auth with react-login
router.post("/oauthlogin", controller.postOuthLogin);

//sendmail
router.post("/sendmail", verify, controller.postSendmail);

router.post("/emailVerification", verify, controller.emailVerification);

router.get("/isAuth", verify, (req, res) => {
  res.json({ ok: 1 });
});

router.get("/isEmailVerified", verify, controller.isEmailVerified);

module.exports = router;
