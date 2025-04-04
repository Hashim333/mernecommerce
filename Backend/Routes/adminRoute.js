const express = require("express");
const { getAllOrders, adminLogin ,getAllSellers,toggleBanUser,toggleBanSeller,contactMessage,getUnapprovedSellers,approveSeller,rejectSeller} = require("../Controller/adminController");
const { getAllUsers } = require("../Controller/usercontroller");
const { getAllProducts, deleteProduct } = require("../Controller/productController");

const router = express.Router();


router.post("/login", adminLogin);
router.get("/users", getAllUsers);
router.get("/contactMessage", contactMessage);

router.patch("/users/:userId/ban", toggleBanUser);
router.patch("/seller/:sellerId/ban",toggleBanSeller);
router.get("/products", getAllProducts);
router.get("/orders",getAllOrders);
router.delete("/products/:productId", deleteProduct);
router.get("/sellers/get",getAllSellers);
router.get("/unapproved",getUnapprovedSellers);
router.put("/approve/:id",approveSeller);
router.delete("/reject/:id", rejectSeller);


module.exports = router;
