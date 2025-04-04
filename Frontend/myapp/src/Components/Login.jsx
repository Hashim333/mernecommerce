import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { myContext } from "../Context";
import "./Login.css"; // Import the CSS
import FooterComponent from "./Footer";

function Login() {
  const { setUser, email, setEmail, password, setPassword, setIsLogedIn } = useContext(myContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/users/login", { email, password }, { timeout: 5000 })
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("authToken", res.data.token);
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userId", res.data.userId);
          setUser(res.data.user);
          navigate("/");
          setIsLogedIn(true);
          alert("Login successful");
        } else {
          alert("Enter valid credentials!");
        }
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.status === 400 ? "Incorrect password" : err.response.status === 404 ? "User not found" : "An error occurred. Please try again.");
        } else {
          console.error("Error during login:", err);
        }
      });
  };

  return (
    <div className="home-wrapper">
       <nav className="navbar">
                          <div className="store-icon">
                            <Link to="/" className="navbar-brand">
                              🛒 MyStore
                            </Link>
                          </div>
                          <div className="navbar-links">
                            <div className="link-group">
                            
                            {/* {token && (
                          <Link to="/sellerlogin" className="navbar-link">
                            <SiSelenium />Be A Seller
                          </Link>
                        )} */}
                              
                              {/* <Link to="/orderpage" className="navbar-link">
                            <CiDeliveryTruck />My Orders
                          </Link> */}
                            </div>
                          </div>
                        </nav>
    <div className="login-container">
      <div className="login-box">
        <h2 className="text-center mb-3">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="fw-bold">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              autoComplete="off"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="fw-bold">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>

        <div className="login-links">
          <p>
            Forgot Password?
            <Link to="/forgotpassword"> Click here</Link>
          </p>
          <Link to="/signup" className="btn btn-light border w-100">Sign Up</Link>
        </div>
      </div>
    </div>
   
     <div>
         <FooterComponent/>
         </div>
          </div>
  );
}

export default Login;
