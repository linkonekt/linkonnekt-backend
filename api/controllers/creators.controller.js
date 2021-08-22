const Email = require("../models/Email");
const User = require("../../auth/models/User");

exports.getAllCreators = async (req, res, next) => {
  try {
    await User.find()
      .then((creators) => {
        res.status(200).json(creators);
      })
      .catch((err) => {
        res.status(404).json({ message: err });
      });

    //   await user.updateOne(newUserObject, { override: true, upsert: true });
    //   const savedUser = await User.findById(user._id);
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.nameSearch = async (req, res, next) => {
  const search = req.params.search;
  try {
    await User.aggregate([
      {
        $addFields: {
          fullName: {
            $concat: [
              "$profileInfo.personalInfo.firstName",
              " ",
              "$profileInfo.personalInfo.lastName",
            ],
          },
        },
      },
      {
        $match: {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
      },
    ])
      .then((creators) => {
        res.status(200).json(creators);
      })
      .catch((err) => {
        res.status(404).json({ message: err });
      });

    //   await user.updateOne(newUserObject, { override: true, upsert: true });
    //   const savedUser = await User.findById(user._id);
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.categoryFilter = async (req, res, next) => {
  const category = req.params.category;
  try {
    await User.find({
      "profileInfo.categories.Category": category,
      email: { $ne: req.userEmail },
    })
      .then((creators) => {
        res.status(200).json(creators);
      })
      .catch((err) => {
        res.status(404).json({ message: err });
      });
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.getProfile = async (req, res, next) => {
  const username = req.params.username;
  try {
    await User.findOne({ username: username }, async (err, user) => {
      if (user) {
        res.status(200).json({ ok: 1, user: user });
      } else {
        res.status(404).json({ message: err });
      }
    });
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.addEmail = async (req, res, next) => {
  try {
    const email = new Email({
      Email: req.body.email,
    });
    await email.save();
    res.json({ ok: 1 });
  } catch (error) {
    res.send(error);
    console.log(error);
    next();
  }
};
//top 5
exports.top5 = async (req, res, next) => {
  try {
    await User.find()
      .limit(5)
      .sort({ "profileInfo.popularity": -1 })
      .then((creators) => {
        res.status(200).json(creators);
      })
      .catch((err) => {
        res.status(404).json({ message: err });
      });
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.postInvite = async (req, res, next) => {
  // const fromUsername = req.body.from;
  const toEmail = req.body.to;
  try {
    const filter = { email: toEmail };
    const update = { $push: { invitations: req.body } };

    await User.findOneAndUpdate(filter, update);

    res.json({ ok: 1 });
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.invitations = async (req, res, next) => {
  try {
    const email = req.userEmail;
    await User.findOne({ email: email }, async (err, user) => {
      if (user) {
        const invites = user.invitations;
        res.status(200).json({ ok: 1, invitations: invites });
      } else {
        res.status(404).json({ message: err });
      }
    });

    //   await user.updateOne(newUserObject, { override: true, upsert: true });
    //   const savedUser = await User.findById(user._id);
  } catch (error) {
    console.log(error);
    next();
  }
};

exports.editAbout = async (req, res, next) => {
  try {
    const about = req.body.about;
    const email = req.userEmail;
    const filter = { email: email };
    const update = { "profileInfo.personalInfo.about": about };

    await User.findOneAndUpdate(filter, update);

    res.json({ ok: 1 });
  } catch (error) {
    console.log(error);
    next();
  }
};
