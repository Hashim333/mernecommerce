import React from 'react';
import './About.css';
import Navbar from './Navbar';
import FooterComponent from './Footer';
import { FaHome, FaInfoCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className='home-wrapper'>
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
    <div className='div'>
      <p>About MyShop</p>
      <p>
        Welcome to <strong>MyShop</strong>, your one-stop e-commerce platform where you can find
        everything you need under one roof. Whether you're a buyer searching for the best deals or a
        seller looking to reach customers worldwide, MyShop is here to support you every step of the way.
      </p>
      
      <p><strong>Our Mission</strong></p>
      <p>
        At MyShop, we aim to provide an all-inclusive online marketplace that empowers users to buy and sell
        with ease. We believe everyone should have access to a platform where they can discover a diverse
        range of products—from daily essentials to exclusive items—and even have the opportunity to become
        a seller themselves.
      </p>

      <p><strong>Meet Our Team</strong></p>
      <p>
        Behind MyShop is a dedicated team of visionaries, including:
        <ul>
          <li><em>Ronaldo</em> – Head of Strategy and Growth</li>
          <li><em>Messi</em> – Lead of User Experience and Product Design</li>
          <li><em>Neymar</em> – Director of Customer Relations and Support</li>
        </ul>
        Our team combines global expertise with local insights to bring you a seamless shopping experience.
        We work hard to ensure you have access to the best products, reliable information, and excellent service.
      </p>

      <p><strong>Our Promise to You</strong></p>
      <p>
        We’re committed to offering <strong>24/7 customer support</strong> to assist with any questions,
        concerns, or needs. At MyShop, your satisfaction is our top priority, and our customer support
        team is always here to help.
      </p>

      <p><strong>Join Our Community</strong></p>
      <p>
        Explore all that MyShop has to offer, whether as a customer looking for great finds or a seller
        eager to grow your business. We invite you to join our community, where buying and selling is as
        enjoyable as it is rewarding.
      </p>
    </div>
    <div>
    <FooterComponent/>
    </div>
    </div>
  );
}
