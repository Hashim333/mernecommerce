import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCartPlus, FaUserAlt, FaHome } from "react-icons/fa";
import { myContext } from "../Context";
import "./CheckoutPage.css";
import { FaInfoCircle } from "react-icons/fa";
import FooterComponent from "./Footer";
export default function CheckoutPage({ cartItems, totalAmount }) {
  const { currentUserId, isLoggedIn } = useContext(myContext);
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
   useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const location = useLocation();
  const { selectedItems, totalPrice } = location.state || { selectedItems: [], totalPrice: 0 };

  const DELIVERY_FEE = 55;
  // const finalTotalAmount = totalPrice + DELIVERY_FEE; 

  // const finalTotalAmount = Number(totalPrice) + DELIVERY_FEE;
  const [finalTotalAmount, setFinalTotalAmount] = useState(0);

useEffect(() => {
  setFinalTotalAmount(Number(totalPrice) + DELIVERY_FEE);
}, [totalPrice]);


  // Fetch saved addresses
  useEffect(() => {
    if (currentUserId) {
      fetchSavedAddresses();
    }
  }, [currentUserId]);

  const fetchSavedAddresses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/address/get/${currentUserId}`);
      setSavedAddresses(response.data.address || []);
    } catch (error) {
      console.error("Failed to fetch saved addresses:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const saveNewAddress = async () => {
    try {
      await axios.post(`http://localhost:5000/api/users/${currentUserId}/address`, shippingAddress);
      alert("Address added successfully!");
      setShowAddressForm(false);
      fetchSavedAddresses();
    } catch (error) {
      console.error("Failed to save address:", error);
      alert("Failed to save the address. Please try again.");
    }
  };
  console.log("Final Total Amount:", finalTotalAmount);

  const handleOrderSubmit = async () => {
    const finalShippingAddress = selectedAddress || shippingAddress;

    if (
      !finalShippingAddress.addressLine1 ||
      !finalShippingAddress.city ||
      !finalShippingAddress.state ||
      !finalShippingAddress.postalCode ||
      !finalShippingAddress.country
    ) {
      alert("Please select or fill in all required fields for the shipping address.");
      return;
    }

    const orderData = {
      userId: currentUserId,
      products: selectedItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        sellerId: item.product.sellerId,
        size: item.size,
        price: item.product.price,
      })),
      totalAmount: finalTotalAmount,
      paymentMethod: paymentMethod,
      shippingAddress: finalShippingAddress,
    };
    // console.log(orderData);

    try {
      const response = await axios.post("http://localhost:5000/api/users/neworder", orderData);
      alert("Order placed successfully!");
      navigate("/orderpage", { state: { orderId: response.data._id } });
    } catch (error) {
      console.error("Order creation failed:", error);
    }
  };

  return (
    <div className="home-wrapper">
      {/* Navbar */}
     <nav className="navbar">
             <div className="store-icon">
               <Link to="/" className="navbar-brand">🛒 MyStore</Link>
             </div>
             <div className="navbar-links">
               {/* <Link to="/about" className="navbar-link">
                 <FaInfoCircle /> About
               </Link>
               <Link to="/userprofile" className="navbar-link">
                 <FaUserAlt /> Profile
               </Link> */}
             </div>
           </nav>

      {/* Checkout Content */}
      <h1 className="checkout-title">Checkout</h1>

      {/* Address Selection */}
      <div className="total-summary">
        <h2>Order Summary</h2>
        <p>Subtotal: ${totalPrice.toFixed(2)}</p>
        <p>Delivery Fee: ${DELIVERY_FEE.toFixed(2)}</p>
        <h3>Total Amount: ${finalTotalAmount.toFixed(2)}</h3>
      </div>
      <div className="mb-4">
    <h2>Shipping Address</h2>
    <div className="row gy-3">
      {savedAddresses.map((address, index) => (
        <div className="col-md-4" key={index}>
          <div
            className={`card ${selectedAddress === address ? "border-primary" : ""}`}
            onClick={() => setSelectedAddress(address)}
          >
            <div className="card-body">
              <p>{address.addressLine1}</p>
              <p>{address.addressLine2}</p>
              <p>
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p>{address.country}</p>
              <button
                className={`btn ${
                  selectedAddress === address ? "btn-primary" : "btn-outline-primary"
                }`}
              >
                {selectedAddress === address ? "Selected" : "Select"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
    <button
      onClick={() => setShowAddressForm(true)}
      className="btn btn-success mt-3"
    >
      Add New Address
    </button>
  </div>

  {/* Address Form */}
  {showAddressForm && (
    <div className="card p-3 mb-4">
      <h2>Add Address</h2>
      <div className="row gy-3">
        {["addressLine1", "addressLine2", "city", "state", "postalCode", "country"].map(
          (field, index) => (
            <div className="col-md-6" key={index}>
              <label className="form-label">
                {field.replace(/([A-Z])/g, " $1")}:
              </label>
              <input
                type="text"
                name={field}
                value={shippingAddress[field]}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          )
        )}
      </div>
      <div className="mt-3">
        <button onClick={saveNewAddress} className="btn btn-primary me-2">
          Save Address
        </button>
        <button
          onClick={() => setShowAddressForm(false)}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  )}

  {/* Payment Method */}
  <div className="mb-4">
    <h2>Payment Method</h2>
    <select
      value={paymentMethod}
      onChange={(e) => setPaymentMethod(e.target.value)}
      className="form-select"
    >
      <option value="Credit Card">Credit Card</option>
      <option value="PayPal">PayPal</option>
      <option value="Cash on Delivery">Cash on Delivery</option>
    </select>
  </div>

  {/* Place Order */}
  <button onClick={handleOrderSubmit} className="btn btn-primary btn-lg w-100">
    Place Order
  </button>
  <div>
  <FooterComponent/>
  </div>
</div>
  );
}
