import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { myContext } from "../Context";
import { SiSelenium } from "react-icons/si";
import { Link } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import { IoReorderFour } from "react-icons/io5";
import FooterComponent from "./Footer";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import "./UseProfile.css";
const UserProfile = () => {
  const { serverURL } = useContext(myContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false); // Password reset toggle

  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setEmail(response.data.user.email);
        setUsername(response.data.user.username);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data.");
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [serverURL, token, userId]);

  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(
        `${serverURL}/api/users/profile/users/${userId}`,
        { username, email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setUpdateSuccess("Profile updated successfully!");
        setUser({ ...user, username, email });
        setIsEditing(false);
      } else {
        setError(response.data.msg || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    }
  };

  const handlePasswordReset = async () => {
    try {
      const response = await axios.post(
        `${serverURL}/api/users/resetpassword`,
        { email, newPassword }
      );

      if (response.data.success) {
        setResetSuccess("Password reset successfully!");
        setNewPassword("");
        setIsResettingPassword(false); // Exit password reset mode
      } else {
        setError(response.data.msg || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      setError("Failed to reset password.");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <nav className="navbar">
              <div className="store-icon">
                <Link to="/" className="navbar-brand">
                  🛒 MyStore
                </Link>
              </div>
              <div className="navbar-links">
                <div className="link-group">
                
                {token && (
              <Link to="/sellerlogin" className="navbar-link">
                <SiSelenium />Be A Seller
              </Link>
            )}
                  
                  
                </div>
              </div>
            </nav>
    <div className="seller-profile-wrapper">
      

      <div className="profile-container">
        <h2>User Profile</h2>
        {user ? (
          <>
            <div className="profile-details">
              {!isEditing ? (
                <>
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label>
                      Username:
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter new username"
                        className="form-control"
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Email:
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter new email"
                        className="form-control"
                      />
                    </label>
                  </div>
                  <button
                    className="btn btn-success"
                    onClick={handleUpdateProfile}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              )}
              {updateSuccess && <p className="success-msg">{updateSuccess}</p>}
            </div>
          </>
        ) : (
          <p>User not found.</p>
        )}
      </div>

      <FooterComponent />
    </div>
    </div>
  );
};

export default UserProfile;
