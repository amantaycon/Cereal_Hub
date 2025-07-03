import React, { use } from "react";
import "./css/HomePage.css";
import logo from "./assets/logo_main.png";
const baseUrl = import.meta.env.VITE_API_URL;
import FloatingProductForm from "./AddNewProduct";
import UseMeta from "./useMate";

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCSRFToken } from "./csrf";


const HomePage = () => {
  let userName = null;
  let user_id = null;
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    user_id = user.user_id;
    userName = user.username;
  }
  const navigate = useNavigate();

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


  const goToDetail = (id) => {
    navigate(`/product/${id}`);
  };

  const goToCart = () => {
    navigate("/user/cart");
  };

  const gotoLogin = () => {
    navigate("/user/login");
  };

  const [discss, setDiscss] = useState("display-none");
  const lognav = () => {
    if (discss === "display-none") {
      setDiscss("display-block");
    } else {
      setDiscss("display-none");
    }
  }

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/products/list/all/`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
          credentials: 'include', // important for sending cookies
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data.products || []); // Ensure data.products exists
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchProducts();
  }, []);

  // Function to add new product to the list
  const handleProductAdded = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const addToCart = (id, quantity) => {
    addCart(id, quantity);
  };

  UseMeta("Cereal Hub - Home","Welcome to Cereal Hub, your one-stop shop for all your cereal needs!");

  return (
    <>
      {userName === "amantaycon" && <FloatingProductForm onProductAdded={handleProductAdded} />}
      <div className="home-container">
        <header className="home-header">
          <div className="header-left">
            <h2 className="site-name" onClick={() => navigate("/")}>
              <div className="header-left">
                <img src={logo} alt="Cereal Hub" />
                <h1>Cereal Hub</h1>
              </div>
            </h2>
          </div>

          <div className="header-right">
            <button className="cart-icon" onClick={goToCart}>🛒</button>
            {user_id ? <button className="circle" onClick={lognav}><div className="profile-badge circle1">{userName[0].toUpperCase()}</div></button> : <button className="circle" onClick={gotoLogin}><img className="circle1" src="/image/login_logo.png" alt="login logo" /></button>}
            <ul className={`dropdown-menup ${discss}`}>
              <Link className="linktag" to="/user/account"><li className="listp">My Account</li></Link>
              <Link className="linktag" to="/user/logout"><li className="listp">Logout</li></Link>
            </ul>
          </div>
        </header>

        <div className="top-divider" />

        <div className="product-list">
          {products.map((product) => (
            <div
              className="product-card"
              key={product.id}
            >
              <div className="pointer" onClick={() => goToDetail(product.id)}>
              <img src={product.image} alt={product.name} className="product-image" />
              <h3>{product.name}</h3>
              <p className="price">{product.price}</p>
              <p className="description">{product.description}</p>
              </div>
              <button className="cart-button" onClick={() => addToCart(product.id, 1)}>🛒 Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
