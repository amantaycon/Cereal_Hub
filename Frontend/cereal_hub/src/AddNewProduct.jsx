import React, { useState } from "react";
import "./css/flotingaddnew.css";
const baseUrl = import.meta.env.VITE_API_URL;
import { getCSRFToken } from "./csrf";


const FloatingProductForm = ({ onProductAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    image: null,
    productName: "",
    price: "",
    description: "",
    extraDetails: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("image", formData.image);
    data.append("productName", formData.productName);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("extraDetails", formData.extraDetails);

    fetch(`${baseUrl}/products/add/new/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
      body: data,
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          console.log("Product submitted successfully:");
          if (onProductAdded) {
            onProductAdded(data.product); // Notify Dashboard
          }
        } else {
          console.error("Error submitting product:", data.message);
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });

    setFormData({
      image: null,
      productName: "",
      price: "",
      description: "",
      extraDetails: "",
    });
    setShowForm(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button className="open-btn" onClick={() => setShowForm(true)}>
        + Add Product
      </button>

      {/* Floating Form */}
      {showForm && (
        <div className="form-popup">
          <h2>Submit Product</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={formData.productName}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
            <textarea
              name="extraDetails"
              placeholder="Extra Details (optional)"
              rows="2"
              value={formData.extraDetails}
              onChange={handleChange}
            ></textarea>
            <button type="submit">Submit</button>
            <button
              type="button"
              className="close-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingProductForm;
