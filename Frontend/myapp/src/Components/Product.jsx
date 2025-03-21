import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { myContext } from "../Context";
import Navbar from "./Navbar";
import "./Prd.css";
import axios from "axios";
import { BsCartCheckFill } from "react-icons/bs";
import { FaHome, FaInfoCircle } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { FiHeart } from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import { MdRemoveShoppingCart } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import FooterComponent from "./Footer";
export default function Product() {
  const {
    serverURL,
    // handleAddToCart,
    product,
    wishlist,
    setWishlist,
    wishlistCount,
    refreshCart,
    refreshWishllist,
    cart,
    setCart,
    isInCart,
    cartCount,
    currentUserId,setWishlistCount,
    email,
    setCartCount,
    // handleAddToWishlist,
    token,
    isInWishlist,
  } = useContext(myContext);

  const [prd, setPrd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState(""); 
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${serverURL}/api/products/${id}`);
        setPrd(response.data);
      } catch (error) {
        setError("Failed to fetch product. Please try again.");
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, serverURL]);

  const handlebuy = () => {
    if (!token) {
      alert("Login first..");
      navigate("/login");
      return;
    }
    if (!selectedSize) {
      alert("Please select a size before proceeding.");
      return;
    }

  if (!prd) {
    alert("Product data is unavailable.");
    return;
  }
  if (!prd.sellerId) {
    alert("Seller information is missing for this product.");
    return;
  }
    navigate("/ordersuccess", {
      state: {
        productId: prd._id,
        sellerId:prd.sellerId._id,
        size: selectedSize,
        quantity: 1, // Default to 1, or let the user choose
        price: prd.price,
        productName: prd.name,
        image: prd.image,
      },
    });
  };

  
  
  const handleAddToWishlist = async (productId) => {
    const userId = currentUserId;
    if (!token) {
      if (window.confirm("You must log in to add items to the wshlist. Do you want to log in now?")) {
        navigate("/login"); 
        
        return; 
      }
    }
    try {
      const response = await axios.post(`${serverURL}/api/wishlist/add`, {
        userId,
        productId,
      });

      if (response.status === 200) {
        console.log("Item added to wishlist:", response.data);

        
        setWishlist((prevWishlist) => [...prevWishlist, { productId }]);
        setWishlistCount((prevCount) => prevCount + 1);

        
        alert("Product added to wishlist successfully! 🎉");
        refreshWishllist()
       
      } else {
        console.warn("Unexpected response:", response);
      }
    } catch (error) {
      if (error.response) {
     
         if (error.response.status === 400) {
          
          alert("Failed to add product. Missing required information.");
        } else if (error.response.status === 404) {
          
          alert("Product not found. Please try again later.");
        } else {
          
          alert(`Failed to add product. ${error.response.data.message}`);
        }
      } else {
        console.error("Network/Unexpected Error:", error);
        alert("Network error or unexpected issue occurred. ❌");
        // toast.error("Failed to add product!");
      }
    }
  };
  const handleRemoveFromWishlist = async (productId) => {
    const userId = currentUserId;

    if (!token) {
      if (
        window.confirm(
          "You must log in to manage your wishlist. Do you want to log in now?"
        )
      ) {
        navigate("/login");
        return;
      }
    }

    try {
      const response = await axios.delete(`${serverURL}/api/wishlist/remove`, {
        params: {
          userId,
          productId,
        },
      });

      if (response.status === 200) {
        console.log("Item removed from wishlist:", response.data);

        // Update wishlist state dynamically
        setWishlist((prevWishlist) =>
          prevWishlist.filter((item) => item.productId !== productId)
        );
        setWishlistCount((prevCount) => prevCount - 1);
        refreshWishllist();
        // Success alert
        alert("Product removed from wishlist successfully!");
      }
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      
    }
  };
  
  const handleAddToCart = async (productId) => {
    const userId = currentUserId;
    
    const size = selectedSize[productId];
    if (!token) {
      if (window.confirm("You must log in to add items to the cart. Do you want to log in now?")) {
        navigate("/login"); 
        
        
        return; 
      }
    }
    if (!selectedSize) {
      alert("Please select a size before adding to the cart.");
      return;
    }
  
    try {
      const addedDate = new Date().toISOString();
      const response = await axios.post(`${serverURL}/api/cart/add`, {
        userId:currentUserId,
        productId:productId,
        size:selectedSize,
        quantity: 1,
        addedDate,
      });
      if (response.status === 200) {
        setCart((prevCart) => {
          const updatedCart = [...prevCart, { productId, size, quantity: 1 }];
  
          // localStorage.setItem("cart", JSON.stringify(updatedCart));
  
          return updatedCart;
        });
        setCartCount((prevCount) => prevCount + 1);
        alert("Product added to cart successfully");
        refreshCart()
        // toast.success("Product added to cart!");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Product already exists in the cart!");
      } else {
        console.log(error);
        alert("Failed to add product to cart");
        // toast.error("Failed to add product!");
        // alert("failed to add to cart");
        }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!prd) return <div>Product not found!!!!</div>;

  return (
    <div className="product-page">
     <nav className="cart-navbar">
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
                 </Link>
                  <Link to="/cart" className="cart-icon-container">
                               <FaShoppingCart />
                               {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                               Cart
                             </Link> */}
                 {/* <Link to="/" className="navbar-link">
                   <FaHome /> Home
                 </Link> */}
                 {/* <Link to="/about" className="navbar-link">
                   <FaInfoCircle /> About
                 </Link> */}
               </div>
             </div>
           </nav>
     
      <div className="product-container">
        <div className="product-image-container-w">
          <img src={prd.image} alt={prd.name} className="product-image" />
          {/* Wishlist button */}
          <button
  className="wishlist-overlay "
  onClick={() =>
    isInWishlist(prd._id)
      ? handleRemoveFromWishlist(prd._id)
      : handleAddToWishlist(prd._id)
  }
>
  {isInWishlist(prd._id) ? (
    <FcLike className="heart-icon" />
  ) : (
    <FiHeart className="heart-icon" />
  )}
</button>;

        </div>
        <div className="product-details">
          {" "}
          <h2 className="product-name">{prd.name}</h2>{" "}
          <p className="product-price"><FaRupeeSign />: {prd.price}</p>{" "}
          <p className="product-category"> {prd.category}</p>{" "}
          <p className="product-quantity"> {prd.subCategory}</p>{" "}
          <p className="product-quantity"> {prd.description }</p>{" "}
          <p className="product-quantity"> {prd.tags}</p>{" "}
          <p className="product-quantity">Colour: {prd.color}</p>{" "}

{/* Size Selection */}
<div className="product-size-selection">
            <h4>Select Size:</h4>
            <div className="size-options">
              {prd.sizes.map((sizeObj) => (
                <button
                  key={sizeObj.size}
                  disabled={sizeObj.stock === 0}
                  className={`size-button ${selectedSize === sizeObj.size ? "selected" : ""}`}
                  onClick={() => setSelectedSize(sizeObj.size)}
                >
                  {sizeObj.size} {sizeObj.stock === 0 ? "(Out of Stock)" : ""}
                </button>
              ))}
            </div>
          </div>

          <div className="product-actions">
          
            {/* <button
              onClick={() => handleWishlist(prd)}
              className={`add-to-wishlist ${
                wishlist.some((wishlistItem) => wishlistItem._id === prd._id)
                  ? "added"
                  : ""
              }`}
            >
              {" "}
              {wishlist.some((wishlistItem) => wishlistItem._id === prd._id) ? (
                <FcLike className="heart-icon" />
              ) : (
                <FiHeart className="heart-icon" />
              )}{" "}
            </button>{" "} */}
            
            {/* <button
              onClick={() => handleAddToCart(prd)}
              className={`add-to-cart-button ${
                cart.some((cartItem) => cartItem.productId === prd._id)
                  ? "added"
                  : ""
              }`}
            >
             
              {cart.some((cartItem) => cartItem.productId === prd._id) ? (
                <MdRemoveShoppingCart className="cart-icon" />
              ) : (
                <FaShoppingCart className="cart-icon" />
              )}
            </button> */}
             <button
                    className="add-to-cart-button-p"
                    onClick={() => handleAddToCart(prd._id)}
                  >
                    {isInCart(prd._id) ? (
                      <BsCartCheckFill className="cart-icon" />
                    ) : (
                      <FaShoppingCart className="cart-icon" />
                    )}
                  </button>
            <button className="buy-button" onClick={() => handlebuy(prd)}>
              
              Buy
            </button>
          </div>
        </div>
      </div>
      
       {/* <div className="related-products">
        <h3>Related Products</h3>
        <div className="related-products-grid">
          {relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct._id}
              className="related-product-item"
              onClick={() => navigate(`/product/${relatedProduct._id}`)}
            >
              <img
                src={relatedProduct.image}
                alt={relatedProduct.name}
                className="related-product-image"
              />
              <p className="related-product-name">{relatedProduct.name}</p>
              <p className="related-product-price">
                <FaRupeeSign /> {relatedProduct.price}
              </p>
            </div>
          ))}
        </div>
        </div> */}
        <div className="product-list-section-e">
  <h3>Related Products</h3>
  <div className="wrapper">
  <div className="product-list-e">
    {product
      .filter((item) => item.category === prd.category && item._id !== prd._id)
      .map((item) => (
        <div key={item._id} className="product-item-e">
          <Link to={`/product/${item._id}`}>
          <img
            src={item.image}
            alt={item.name}
            className="related-product-image"
            onClick={() => navigate(`/product/${item._id}`)} // Navigate to the selected product
          />
          <h4 className="related-product-name">{item.name}</h4>
          <p className="related-product-price">
            <FaRupeeSign /> {item.price}
          </p>
          </Link>
          {/* <button
            className="add-to-cart-button"
            onClick={() => handleAddToCart(item._id)}
          >
            Add to Cart
          </button> */}
        </div>
      ))}
  </div>
  </div>
</div>

      <div>
      <FooterComponent/>
      </div>
    </div>
  );
}
