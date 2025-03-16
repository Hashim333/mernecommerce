import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { myContext } from "../Context";
import { FcLike } from "react-icons/fc";
import { FaShoppingCart, FaInfoCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./OrdersPage.css";
import FooterComponent from "./Footer";

const OrdersPage = () => {
  const { wishlistCount, cartCount, isLoggedIn } = useContext(myContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:5000/api/users/order/${userId}`
        );

        // Sort orders by `createdAt` in descending order
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    if (isLoggedIn) {
      localStorage.clear();
      alert("You have logged out.");
      navigate("/login");
    } else {
      alert("Redirecting to login...");
    }
  };

  return (
    <div className="home-wrapper">
      <nav className="navbar">
        <Link to="/" className="navbar-brand">🛒 MyStore</Link>
        <div className="navbar-links">
          {/* <Link to="/wishlist" className="cart-icon-container">
            <FcLike />
            {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
          </Link> */}
          {/* <Link to="/about" className="navbar-link">
            <FaInfoCircle /> About
          </Link> */}
          {/* <Link to="/cart" className="cart-icon-container">
            <FaShoppingCart />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link> */}
          {/* <button onClick={handleLogout} className="navbar-link">
            {isLoggedIn ? "Logout" : "Login"}
          </button> */}
        </div>
      </nav>

      {orders.map((order) => (
        <div className="order-card" key={order._id}>
          <h3>Order ID: {order._id}</h3>
          <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
          <ul>
            {order.products.map((product) => (
              <li key={product._id}>
               <div>
               <div className="product-image-container">
  <img className="product-image" src={product.productId.image} alt={product.productId.name} />
</div>
              <div className="container">
                <p>{product.productId.name}</p>
                      <p>Quantity: {product.quantity}</p>
                      <p>Order Status: {order.status}</p>
             </div>         
                    
             </div>
              </li>
            ))}
          </ul>
          {/* <p className="order-date">
            Total: ${order.total.toFixed(2)}
          </p> */}
        </div>
      ))}
      <div>
      <FooterComponent/>
      </div>
    </div>
  );
};

export default OrdersPage;
