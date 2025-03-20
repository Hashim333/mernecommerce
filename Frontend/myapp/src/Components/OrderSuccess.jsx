import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaInfoCircle, FaUserAlt } from "react-icons/fa";
import { myContext } from "../Context";
import "./OrderSuccess.css";
import FooterComponent from "./Footer";

const OrderSuccess = () => {
  const { currentUserId, isLoggedIn } = useContext(myContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Extract product data from location state
  const { productId, sellerId, productName, image, size, quantity, price } = location.state || {};

  useEffect(() => {
    // Redirect if product data is missing
    if (!productId) {
      alert("Product information is missing. Redirecting to homepage.");
      navigate("/");
    }

    // Fetch saved addresses
    if (currentUserId) {
      fetchSavedAddresses();
    }
  }, [currentUserId, navigate, productId]);

  const fetchSavedAddresses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/address/get/${currentUserId}`);
      setSavedAddresses(response.data.address || []);
    } catch (error) {
      console.error("Failed to fetch saved addresses:", error);
    }
  };

  const handleSaveNewAddress = async () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  // const handleSelectAddress = (addressId) => {
  //   setSelectedAddressId(addressId);
  //   alert("Address selected successfully!");
  // };
  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    alert("Address selected successfully!");
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select or add a shipping address.");
      return;
    }

    const selectedAddress = savedAddresses.find((addr) => addr._id === selectedAddressId);
    if (!selectedAddress) {
      alert("Invalid address selected.");
      return;
    }

    const orderData = {
      userId: currentUserId,
      productId,
      sellerId,
      quantity,
      size,
      totalAmount:finalAmount,
      paymentMethod,
      shippingAddress: selectedAddress,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/users/singleOrder", orderData);
      if (response.status === 200) {
        alert("Order placed successfully!");
        navigate("/orderpage", { state: { order: response.data } });
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const handleLogout = () => {
    if (isLoggedIn) {
      localStorage.clear();
      alert("You have logged out.");
      navigate("/login");
    }
  };
  const deliveryFee = 55;
  const totalPrice = price * quantity; 
  const finalAmount = totalPrice + deliveryFee; 
  return (
    <div className="order-success-page">
      <nav className="navbar">
        <div className="store-icon">
          <Link to="/" className="navbar-brand">🛒 MyStore</Link>
        </div>
        <div className="navbar-links">
          <Link to="/about" className="navbar-link">
            <FaInfoCircle /> About
          </Link>
          <Link to="/userprofile" className="navbar-link">
            <FaUserAlt /> Profile
          </Link>
        </div>
      </nav>

      <div className="order-summary card mb-4">
      <div className="card-body">
        <h4 className="card-title">Order Summary</h4>
        <div className="d-flex align-items-center gap-3">
          <img 
            src={image} 
            alt={productName} 
            className="img-fluid order-image" 
            style={{ width: "80px", height: "130px", marginRight: "15px" }} 
          />
          <p className="mb-0"><strong>{productName}</strong></p>
          <p className="mb-0"><strong>Size: {size}</strong></p>
          <p className="mb-0"><strong>Quantity: {quantity}</strong></p>
        </div>

        {/* Display pricing details including delivery fee */}
        <div className="pricing-details mt-3">
          <p><strong>Product Price: ₹{totalPrice}</strong></p>
          <p><strong>Delivery Fee: ₹{deliveryFee}</strong></p>
          <p><strong>Total Amount: ₹{finalAmount}</strong></p>
        </div>
      </div>
    </div>



  <div className="shipping-section card mb-4">
  <div className="card-body">
    <h4 className="card-title">Shipping Address</h4>
    {savedAddresses.length > 0 ? (
      <div className="row">
        {savedAddresses.map((address) => (
          <div key={address._id} className="col-md-4 mb-3">
            <div className="card address-card p-2">
              <p><strong>{address.addressLine1}</strong></p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p>
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p>{address.country}</p>
              <button
                className={`btn ${selectedAddressId === address._id ? "btn-success" : "btn-primary"} btn-sm mt-2`}
                onClick={() => handleSelectAddress(address._id)}
              >
                {selectedAddressId === address._id ? "Selected" : "Select Address"}
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>No saved addresses. Please add a new address.</p>
    )}

    {showAddressForm && (
      <form className="address-form mt-3">
        <input
          type="text"
          name="addressLine1"
          placeholder="Address Line 1"
          value={shippingAddress.addressLine1}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="addressLine2"
          placeholder="Address Line 2"
          value={shippingAddress.addressLine2}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingAddress.city}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={shippingAddress.state}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shippingAddress.postalCode}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={shippingAddress.country}
          onChange={handleInputChange}
          required
        />
        <button
          type="button"
          className="btn btn-success mt-2"
          onClick={handleSaveNewAddress}
        >
          Save Address
        </button>
      </form>
    )}

    <button
      className="btn btn-outline-primary mt-3"
      onClick={() => setShowAddressForm(!showAddressForm)}
    >
      {showAddressForm ? "Cancel" : "Add New Address"}
    </button>
  </div>
</div>


  <div className="payment-section card mb-4">
    <div className="card-body">
      <h4 className="card-title">Payment Method</h4>
      <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="Cash on Delivery">Cash on Delivery</option>
        <option value="Credit Card">Credit Card</option>
        <option value="PayPal">PayPal</option>
      </select>
    </div>
  </div>
     <button className="place-order-button btn btn-success w-100" onClick={handlePlaceOrder}>
    Place Order
  </button>
  <div>
  <FooterComponent/>
  </div>
    </div>
  );
};

export default OrderSuccess;
