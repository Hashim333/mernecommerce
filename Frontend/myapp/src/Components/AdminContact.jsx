import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminContact.css";
import { Link } from "react-router-dom";
import FooterComponent from "./Footer";

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch messages from the backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/contactMessage");
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to load messages. Please try again later.");
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="home-wrapper">
         <nav className="navbar">
                     <div className="store-icon">
                       <Link to="/admin" className="navbar-brand">🛒 MyStore</Link>
                     </div>
                     
                     
                     
                     <div className="navbar-links">
                       <div className="link-group">
                        
                         {/* <Link to="/ban" className="navbar-link">
                           <MdManageAccounts /> - Users
                         </Link>
                         <Link to="/banseller" className="navbar-link">
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
                                     </Link> */}
                          {/* <Link to={!isLoggedIn?"/adminlogin":"/adminlogin"} className="navbar-link" onClick={handleLogedin}>
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
    <div className="admin-contact-container">
      <h1>Contact Messages</h1>
      {loading ? (
        <p>Loading messages...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <table className="messages-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id}>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.subject}</td>
                <td>{msg.message}</td>
                <td>{new Date(msg.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    <div>
        <FooterComponent/>
    </div>
    
    </div>
  );
};

export default AdminContact;
