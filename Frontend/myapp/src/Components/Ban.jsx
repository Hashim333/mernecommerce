import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { FaInfoCircle, FaUserAlt } from 'react-icons/fa';
import { myContext } from '../Context';
import axios from 'axios';
import "./Ban.css";
import { GrAppsRounded } from "react-icons/gr";
import { FaHome, FaShoppingCart, FaUserAlt, FaInfoCircle } from 'react-icons/fa';
import { BiSolidLogInCircle } from "react-icons/bi";
import { MdManageAccounts } from "react-icons/md";
import { RiLogoutCircleFill } from "react-icons/ri";
import FooterComponent from './Footer';

export default function Ban() {
    const { user, setUser, serverURL } = useContext(myContext);
const [isLoggedIn, setAdminLogged] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminToken');
    if (loggedIn) {
      setAdminLogged(true);
    }
    
  }, []);
  
  const handleLogedin = () => {
    if (isLoggedIn) {
      localStorage.removeItem('adminToken');
      alert('You have logged out.');
    } else {
      alert('Redirecting to login page.');
    }
  };
    // useEffect(() => {
       
    //     async function fetchUsers() {
    //         try {
    //             const response = await axios.get(`${serverURL}/api/user/find`);
    //             setUser(response.data);
    //         } catch (error) {
    //             console.error('Error fetching users:', error);
    //         }
    //     }
    //     fetchUsers();
    // }, [ setUser]);
    const fetchUsers = async () => {
      try {
          const response = await axios.get(`${serverURL}/api/user/find`);
          setUser(response.data);
      } catch (error) {
          console.error('Error fetching users:', error);
      }
  };

  // Initial fetch on component load
  useEffect(() => {
      fetchUsers();
  }, []);

  async function handleBan(index) {
    try {
        const userId = user[index]._id; // Get the user's ID
        const response = await axios.patch(`${serverURL}/api/admin/users/${userId}/ban`);

        console.log("Response from server:", response.data);

        if (response.data.success) {
            
            const updatedData = user.map((user, i) => {
                if (i === index) {
                    return { ...user, banned: response.data.banned };
                }
                return user;
            });

            setUser(updatedData);
            fetchUsers();

            
            if (response.data.msg==="User banned") {
                alert(`${user[index].email} has been banned.`);
            } else {
                alert(`${user[index].email} has been unbanned.`);
            }
        }
    } catch (error) {
        console.error('Error updating ban status:', error);
        alert('An error occurred while updating the ban status. Please try again.');
    }
}




    return (
        <div className='ban-wraper'>
            <nav className="navbar">
                 <div className="store-icon">
                   <Link to="/admin" className="navbar-brand">🛒 MyStore</Link>
                 </div>
                
                 
                 <div className="navbar-links">
                   <div className="link-group">
                    
                     {/* <Link to="/ban" className="navbar-link">
                       <MdManageAccounts /> - Users
                     </Link> */}
                     {/* <Link to="/banseller" className="navbar-link">
                       <MdManageAccounts /> - Seller
                     </Link>
                     <Link to="/adminorder" className="navbar-link">
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

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(user || []).map((item, index) => (
                            <tr key={index}>
                                
                                <td>{item.email}</td>
                                <td>
                                    <button className="bn-btn" onClick={() => handleBan(index)}>
                                        {item.banned ? "Unban" : "Ban"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
            <FooterComponent/>
            </div>
        </div>
    );
}
