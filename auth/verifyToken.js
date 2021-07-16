const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  let token = "";
  if (req.header("Authorization")) {
    token = req.header("Authorization");
  } else {
    token = req.body.headers["Authorization"];
  }

  if (!token) {
    res.send(false);
  } else {
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      req.userEmail = verified.email;

      next();
    } catch (err) {
      res.send(err);
    }
  }
};
