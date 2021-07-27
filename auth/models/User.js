const { required } = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  isEmailVerified: {
    type: Boolean,
  },
  profileInfo: {
    personalInfo: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      address: {
        type: String,
      },
      pincode: {
        type: String,
      },
    },
    categories: {
      Category: {
        type: String,
      },
      Platforms: {
        P1: {
          Platform: {
            type: String,
          },
          Followers: {
            type: String,
          },
          Subscribers: {
            type: String,
          },
        },
        P2: {
          Platform: {
            type: String,
          },
          Followers: {
            type: String,
          },
          Subscribers: {
            type: String,
          },
        },
        P3: {
          Platform: {
            type: String,
          },
          Followers: {
            type: String,
          },
          Subscribers: {
            type: String,
          },
        },
        P4: {
          Platform: {
            type: String,
          },
          Followers: {
            type: String,
          },
          Subscribers: {
            type: String,
          },
        },
      },
    },
    socialLinks: {
      Instagram: {
        type: String,
      },
      Facebook: {
        type: String,
      },
      LinkedIn: {
        type: String,
      },
      Twitter: {
        type: String,
      },
      YouTube: {
        type: String,
      },
    },
  },

  profileImg: {
    type: String,
  },

  role: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
