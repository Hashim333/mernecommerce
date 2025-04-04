import React from "react";
import { Link } from "react-router-dom";
import "./Policy.css"
const PrivacyPolicy = () => {
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


      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
      
      <h2 className="text-2xl font-semibold mt-6">1. Information We Collect</h2>
      <p className="mb-4">We collect personal information that you provide to us, such as name, email, and contact details when you sign up or interact with our services.</p>
      
      <h2 className="text-2xl font-semibold mt-6">2. How We Use Your Information</h2>
      <p className="mb-4">We use your information to provide, maintain, and improve our services, communicate with you, and ensure security.</p>
      
      <h2 className="text-2xl font-semibold mt-6">3. Sharing of Information</h2>
      <p className="mb-4">We do not sell or share your personal data with third parties except as required by law or with your consent.</p>
      
      <h2 className="text-2xl font-semibold mt-6">4. Cookies and Tracking</h2>
      <p className="mb-4">We may use cookies to enhance your browsing experience and analyze website traffic.</p>
      
      <h2 className="text-2xl font-semibold mt-6">5. Your Rights</h2>
      <p className="mb-4">You have the right to access, update, or delete your personal information. Contact us for any requests.</p>
      
      <h2 className="text-2xl font-semibold mt-6">6. Changes to this Policy</h2>
      <p className="mb-4">We may update this policy from time to time. Please check this page periodically for changes.</p>
      
      <h2 className="text-2xl font-semibold mt-6">7. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at support@example.com.</p>
    </div></div>
  );
};

export default PrivacyPolicy;
