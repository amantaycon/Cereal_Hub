import { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import UseMeta from "./useMate";
import "./css/cart.css";
import logo from "./assets/logo_main.png";
const baseUrl = import.meta.env.VITE_API_URL;
import axios from "axios";
import { getCSRFToken } from "./csrf";



const CartPage = () => {
    UseMeta('Cart | Cereal Hub',"Cart Page");

    const [cart, setCart] = useState([]);
    const [address, setAddress] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`${baseUrl}/cart/getall/`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            "X-CSRFToken": getCSRFToken(),
                        },
                    });
                setCart(response.data);
            }
            catch (error) {
                console.error("Error fetching cart data:", error);
                // Handle error, e.g., show a notification or set an empty cart
                setCart([]);
            }
        };
        fetchCart();
    }, []);



    const updateQuantity = (id, delta) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePayment = () => {
        alert("Proceeding to payment...");
    };

    const removeItem = async (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
        try {
            const response = await axios.post(`${baseUrl}/cart/remove/`, { productId: id }, {
                headers: {
                    'Content-Type': 'application/json',
                    "X-CSRFToken": getCSRFToken(),
                },
            })

        }
        catch (error) {
            console.error("Error removing item from cart:", error);
            // Handle error, e.g., show a notification
        }
    };


    return (
        <div className="cart-container">
            <div className="cart-header">
                <h2 className="site-name" onClick={() => navigate("/")}>
                    <div className="header-left">
                        <img src={logo} alt="Cereal Hub" />
                        <h1>Cereal Hub</h1>
                    </div>
                </h2>
                <button className="back-button" onClick={() => navigate(-1)}>
                    ⬅ Back
                </button>
            </div>
            <h2>Your Cart 🛒</h2>

            <div className="cart-content">
                <div className="cart-products">
                    {cart.map((item) => (
                        <div className="cart-item" key={item.id}>
                            <img src={item.image} alt={item.name} />
                            <div className="item-info">
                                <h4>{item.name}</h4>
                                <p>Price: ₹{item.price}</p>
                                <div className="quantity-controls">
                                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                </div>
                                <button className="remove-button" onClick={() => removeItem(item.id)}>
                                    Remove ❌
                                </button>
                            </div>
                            <div className="item-total">₹{item.price * item.quantity}</div>
                        </div>

                    ))}

                    <h3 className="total">Total: ₹{total}</h3>
                </div>

                <div className="cart-form">
                    <h4>Shipping Address 📍</h4>
                    <textarea
                        rows="4"
                        placeholder="Enter your full address..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />

                    <button className="pay-button" onClick={handlePayment}>
                        Proceed to Payment 💳
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
