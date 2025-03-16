import React, { useState } from "react";
import axios from "axios";
import "./Feedbak.css";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle } from "react-icons/fa";
import FooterComponent from "./Footer";

const Feedback = ({ userId, userType }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("");
const email=localStorage.getItem("userEmail");

console.log("ggvhbh",email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/feedback/feedback", {
        subject,
        message,
        submittedBy:email,
        // userType:Admin,
      });
alert("Feedback Successfully Send..")
      setFeedbackStatus("Feedback submitted successfully!");
      setSubject("");
      setMessage("");
    } catch (error) {
      setFeedbackStatus("Error submitting feedback: " + error.message);
    }
  };

  return (
    <div>
        <nav className="navbar">
                       <div className="cart-store-icon">
                         <Link to="/" className="navbar-brand">
                           🛒 MyStore
                         </Link>
                       </div>
                       <div className="navbar-links">
                         <div className="link-group">
                           {/* <Link to="/wishlist" className="cart-icon-container">
                             <FcLike className="heart-icon" />
                             {wishlistCount > 0 && (
                               <span className="cart-count">{wishlistCount}</span>
                             )}
                           </Link> */}
                           {/* <Link to="/" className="navbar-link">
                             <FaHome /> Home
                           </Link>
                           <Link to="/about" className="navbar-link">
                             <FaInfoCircle /> About
                           </Link> */}
                         </div>
                       </div>
                     </nav>
    <div className="feedback-container">
         
      <h2>Submit Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Feedback</button>
      </form>
      {/* {feedbackStatus && <p>{feedbackStatus}</p>} */}
    </div>
    <FooterComponent/>
    </div>
  );
};

export default Feedback;
