import React, { useState } from "react";
import "./Contact.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import FooterComponent from "./Footer";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [message, setMessage] = useState(""); // To show success or error messages
  const [isError, setIsError] = useState(false); // Flag to indicate if the message is an error

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const { name, email, subject, message } = formData;
    const emailRegex = /\S+@\S+\.\S+/;

    if (!name || !email || !subject || !message) {
      setMessage("All fields are required.");
      setIsError(true);
      return;
    }

    if (!emailRegex.test(email)) {
      setMessage("Invalid email format. Please enter a valid email address.");
      setIsError(true);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/users/contact", formData);

      if (response.status === 200) {
        alert("Your message has been sent successfullly!")
        setMessage("Your message has been sent successfully!");
        setIsError(false);
        setFormData({ name: "", email: "", subject: "", message: "" }); // Clear the form
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setMessage("Something went wrong. Please try again later.");
      setIsError(true);
    }
  };

  return (
    <div className="home-wrapper">
      <nav className="cart-navbar">
        <div className="cart-store-icon">
          <Link to="/" className="navbar-brand">
            🛒 MyStore
          </Link>
        </div>
      </nav>

      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Reach out to us using the form below or via our contact information.</p>

        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              placeholder="Enter subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              placeholder="Enter your message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>

        {/* Success/Error Message */}
        {message && (
          <p className={isError ? "error-message" : "success-message"}>
            {message}
          </p>
        )}

        {/* Contact Info */}
        <div className="contact-info">
          <h3>Contact Information</h3>
          <p>Email: support@ecommerce.com</p>
          <p>Phone: +1 234 567 890</p>
          <p>Address: 123 E-Commerce Street, Tech City, TX 78901</p>
        </div>

        {/* Social Media Links */}
        <div className="social-media">
          <h3>Follow Us</h3>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
<div>
      <FooterComponent />
      </div>
    </div>
  );
};

export default Contact;
