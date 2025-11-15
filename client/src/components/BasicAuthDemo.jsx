import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function BasicAuthCRUD() {
  const [credentials, setCredentials] = useState({ username: "admin", password: "password123" });
  const [productList, setProductList] = useState([]);
  const [productForm, setProductForm] = useState({ name: "", category: "", price: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const [message, setMessage] = useState("");

  // ===== Helper for Auth Header =====
  const getAuthHeader = () => ({
    Authorization: `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`,
  });

  // ===== Fetch All Products =====
  const fetchProducts = async () => {
    setMessage("");
    try {
      const response = await axiosInstance.get("/basicAuth/get", { headers: getAuthHeader() });
      setProductList(response.data);
    } catch (error) {
      if (error.status == 401) {
        setMessage("Incorrect Credentials: You are not Authorized");
      }
      console.error("Error fetching products:", error);
    }
  };

  const refreshProducts = async () => {
    setProductList([]);
    fetchProducts();
  };


  // ===== Add Product =====
  const handleAddProduct = async () => {
    try {
      await axiosInstance.post("/basicAuth/add", productForm, { headers: getAuthHeader() });
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // ===== Select Product for Editing =====
  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditProductId(product._id);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
    });
  };

  // ===== Update Product =====
  const handleUpdateProduct = async () => {
    try {
      await axiosInstance.patch(`/basicAuth/update/${editProductId}`, productForm, {
        headers: getAuthHeader(),
      });
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // ===== Delete Product =====
  const handleDeleteProduct = async (id) => {
    try {
      await axiosInstance.delete(`/basicAuth/delete/${id}`, { headers: getAuthHeader() });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // ===== Reset Form =====
  const resetForm = () => {
    setIsEditing(false);
    setEditProductId(null);
    setProductForm({ name: "", category: "", price: "" });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ===== JSX =====
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">🔐 Basic Auth CRUD</h2>

      {/* --- Auth Inputs --- */}
      <div className="flex gap-3 mb-8">
        <input
          className="border p-2 rounded flex-1"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          placeholder="Username"
        />
        <input
          className="border p-2 rounded flex-1"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          placeholder="Password"
          type="password"
        />
      </div>

      {/* --- Product Form --- */}
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-3">{isEditing ? "✏️ Update Product" : "➕ Add Product"}</h3>
        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 rounded flex-1"
            placeholder="Product Name"
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
          />
          <input
            className="border p-2 rounded flex-1"
            placeholder="Category"
            value={productForm.category}
            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
          />
          <input
            className="border p-2 rounded w-24"
            placeholder="Price"
            value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
            type="number"
          />
          {!isEditing ? (
            <button className="bg-green-600 text-white px-4 rounded" onClick={handleAddProduct}>
              Add
            </button>
          ) : (
            <>
              <button className="bg-yellow-500 text-white px-4 rounded" onClick={handleUpdateProduct}>
                Update
              </button>
              <button className="bg-gray-500 text-white px-4 rounded" onClick={resetForm}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- Product List --- */}
      <div className="flex gap-2 mb-3">
        <h3 className="text-lg font-semibold">📦 Products</h3>
        <button className="bg-gray-500 text-white px-3 rounded" onClick={refreshProducts}>Refresh</button>
      </div>
      <ul className="space-y-2">
        {productList.map((product) => (
          <li key={product._id} className="border p-3 rounded flex justify-between items-center">
            <span>
              {product.name} - {product.category} - ₹{product.price}
            </span>
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-3 rounded"
                onClick={() => handleEditClick(product)}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 rounded"
                onClick={() => handleDeleteProduct(product._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {message && <p>{message}</p>}
    </div>
  );
}
