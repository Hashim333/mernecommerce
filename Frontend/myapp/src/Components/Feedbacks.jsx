import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiSolidLogInCircle } from "react-icons/bi";
import { MdManageAccounts } from "react-icons/md";
import { GrAppsRounded } from "react-icons/gr";
import { RiLogoutCircleFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUserAlt, FaInfoCircle } from 'react-icons/fa';
import FooterComponent from "./Footer";
const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState("");

  // Fetch feedbacks on component mount
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/feedback/feedbacks"); // Update the URL if needed
        setFeedbacks(response.data);
      } catch (err) {
        setError("Failed to fetch feedbacks. Please try again later.");
        console.error(err);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div >
  <nav className="navbar">
             <div className="store-icon">
               <Link to="/admin" className="navbar-brand">🛒 MyStore</Link>
             </div>
             
             
             
             <div className="navbar-links">
               <div className="link-group">
                
                 {/* <Link to="/ban" className="navbar-link">
                   <MdManageAccounts /> - Users
                 </Link>
                 <Link
                  to="/banseller" className="navbar-link">
                   <MdManageAccounts /> - Seller
                 </Link> */}
                 {/* <Link to="/adminorder" className="navbar-link">
                   <GrAppsRounded />- Orders
                 </Link> */}
                 {/* <Link to="/cart" className="cart-icon-container">
                   <FaShoppingCart /> 
                   {cartCount >0 &&<span  className='cart-count'>{cartCount}</span> }Cart
                 </Link> */}
                 {/* <Link to="/adminseller" className="navbar-link">
                   <FaUserAlt /> Sellers
                 </Link> */}
                  {/* <Link to="/" className="navbar-link">
                               <FaHome /> Home
                             </Link>
                  <Link to={!isLoggedIn?"/adminlogin":"/adminlogin"} className="navbar-link" onClick={handleLogedin}>
                           {isLoggedIn ? (
                         <>
                           <RiLogoutCircleFill /> Logout
                         </>
                       ) : (
                         <>
                           <BiSolidLogInCircle /> Login
                         </>
                       )}
                           </Link> */}
               </div>
             </div>
           </nav>
    <div style={styles.container}>
      <h1 style={styles.heading}>Feedbacks</h1>
      {error && <p style={styles.error}>{error}</p>}
      {feedbacks.length === 0 ? (
        <p style={styles.message}>No feedbacks available.</p>
      ) : (
        <ul style={styles.list}>
          {feedbacks.map((feedback) => (
            <li key={feedback._id} style={styles.listItem}>
              <p><strong>Feedback:</strong> {feedback.message}</p>
              <p><strong>Date:</strong> {new Date(feedback.createdAt).toLocaleDateString()}</p>
              {/* Uncomment the below lines if "submittedBy" details are populated */}
              {/* <p><strong>Submitted By:</strong> {feedback.submittedBy.name} ({feedback.submittedBy.email})</p> */}
            </li>
          ))}
        </ul>
      )}
    </div>
    <FooterComponent/>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#333",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    color: "#666",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    backgroundColor: "#f9f9f9",
    margin: "10px 0",
    padding: "15px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
};

export default Feedbacks;
