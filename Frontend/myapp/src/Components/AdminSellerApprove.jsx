import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminSellerApprove() {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    fetchSellers();
  }, []);
  const rejectSeller = async (sellerId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/reject/${sellerId}`);
      alert("Seller rejected!");
      fetchSellers(); // Refresh list
    } catch (error) {
      console.error("Error rejecting seller:", error);
    }
  };
  
  // Fetch unapproved sellers
  const fetchSellers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/unapproved"
      );
      setSellers(response.data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  // Approve seller function
  const approveSeller = async (sellerId) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/approve/${sellerId}`);
      alert("Seller approved!");
      fetchSellers(); // Refresh list
    } catch (error) {
      console.error("Error approving seller:", error);
    }
  };

  return (
    <div className="home-wrapper">
      <nav className="navbar">
        <div className="store-icon">
          <Link to="/admin" className="navbar-brand">
            🛒 MyStore
          </Link>
        </div>

        <div className="navbar-links">
          <div className="link-group"></div>
        </div>
      </nav>
      <div className="admin-sellers">
        <h2>Pending Seller Approvals</h2>
        {sellers.length > 0 ? (
          <ul>
            {sellers.map((seller) => (
              <li key={seller._id}>
                <p>
                  <strong>Name:</strong> {seller.name}
                </p>
                <p>
                  <strong>Email:</strong> {seller.email}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => approveSeller(seller._id)}
                >
                  Approve
                </button>
                <button className="btn btn-danger" onClick={() => rejectSeller(seller._id)}>Reject</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No details found.</p>
        )}
      </div>
    </div>
  );
}
