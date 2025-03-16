const User = require("../Model/userModel");
const mongoose = require("mongoose");
require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const jwtSecretKey = "hashim123";
const jwtSecretKey = process.env.JWT_SECRET;
const nodemailer = require('nodemailer');

const Product=require("../Model/productModel");

// require("dotenv").config();
// const createUser = async (req, res) => {

//   try {
//     const { username, email, password ,banned} = req.body;
//     const user = await User.findOne({
//       email: email,
//     });
//     if (!username || !email || !password) {
//       return res.status(400).json({ error: "All fields are required" });
//     }
   
//     if (user) {
//      return res.status(409).json({
//         error: "Email already exists.",
//       });     
//     }
//     let hashedPassword = await bcrypt.hash(password, 10);
//     await User.create({
//       username: username,
//       email: email,
//       password: hashedPassword,
//       banned,
//     });
//     res.send("user created successfully");

   
//   } catch (error) {
//     console.log(error);

//     return  res.status(500).json({success: false,msg: "An error occurred",});
//   }
// };
const createUser = async (req, res) => {
  try {
    const { username, email, password, banned } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, msg: "Email already exists plesae login." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      banned: banned || false,
    });
    await newUser.save();

    res.status(201).json({ success: true, msg: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};

// const loginUser=async (req, res) => {
//   try{
    
  
//     const { email, password, } = req.body;
//     const user = await User.findOne({ email });  
//     console.log("login",req.body);
    

//     if (!user) return res.status(404).send('User not found');  

//      // Check if user is banned
// if(user.banned){
//   return res.status(403).json({ success:false, msg:"User is banned"});
// }
//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) {
//       return res.status(400).send('Invalid password'); } 

//     const token = jwt.sign({ email:user.email}, jwtSecretKey);
//     res.json({success:true, token,userId:user._id });
// }
//  catch (error){
// console.log(error);
// res.status(500).json({
//   success: false,
//   msg: "An error occurred",
// });
// }
// }
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Check if user is banned
    if (user.banned) {
      return res.status(403).json({ success: false, msg: "User is banned" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, msg: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, jwtSecretKey, {
      expiresIn: "1d", // Optional: Token expiration time
    });

    res.json({ success: true, token, userId: user._id });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};

// const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ success: false, msg: "User not found" });
//     }

//     // Generate a reset token (you can use libraries like `crypto` for secure tokens)
//     const resetToken = jwt.sign({ id: user._id }, jwtSecretKey, { expiresIn: "15m" });

//     // Optionally: Save the reset token in the database or a cache for validation
//     user.resetToken = resetToken;
//     await user.save();

//     // Send an email (e.g., using nodemailer) with the reset token as a link
//     const resetLink = `http://localhost:3000/resetpassword/${resetToken}`;
//     console.log("Reset link:", resetLink); // Replace with actual email-sending logic

//     res.json({ success: true, msg: "Reset link sent to your email" });
//   } catch (error) {
//     console.error("Error in forgot password:", error);
//     res.status(500).json({ success: false, msg: "An error occurred" });
//   }
// };

// const resetPassword = async (req, res) => {
//   const { email, newPassword } = req.body;

//   try {
//     // Check if the user exists with the provided email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ success: false, msg: "User not found with this email" });
//     }

//     // Update the password
//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     res.json({ success: true, msg: "Password reset successfully" });
//   } catch (error) {
//     console.error("Error in reset password:", error);
//     res.status(500).json({ success: false, msg: "An error occurred while resetting the password" });
//   }
// };

const userForgotPassword = async (req, res) => {
  try {
      const { email } = req.body;
     
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }
    const user = await User.findOne({ email });
    // console.log('User ID:', user);

      if (!user) {
          return res.status(404).json({ error: 'User not found', success: false });
      }

      const token = jwt.sign({ id: user._id.toString()}, jwtSecretKey, { expiresIn: "1d" });
      console.log(`Generated Token: ${token}`);

      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user:  process.env.EMAIL_USER,
              pass: process.env.GOOGLE_APP_PASSCODE,
              // process.env.GOOGLE_APP_PASSCODE 
          },
          logger: true, // Log debug info
          debug: true,  // Show debug output
      });
      const resetLink = `http://localhost:3000/resetpassword/${user._id}/${token}`;
      const mailOptions = {
          from: 'hashiff0@gmail.com',
          to: email,
          subject: 'Reset Password Link',
          text: `Click the link to reset your password: ${resetLink}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log(error);
              return res.status(500).json({ success: false, message: 'Failed to send email' });
          }
          res.json({ success: true, message: 'Email sent successfully' });
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'An error occurred' });
  }
};
// const userResetPassword = async (req, res) => {
//   const { id, token } = req.params; // Extract id and token
//   const { password } = req.body; // Extract new password

//   // Validate ID format
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(400).json({ success: false, message: 'Invalid user ID format' });
//   }

//   try {
//     // Verify the JWT token
//     const decoded = jwt.verify(token, jwtSecretKey);

//     // Ensure the token's ID matches the requested ID
//     if (decoded.id !== id) {
//       return res.status(400).json({ success: false, message: 'Token ID mismatch' });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Update user's password
//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { password: hashedPassword },
//       { new: true } // Return the updated user
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     res.json({ success: true, message: 'Password updated successfully' });
//   } catch (err) {
//     console.error(err);

//     // Handle specific JWT errors
//     if (err.name === 'JsonWebTokenError') {
//       return res.status(400).json({ success: false, message: 'Invalid or expired token' });
//     }

//     res.status(500).json({ success: false, message: 'An error occurred' });
//   }
// };

const userResetPassword = async (req, res) => {

  const { id, token } = req.params
  const { password } = req.body
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid user ID' });
}
  jwt.verify(token, jwtSecretKey, (err, decoded) => {
      if (err) {
          return res.json({ Status: "Error with token" })
      } else {
          bcrypt.hash(password, 10)
              .then(hash => {
                  User.findByIdAndUpdate({ _id: id }, { password: hash })
                      .then(u => res.send({ Status: "Success" }))
                      .catch(err => res.send({ Status: err }))
              })
              .catch(err => res.send({ Status: err }))
      }
  })

}



const authenticateToken =async (req, res) => {
  const { username, email } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true }
    );
    if (updatedUser) {
      res.json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ success: false, msg: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error updating profile." });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};

const getUserById=async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};

const Order = require("../Model/orderModel");

const createOrder = async (req, res) => {
  try {
    const { userId, products, paymentMethod } = req.body;

    if (!userId || !products || !products.length || !paymentMethod) {
      return res.status(400).json({ success: false, msg: "Missing required fields" });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (let product of products) {
      const { productId, quantity } = product;
      const productData = await Product.findById(productId);
      if (!productData) {
        return res.status(404).json({ success: false, msg: `Product with ID ${productId} not found` });
      }
      totalAmount += productData.price * quantity;
    }

    const newOrder = new Order({
      userId,
      products,
      totalAmount,
      shippingAddresses: [shippingAddress],
    });

    await newOrder.save();
    res.status(201).json({ success: true, msg: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};
// const newOrder= async (req, res) => {
//   const { userId, products, totalAmount, paymentMethod, shippingAddress } = req.body;

//   try {
//     const newOrder = new Order({
//       userId,
//       products,
//       totalAmount,
//       paymentMethod,
//       shippingAddress,
//     });

//     const savedOrder = await newOrder.save();
//     res.status(201).json(savedOrder);
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).json({ error: "Failed to create order" });
//   }
// };

const newOrder = async (req, res) => {
  const { userId, products, totalAmount, paymentMethod, shippingAddress } = req.body;

  // Validate incoming data (optional but recommended)
  if (!userId || !products || !totalAmount || !paymentMethod || !shippingAddress) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Products array cannot be empty" });
  }
 
  
  try {
   
    const newOrder = new Order({
      userId,
      products: products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        sellerId: product.sellerId, 
        size: product.size, 
        price: product.price,
      })),
      totalAmount,
      paymentMethod,
      shippingAddresses: [shippingAddress],
    });
    // console.log("Received products:", products);

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};


  const userOrder = async (req, res) => {
    const { userId } = req.params; 
    console.log("user",userId)
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      
      const orders = await Order.find({ userId })
      .populate("products.productId")
// 
      //   .sort({ createdAt: -1 }); 

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  };

  const singleOrder= async (req, res) => {
    const { productId,sellerId, size, userId, quantity ,totalAmount,paymentMethod,shippingAddress} = req.body;
    // console.log("Received productId:", productId);
    if (!size) {
      return res.status(400).json({ message: "Size is required" });
    }
    
    try {
      
      // Find the product by ID
      const product = await Product.findById(productId);
      console.log("Found product:", product);
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      if (!Array.isArray(product.sizes) || product.sizes.length === 0) {
        return res.status(400).json({ message: "No sizes available for this product" });
      }
      // Find the selected size
      const selectedSize = product.sizes.find((s) => 
        s.size && s.size.toLowerCase() === (size && size.toLowerCase())
      );
      
      if (!selectedSize) return res.status(400).json({ message: "Invalid size selected" });
  
      // Check if there's enough stock
      if (selectedSize.stock < quantity) return res.status(400).json({ message: "Not enough stock available" });
      if (typeof quantity !== 'number' || isNaN(quantity)) {
        return res.status(400).json({ message: "Invalid quantity provided" });
      }
      
      if (typeof selectedSize.stock !== 'number' || isNaN(selectedSize.stock)) {
        return res.status(400).json({ message: "Invalid stock value for the selected size" });
      }
      // Deduct the quantity from stock
      selectedSize.stock -= quantity;
      if (isNaN(selectedSize.stock)) {
        return res.status(500).json({ message: "Stock calculation error" });
      }
 
      await product.save();
  
     
      const newOrder = new Order({
        userId,
        products: [
          {
            productId,
            size,
            quantity,
            sellerId,
            price: totalAmount / quantity, 
          },
        ],
        totalAmount,
        paymentMethod, 
        shippingAddresses: [shippingAddress],
      });
  
      await newOrder.save();
  
      
      res.status(200).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: "An error occurred while placing the order", 
        error: error.message 
      });
    }
    
  };
  
const order= async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate(
      "products.productId",
      "name price image"
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, msg: "Order not found" });
    }

    order.status = status;
    order.updatedAt = Date.now();

    await order.save();
    res.json({ success: true, msg: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};


// const getOrdersByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const orders = await Order.find({ userId }).populate("products.productId", "name price");
//     if (!orders.length) {
//       return res.status(404).json({ success: false, msg: "No orders found for this user" });
//     }

//     res.json({ success: true, orders });
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ success: false, msg: "An error occurred" });
//   }
// };

// const toggleBanStatus = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, msg: "User not found" });
//     }

//     user.banned = !user.banned;
//     await user.save();

//     res.json({ success: true, banned: user.banned });
//   } catch (error) {
//     console.error("Error toggling ban status:", error);
//     res.status(500).json({ success: false, msg: "An error occurred" });
//   }
// };

const saveNewAddress = async (userId, newAddress) => {
  try {
    // Update the user's savedAddress directly with the new address
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { savedAddress: newAddress }, // Overwrite the savedAddress with the new one
      { new: true, runValidators: true } // Return the updated document and validate it
    );

    if (!updatedUser) {
      return { success: false, message: "User not found" };
    }

    return { success: true, message: "Address updated successfully", user: updatedUser };
  } catch (error) {
    console.error("Error saving address:", error);
    return { success: false, message: "An error occurred while saving the address" };
  }
};

const getSavedAddress = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("savedAddresses ");

    if (!user || !user.savedAddresses ) {
      return res.status(404).json({ message: "No saved address found" });
    }

    res.status(200).json({ address: user.savedAddresses  });
  } catch (error) {
    console.error("Error fetching saved address:", error);
    res.status(500).json({ message: "Server error while fetching address" });
  }
};

// const updateAddress= async (req, res) => {
//   const { userId } = req.params;
//   const { addressLine1, addressLine2, city, state, postalCode, country } = req.body;

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.savedAddress = { addressLine1, addressLine2, city, state, postalCode, country };
//     await user.save();

//     res.status(200).json({ message: "Address saved successfully", address: user.savedAddress });
//   } catch (error) {
//     console.error("Error saving address:", error);
//     res.status(500).json({ message: "Server error while saving address" });
//   }
// };

// const updateUserAddress = async (req, res) => {
//   try {
//     const { userId } = req.params; 
//     const { addressLine1, addressLine2, city, state, postalCode, country } = req.body; 

   

//     if (!userId) {
//       return res.status(400).json({ success: false, msg: "User ID is required" });
//     }
//     if (!addressLine1 || !city || !state || !postalCode || !country) {
//       return res.status(400).json({ success: false, msg: "All required address fields are required" });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ success: false, msg: "User not found" });
//     }

//     user.savedAddress = {
//       addressLine1,
//       addressLine2: addressLine2 || "", 
//       city,
//       state,
//       postalCode,
//       country,
//     };

//     // Save the updated user
//     await user.save();

//     res.status(200).json({ success: true, msg: "Address updated successfully", address: user.savedAddress });
//   } catch (error) {
//     console.error("Error updating address:", error);
//     res.status(500).json({ success: false, msg: "An error occurred" });
//   }
// };
const updateUserAddress = async (req, res) => {
  try {
    const { userId } = req.params; 
    const { addressId, addressLine1, addressLine2, city, state, postalCode, country } = req.body; 

    if (!userId) {
      return res.status(400).json({ success: false, msg: "User ID is required" });
    }
    if (!addressLine1 || !city || !state || !postalCode || !country) {
      return res.status(400).json({ success: false, msg: "All required address fields are needed" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Check if `addressId` exists (for editing a specific address)
    if (addressId) {
      const addressIndex = user.savedAddresses.findIndex((addr) => addr._id.toString() === addressId);
      if (addressIndex === -1) {
        return res.status(404).json({ success: false, msg: "Address not found" });
      }

      // Update the specific address
      user.savedAddresses[addressIndex] = {
        ...user.savedAddresses[addressIndex],
        addressLine1,
        addressLine2: addressLine2 || "",
        city,
        state,
        postalCode,
        country,
      };
    } else {
      // Add a new address to `savedAddresses`
      user.savedAddresses.push({
        addressLine1,
        addressLine2: addressLine2 || "",
        city,
        state,
        postalCode,
        country,
      });
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ success: true, msg: "Address updated successfully", savedAddresses: user.savedAddresses });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ success: false, msg: "An error occurred" });
  }
};
const Contact=require("../Model/contactModel");
const contactAndSupport = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    res.status(200).json({ message: "Contact form submitted successfully!" });
  } catch (error) {
    console.error("Error saving contact form data:", error);

    // Return specific validation errors if possible
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: validationErrors });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports={createUser,loginUser,getAllUsers,createOrder,updateOrderStatus,userOrder,newOrder,order,singleOrder,getSavedAddress,updateUserAddress,saveNewAddress,authenticateToken,userForgotPassword,userResetPassword,getUserById,contactAndSupport}
