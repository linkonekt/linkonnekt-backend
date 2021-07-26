// const Hotel = require("../models/Hotel");
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
    await User.find({ "profileInfo.categories.Category": category })
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

// exports.book = async (req, res) => {
//   await User.findOne({ email: req.userEmail }, (err, foundUser) => {
//     try {
//       if (foundUser) {
//         const newBook = req.body;
//         foundUser.bookings.push(newBook);
//         foundUser.save();
//         res.json({ ok: 1 });
//       } else {
//         res.send("User Not Found");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   });
// };
