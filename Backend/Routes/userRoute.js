const express = require('express');
const router = express.Router();
const userController=require("../Controller/usercontroller")


// Login Route
router.post("/signup",userController.createUser );
router.post("/login", userController.loginUser);

router.post("/contact",userController.contactAndSupport);
router.post("/forgotpassword", userController.userForgotPassword);
router.post("/resetpassword/:id/:token", userController.userResetPassword);
router.get("/:userId",userController.getUserById);
router.put("/profile/users/:id",userController.authenticateToken)
router.get("/order/:userId",userController.userOrder);
router.post("/address/:userId",userController.saveNewAddress);
router.get("/address/get/:userId",userController.getSavedAddress);
router.post("/:userId/address",userController.updateUserAddress)



router.post("/neworder", userController.newOrder);
router.post("/singleOrder", userController.singleOrder);

router.post("/userodrder", userController.userOrder);
// router.post("/order", userController.userOrder);




// router.patch("/user/ban/:userId",userController.toggleBanStatus);
module.exports = router;
