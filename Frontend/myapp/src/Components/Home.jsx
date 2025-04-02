import React, { useContext, useEffect, useState } from "react";
import { myContext } from "../Context";
import { Link } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import { FiHeart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUserAlt, FaInfoCircle } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";
import { SiSelenium } from "react-icons/si";
import "./Home.css";
import Navbar from "./Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRupeeSign } from "react-icons/fa";
import Carousel from "./Carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoMdContact } from "react-icons/io";
import Slider from "react-slick";

import FooterComponent from "./Footer";

export default function Home() {
  const {
    // newProdId,setProdId,
    product,
    // isInWishlist,
    setProduct,
    refreshCart,
    // handleAddToCart,
    // isInCart,
    serverURL,
    wishlist,
    setWishlist,
    currentUserId,
    cart,
    setCart,
    setCartCount,
    setWishlistCount,
    filteredData,
    user,
    isLOgedIn,
    // refreshWishlist,
    offers,
    setOffers,
    refreshWishllist,
  } = useContext(myContext);

  const isInCart = (productId) => {
    return cart.some((cartItem) => cartItem.product?._id === productId);
  };

  const isInWishlist = (productId) => {
    return wishlist.some((wish) => wish.productId?._id === productId);
  };
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 10000]);
  const [isAvailable, setIsAvailable] = useState(false);
  // Filtering Logic
  const filteredProducts = product
    .filter(
      (item) =>
        item.price >= selectedPriceRange[0] &&
        item.price <= selectedPriceRange[1]
    )
    .filter(
      (item) =>
        selectedCategory.toLowerCase() === "all" ||
        (selectedCategory
          ? item.category.toLowerCase() === selectedCategory.toLowerCase()
          : true)
    )
    .filter((item) => (isAvailable ? item.isAvailable : true));

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handlePriceChange = (e) => {
    const [min, max] = e.target.value.split("-");
    setSelectedPriceRange([Number(min) || 0, Number(max) || 0]);
  };

  // Toggle availability filter
  const toggleAvailability = () => {
    setIsAvailable((prev) => !prev);
  };
  const [selectedSize, setSelectedSize] = useState({});

  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   const currentUserId = localStorage.getItem("userId");

  //   if (!token || !currentUserId) {
  //     console.error("Token or currentUserId is missing");
      
  //   }
  // }, [token,currentUserId]);

  useEffect(() => {
    refreshCart();
  }, [token, currentUserId]);
  // useEffect(() => {
  //   refreshWishllist();
  // }, [token, currentUserId]);

  const handleSizeChange = (productId, size) => {
    setSelectedSize((prevSizes) => ({
      ...prevSizes,
      [productId]: size,
    }));
  };
  // console.log("nothing:", selectedSize);

  const handleAddToCart = async (productId) => {
    const userId = currentUserId;

    const size = selectedSize[productId];
    if (!token&&!currentUserId) {
      if (
        window.confirm(
          "You must log in to add items to the cart. Do you want to log in now?"
        )
      ) {
        navigate("/login");

        return;
      }
    }
    if (!size) {
      alert("Please select a size before adding to the cart.");
      return;
    }

    try {
      const addedDate = new Date().toISOString();
      const response = await axios.post(`${serverURL}/api/cart/add`, {
        userId: currentUserId,
        productId: productId,
        size,
        quantity: 1,
        addedDate,
      });
      if (response.status === 200) {
        setCart((prevCart) => {
          const updatedCart = [...prevCart, { productId, size, quantity: 1 }];

          // localStorage.setItem("cart", JSON.stringify(updatedCart));
          refreshCart();
          return updatedCart;
        });
        setCartCount((prevCount) => prevCount + 1);
        alert("Product added to cart successfully");
        // toast.success("Product added to cart!");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("Product already exists in the cart!");
      } else {
        console.log(error);
        // alert("Failed to add product to cart");
        // toast.error("Failed to add product!");
        alert("failed to add to cart,must check you were logged in !");
      }
    }
  };

  const renderSizeOptions = (sizes) => {
    // console.log("Sizes data:", sizes);
    if (!sizes || sizes.length === 0) {
      return <option disabled>No sizes available</option>;
    }

    return sizes
      .filter((size) => size.stock > 0)
      .map((size, index) => (
        <option key={index} value={size.size}>
          {size.size}
          {/* (Stock: {size.stock}) */}
        </option>
      ));
  };

  const handleAddToWishlist = async (productId) => {
    const userId = currentUserId;
    if (!token) {
      if (
        window.confirm(
          "You must log in to add items to the wshlist. Do you want to log in now?"
        )
      ) {
        navigate("/login");
        // <link to={'/sellerlogin'}></link>
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
        refreshWishllist();
        // Update wishlist state dynamically
        setWishlist((prevWishlist) => [...prevWishlist, { productId }]);
        setWishlistCount((prevCount) => prevCount + 1);

        // Success alert
        alert("Product added to wishlist successfully! 🎉");
        // toast.success("Product added to wishlist!");
      } else {
        console.warn("Unexpected response:", response);
      }
    } catch (error) {
      if (error.response) {
        //   if (error.response.status === 409) {
        //     // Conflict - Already in Wishlist
        //     alert("Product already exists in the wishlist!");
        // }
        if (error.response.status === 400) {
          // Bad Request - Missing data
          alert("Failed to add product. Missing required information.");
        } else if (error.response.status === 404) {
          // Product Not Found
          alert("Product not found. Please try again later.");
        } else {
          // Other server-side errors
          alert(`Failed to add product. ${error.response.data.message}`);
        }
      } else {
        console.error("Network/Unexpected Error:", error);
        // alert("Network error or unexpected issue occurred. ❌");
        toast.error("Failed to add product!");
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
      toast.error("Failed to remove product!");
    }
  };

  //   const productsToDisplay = filteredData.length > 0 ? filteredData : product;
  // const showFilters=filteredProducts>0?filteredProducts:productsToDisplay

  // const productsToDisplay = filteredData.length > 0 ? filteredData : product;
  const showFilters = filteredProducts.length > 0 ? filteredProducts : product;
  // productsToDisplay;

  return (
    <div className="home-wrapper container-fluid">
      <Navbar />
      <div className="sections-collection">
        {/* Filter Section */}
        <section className="section-1">
          {/* <label htmlFor="">
            Category:
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All</option>
              <option value="Men">Men</option>
              <option value="Women">women</option>
              <option value="Kids">Kids</option>
            </select>
          </label> */}
          <label className="form-label">
  Select Category:
  <select
    className="form-select form-select-lg rounded shadow"
    style={{ backgroundColor: "rgb(51 109 255", color: "#000" }}
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    <option value="all">All</option>
    <option value="Men">Men</option>
    <option value="Women">Women</option>
    <option value="Kids">Kids</option>
  </select>
</label>


          {/* <label>
            Price Range:
            <select onChange={handlePriceChange}>
              <option value="0-500">0 - 500</option>
              <option value="501-1000">501 - 1000</option>
              <option value="1001-1500">1001 - 1500</option>
              <option value="1501-2000">1501 - 2000</option>
              <option value="2001-2500">2001 - 2500</option>
              <option value="2501-3000">2501 - 3000</option>
              <option value="3001-3500">3001 - 3500</option>
              <option value="3501-4000">3501 - 4000</option>
              <option value="4001-4500">4001 - 4500</option>
              <option value="4501-5000">4501 - 5000</option>
              <option value="5001-10000">5001 - 10000</option>
            </select>
          </label> */}
          <label>
            Price Range:
            <span>
              {selectedPriceRange[0]} - {selectedPriceRange[1]}
            </span>
          </label>

          <div>
            <label>Min Price: </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={selectedPriceRange[0]}
              onChange={(e) => {
                const newMin = Number(e.target.value);
                if (newMin <= selectedPriceRange[1]) {
                  setSelectedPriceRange([newMin, selectedPriceRange[1]]);
                }
              }}
            />
            ${selectedPriceRange[0]}
          </div>
          <div>
            <label>Max Price: </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="500"
              value={selectedPriceRange[1]}
              onChange={(e) => {
                const newMax = Number(e.target.value);
                if (newMax >= selectedPriceRange[0]) {
                  setSelectedPriceRange([selectedPriceRange[0], newMax]);
                }
              }}
            />
            ${selectedPriceRange[1]}
          </div>
          {/* <div>
        Selected Price Range: ${selectedPriceRange[0]} - ${selectedPriceRange[1]}
      </div> */}
          <label>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={toggleAvailability}
            />
            Show Available Only
          </label>
        </section>
        <section className="section-2">
          <Carousel />
        </section>
      </div>

      <section className="product-list-section">
        {filteredData.length > 0 ? (
          <ul className="product-list">
  {filteredData.map((item) => (
    <div key={item._id} className="product-item">
      <Link to={`/product/${item._id}`} className="product-link">
        {/* <div className="product-image-container"> */}
          <img
            src={item.image}
            alt={`Variant - ${item.color}`}
            className="offer-image"
          />
        {/* </div>  */}
        {/* <div className="product-info"> */}
          <h4>{item.name}</h4>
          {/* <p className="fw-bold fs-4 text-primary">
            <FaRupeeSign />: {item.price}
          </p> */}
<p className="text-success fw-bold">
                          <FaRupeeSign />: {item.price}
                        </p>
          <p>Category: {item.category}</p>
        {/* </div> */}
      </Link>
      {/* <div className="product-actions"> */}
        <button
          className="add-to-wishlist"
          onClick={() =>
            isInWishlist(item._id)
              ? handleRemoveFromWishlist(item._id)
              : handleAddToWishlist(item._id)
          }
        >
          {isInWishlist(item._id) ? (
            <FcLike className="heart-icon" />
          ) : (
            <FiHeart className="heart-icon" />
          )}
        </button>

        <label htmlFor={`size-select-${item._id}`} className="form-label">
  {/* Select Size: */}
</label>
<select
  id={`size-select-${item._id}`}
  defaultValue=""
  value={selectedSize[item._id] || ""}
  onChange={(e) => handleSizeChange(item._id, e.target.value)}
  className="form-select mb-2"
>
  <option value="" disabled>
    Choose a size
  </option>
  {renderSizeOptions(item.sizes)}
</select>


        <button
          className="add-to-cart-button"
          onClick={() => handleAddToCart(item._id)}
        >
          {isInCart(item._id) ? (
            <BsCartCheckFill className="cart-icon" />
          ) : (
            <FaShoppingCart className="cart-icon" />
          )}
        </button>
      {/* </div> */}
    </div>
  ))}
</ul>

        ) : (
          <section className="product-list-section">
            {showFilters.length === 0 ? (
              <div>No products to display</div>
            ) : (
              <ul className="product-list">
                {showFilters.map((item) => {
                  return (
                    <div key={item._id} className="product-item">
                      <Link to={`/product/${item._id}`}>
                        <img
                          src={item.image}
                          alt={`Variant - ${item.color}`}
                          className="offer-image"
                        />
                        <h4>{item.name}</h4>
                        <p className="text-success fw-bold">
                          <FaRupeeSign />: {item.price}
                        </p>
                        <p>Category: {item.category}</p>
                      </Link>
                      <button
                        className="add-to-wishlist"
                        onClick={() =>
                          isInWishlist(item._id)
                            ? handleRemoveFromWishlist(item._id)
                            : handleAddToWishlist(item._id)
                        }
                      >
                        {isInWishlist(item._id) ? (
                          <FcLike className="heart-icon" />
                        ) : (
                          <FiHeart className="heart-icon" />
                        )}
                      </button>

                      <label htmlFor={`size-select-${item._id}`} className="form-label">
  {/* Select Size: */}
</label>
<select
  id={`size-select-${item._id}`}
  defaultValue=""
  value={selectedSize[item._id] || ""}
  onChange={(e) => handleSizeChange(item._id, e.target.value)}
  className="form-select mb-2"
>
  <option value="" disabled>
    Choose a size
  </option>
  {renderSizeOptions(item.sizes)}
</select>


                      <button
                        className="add-to-cart-button"
                        onClick={() => handleAddToCart(item._id)}
                      >
                        {isInCart(item._id) ? (
                          <BsCartCheckFill className="cart-icon" />
                        ) : (
                          <FaShoppingCart className="cart-icon" />
                        )}
                      </button>
                       
                    </div>
                  );
                })}
              </ul>
            )}
          </section>
        )}
      </section>
      <div>
        <FooterComponent/>
      </div>
    </div>
  );
}
