import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminSellerApprove() {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    fetchSellers();
  }, []);

  // Fetch unapproved sellers
  const fetchSellers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/unapproved");
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
    <div className="admin-sellers">
      <h2>Pending Seller Approvals</h2>
      { sellers.length > 0 ? (
    <ul>
      {sellers.map((seller) => (
        <li key={seller._id}>
          <p><strong>Name:</strong> {seller.name}</p>
          <p><strong>Email:</strong> {seller.email}</p>
          <button className="btn btn-primary" onClick={() => approveSeller(seller._id)}>Approve</button>
        </li>
      ))}
    </ul>
  ) : (
    <p>No details found.</p>
  )
}

    </div>
    </div>
  );
}
