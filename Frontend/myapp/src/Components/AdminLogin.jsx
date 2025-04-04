import React, { useState } from "react";
import axios from "axios";
import "./AdminLogin.css"; // Add your CSS file here
import { Link, useNavigate } from "react-router-dom";
import FooterComponent from "./Footer";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
   

    try {
      // API call to login the admin
      const response = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });
      const { token } = response.data;

      // Save token in localStorage
      localStorage.setItem("adminToken", token);
      alert("Login Successful");
      // Redirect to the admin dashboard
      window.location.href = "/admin";
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-wrapper">
       <nav className="navbar"> <div className="store-icon"> <Link to="/admin" className="navbar-brand"> 🛒 MyStore </Link> </div> <div className="navbar-links"> <div className="link-group">
               </div> </div> </nav>
    <div className="admin-login-container">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit} className="admin-login-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter admin email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div>
     
      </div>
    </div>
    <FooterComponent/>
    </div>
  );
};

export default AdminLogin;
