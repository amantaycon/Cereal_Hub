import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/ProductDetail.css";
import logo from "./assets/logo_main.png";
const baseUrl = import.meta.env.VITE_API_URL;
import { getCSRFToken } from "./csrf";




const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  

  const addCart = (id, quantity) => {
    const product = {
      productId: id,
      quantity: quantity,
    }
    fetch(`${baseUrl}/cart/add/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      body: JSON.stringify(product),
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Product added to cart:");
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  }


  useEffect(() => {
    fetch(`${baseUrl}/products/${id}/`, {
      method: "GET"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((found) => {
        // Ensure the product has all required fields
        found = found.product;
        const completeProduct = {
          id: found.id,
          name: found.name || "Unknown Product",
          price: found.price || 0,
          description: found.description || "No description available",
          extra_info: found.extra_info || "No additional information available",
          image: found.image || "default_image_url.jpg",
          quality: found.quality || "N/A",
          origin: found.origin || "N/A",
          ingredients: found.ingredients || "N/A",
          shelfLife: found.shelfLife || "N/A"
        };
        setProduct(completeProduct);
        document.title = found.name+' | Cereal Hub';
        document.querySelector('meta[name="description"]').setAttribute('content', found.description);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        navigate("/"); // Redirect to home if product not found
      });
  }, [id]);

  const addToCart = () => {
    addCart(id, quantity);
  };

  const buyNow = () => {
    navigate("/user/cart");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail-page">
      <header className="top-bar">
        <h1 className="logo" onClick={() => navigate("/")}><div className="header-left">
          <img src={logo} alt="Cereal Hub" />
          <h1>Cereal Hub</h1>
        </div></h1>
        <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>
      </header>

      <div className="product-container">
        <div className="image-section">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="info-section">
          <h2>{product.name}</h2>
          <p className="price">₹{product.price}</p>
          <p className="description">{product.description}</p>

          <ul className="details">
            <li><strong>Extra Info:</strong> {product.extra_info}</li>
            <li><strong>Origin:</strong> {product.origin}</li>
            <li><strong>Ingredients:</strong> {product.ingredients}</li>
            <li><strong>Shelf Life:</strong> {product.shelfLife}</li>
          </ul>

          <div className="quantity-select">
            <button onClick={() => quantity > 1 && setQuantity(quantity - 1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div className="action-buttons">
            <button className="add-to-cart" onClick={addToCart}>Add to Cart</button>
            <button className="buy-now" onClick={buyNow}>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
