const User = require("../models/User");
const dotenv = require("dotenv");
const { signupValidation, loginValidation } = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const oauthpipeline = require("../../config/OauthSetup");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const verify = require("../verifyToken");

dotenv.config();

const saltRounds = 10;

exports.postSignupData = async (req, res) => {
  // validate the data. The joi.validate thing send error as the 1st object in its response and there is also a message in the details.
  const { error } = signupValidation(req.body);
  if (error) {
    return res.send(error.details[0].message);
  } else {
    //check if email already exists
    User.findOne({ email: req.body.email }, async (err, foundEmail) => {
      if (foundEmail) {
        res.send("Email already exists");
      } else {
        bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
          //create a user
          const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
            role: req.body.role,
            isEmailVerified: false,
          });
          try {
            const savedUser = await user.save();
            const token = jwt.sign(
              { email: req.body.email },
              process.env.TOKEN_SECRET,
              {
                expiresIn: "1hr",
              }
            );

            res.json({ ok: 1, token: token });
          } catch (err) {
            res.status(400).send(err);
          }
        });
      }
    });
  }
};

exports.postLoginData = async (req, res) => {
  //lets validate the data. The joi.validate thing send error as the 1st object in its response and there is also a message in the details.
  const { error } = loginValidation(req.body);
  if (error) {
    return res.send(error.details[0].message);
  } else {
    //check if email doesn't exist
    User.findOne({ email: req.body.email }, async (err, foundUser) => {
      const email = req.body.email;
      if (!foundUser) {
        res.send("Email doesn't match our records");
      } else {
        //check password
        bcrypt.compare(
          req.body.password,
          foundUser.password,
          function (err, result) {
            if (result) {
              const token = jwt.sign(
                { email: email },
                process.env.TOKEN_SECRET,
                {
                  expiresIn: "1hr",
                }
              );
              res.json({ token: token, user: foundUser });
            } else {
              res.send("invalid password");
            }
          }
        );
      }
    });
  }
};

exports.postOuthLogin = async (req, res, next) => {
  try {
    // the oauthpipeline verifies the user and returns the email
    const { given_name, email, sub } = await oauthpipeline(req, next);

    // check if user already exists in our own db
    await User.findOne({ email: email }).then((currentUser) => {
      if (currentUser) {
        const token = jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
          expiresIn: "1hr",
        });
        res.json({ ok: 1, token: token, user: currentUser });
      } else {
        res.send("User not found");
      }
    });
  } catch (err) {
    console.log(err);
  }
};
exports.postOuthSignup = async (req, res, next) => {
  try {
    // the oauthpipeline verifies the user and returns the email
    const { given_name, email, sub } = await oauthpipeline(req, next);

    // check if user already exists in our own db
    await User.findOne({ email: email }).then((currentUser) => {
      if (!currentUser) {
        // already have this user
        new User({
          username: given_name,
          email: email,
          isEmailVerified: false,
          role: req.body.role,
        }).save();
        // const { email } = await oauthpipeline(req, next);
        const token = jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
          expiresIn: "1hr",
        });
        res.json({ ok: 1, token: token, user: currentUser });
      } else {
        res.send("User already exists");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postSendmail = async (req, res) => {
  const hashcode = "";
  try {
    const code = Math.floor(Math.random() * 9000) + 1000;
    // the oauthpipeline verifies the user and returns the email
    const email = req.userEmail;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: "linkonnekt1@gmail.com",
      subject: "Verification Code",
      html:
        "<h4>Your email verfication code for Linkonnekt is: </h4><h1 style='font-size: large;'>" +
        code +
        "</h1>",
    };
    bcrypt.hash("" + code, saltRounds, async function (err, hash) {
      sgMail
        .send(msg)
        .then((response) => {
          console.log("Email sent");
          res.json({ ok: 1, code: hash });
        })
        .catch((err) => {
          res.json({ ok: 0, error: err });
        });
    });
  } catch (err) {
    console.log(err);
  }
};

exports.emailVerification = async (req, res) => {
  bcrypt.compare(req.body.code, req.body.hash, async function (err, result) {
    if (result) {
      try {
        const filter = { email: req.userEmail };
        const update = { isEmailVerified: true };

        await User.findOneAndUpdate(filter, update, {
          new: true,
        });

        res.json({ ok: 1 });
      } catch (error) {
        res.json({ error: error });
      }
    } else {
      console.log("error" + err);
      res.json({ ok: 0 });
    }
  });
};

exports.isEmailVerified = async (req, res) => {
  await User.findOne({ email: req.userEmail })
    .then((currentUser) => {
      if (currentUser.isEmailVerified) {
        res.json({ ok: 1 });
      } else {
        res.json({ ok: 0 });
      }
      if (!currentUser) {
        res.send("User not found");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.profileinfo = async (req, res) => {
  await User.findOne({ email: req.userEmail })
    .then(async (currentUser) => {
      try {
        const filter = { email: req.userEmail };
        const update1 = { profileInfo: req.body.profileObj };
        const update2 = { socialLinks: req.body.socialUrls };

        await User.findOneAndUpdate(filter, update1, {
          new: true,
        });
        await User.findOneAndUpdate(filter, update2, {
          new: true,
        });

        res.json({ ok: 1 });
      } catch (error) {
        res.json({ error: error });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
