import React from "react";
import { Link } from "react-router-dom";
import "./Policy.css"
const TermsAndConditions = () => {
  return (
    <div className="home-wrapper">
      <nav className="cart-navbar">
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
                             </Link>
                              <Link to="/cart" className="cart-icon-container">
                                           <FaShoppingCart />
                                           {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                                           Cart
                                         </Link> */}
                        {/* <Link to="/" className="navbar-link">
                               <FaHome /> Home
                             </Link> */}
                        {/* <Link to="/about" className="navbar-link">
                               <FaInfoCircle /> About
                             </Link> */}
                      </div>
                    </div>
                  </nav>
    <div className="privacy-policy-wrapper">
      <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
      <p className="mb-4">Welcome to our website. By accessing or using our services, you agree to be bound by the following terms and conditions.</p>
      
      <h2 className="text-2xl font-semibold mt-6">1. Use of Our Service</h2>
      <p className="mb-4">You agree to use our services only for lawful purposes and in accordance with these terms.</p>
      
      <h2 className="text-2xl font-semibold mt-6">2. Account Responsibility</h2>
      <p className="mb-4">You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
      
      <h2 className="text-2xl font-semibold mt-6">3. Prohibited Activities</h2>
      <p className="mb-4">You may not engage in any activity that is illegal, fraudulent, or harms our services or other users.</p>
      
      <h2 className="text-2xl font-semibold mt-6">4. Intellectual Property</h2>
      <p className="mb-4">All content, trademarks, and logos are the property of our company and may not be used without permission.</p>
      
      <h2 className="text-2xl font-semibold mt-6">5. Limitation of Liability</h2>
      <p className="mb-4">We are not responsible for any indirect, incidental, or consequential damages arising from your use of our services.</p>
      
      <h2 className="text-2xl font-semibold mt-6">6. Changes to Terms</h2>
      <p className="mb-4">We reserve the right to update these terms at any time. Continued use of our services constitutes acceptance of the updated terms.</p>
      
      <h2 className="text-2xl font-semibold mt-6">7. Governing Law</h2>
      <p className="mb-4">These terms are governed by the laws of your jurisdiction and any disputes will be resolved in accordance with those laws.</p>
      
      <h2 className="text-2xl font-semibold mt-6">8. Contact Information</h2>
      <p>If you have any questions regarding these terms, please contact us at support@example.com.</p>
    </div></div>
  );
};

export default TermsAndConditions;
