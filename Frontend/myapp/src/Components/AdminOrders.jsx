import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import FooterComponent from "./Footer";
import { Link } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoggedIn, setAdminLogged] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminToken");
    if (loggedIn) {
      setAdminLogged(true);
    }
    fetchOrders();
  }, []);

  // Fetch all orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/orders");
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="home-wrapper">
      <nav className="navbar"> <div className="store-icon"> <Link to="/admin" className="navbar-brand"> 🛒 MyStore </Link> </div> <div className="navbar-links"> <div className="link-group"> {/* <Link to="/ban" className="navbar-link"> <MdManageAccounts /> - Users </Link> <Link to="/banseller" className="navbar-link"> <MdManageAccounts /> - Seller </Link> */} {/* <Link to="/adminorder" className="navbar-link"> <GrAppsRounded />- Orders </Link> */} {/* <Link to="/cart" className="cart-icon-container"> <FaShoppingCart /> {cartCount >0 &&<span  className='cart-count'>{cartCount}</span> }Cart </Link> */} {/* <Link to="/adminseller" className="navbar-link"> <FaUserAlt /> Sellers </Link> */} {/* <Link to="/" className="navbar-link"> <FaHome /> Home </Link> */} {/* <Link to={!isLoggedIn?"/adminlogin":"/adminlogin"} className="navbar-link" onClick={handleLogedin}> {isLoggedIn ? ( <> <RiLogoutCircleFill /> Logout </> ) : ( <> <BiSolidLogInCircle /> Login </> )} </Link> */} </div> </div> </nav>
      <div className="admin-orders-container">
        <h1 className="admin-orders-title">Admin Orders</h1>
        <ul className="admin-orders-list">
          {orders.map((order) => (
            <li key={order._id} className="admin-order-card">
              <div className="admin-order-header">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>

              <div className="admin-order-body">
                <div className="admin-order-section">
                  <h3>User Details</h3>
                  <p><strong>User ID:</strong> {order.userId._id || "N/A"}</p>
                  <p><strong>Email:</strong> {order.userId.email || "N/A"}</p>
                  <p><strong>Payment:</strong> {order.paymentMethod}</p>
                  <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                </div>

                <div className="admin-order-section">
                  <h3>Shipping Address</h3>
                  <p>{order.shippingAddresses[0]?.addressLine1 || "N/A"}</p>
                  <p>{order.shippingAddresses[0]?.addressLine2 || "N/A"}</p>
                  <p>{order.shippingAddresses[0]?.city}, {order.shippingAddresses[0]?.state}</p>
                  <p>{order.shippingAddresses[0]?.postalCode}, {order.shippingAddresses[0]?.country}</p>
                </div>
              </div>

              <div className="admin-order-products">
                <h3>Products</h3>
                <ul>
                  {order.products.map((product) => (
                    <li key={product._id} className="admin-order-product">
                      <p><strong>Product ID:</strong> {product.productId}</p>
                      <p><strong>Seller ID:</strong> {product.sellerId}</p>
                      <p><strong>Size:</strong> {product.size}</p>
                      <p><strong>Quantity:</strong> {product.quantity}</p>
                      <p><strong>Price:</strong> ${product.price}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <FooterComponent />
    </div>
  );
}
