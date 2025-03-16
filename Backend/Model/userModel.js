// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true,trim: true,},
//   email: { type: String, required: true ,lowercase: true,unique: true,},
//   password: { type: String, required: true},
//   banned:{type: Boolean,default:false},
//   savedAddress: {
//     addressLine1: { type: String },
//     addressLine2: { type: String },
//     city: { type: String },
//     state: { type: String },
//     postalCode: { type: String },
//     country: { type: String },
//   },
// });

// const User = mongoose.model("User", userSchema); 
// module.exports = User;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  banned: { type: Boolean, default: false },
  savedAddresses: [
    {
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
