const mongoose=require("mongoose");


const sellerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"seller name is require"],
        trim:true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/\S+@\S+\.\S+/, 'Please provide a valid email'],
    },
    password:{
        type:String,
        required:true,
    },
    storeName: {
        type: String,
        required: [true, 'Store name is required'],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      approved: { type: Boolean, default: false },
      banned:{
        type: Boolean,
        default:false
    },
    feedbacks: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Feedback",
        },
      ],
});
module.exports = mongoose.model('Seller', sellerSchema);