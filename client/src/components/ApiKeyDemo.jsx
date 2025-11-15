import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function ApiKeyCRUD() {
  const [apiKey, setApiKey] = useState("my-secret-api-key");
  const [productList, setProductList] = useState([]);
  const [productForm, setProductForm] = useState({ name: "", category: "", price: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  const [message, setMessage] = useState("");

  const getAuthHeader = () => ({
    "x-api-key": apiKey,
  });

  const fetchProducts = async () => {
    setMessage("");
    try {
      const res = await axiosInstance.get("/apiKey/get", { headers: getAuthHeader() });
      setProductList(res.data);
    } catch (error) {
      if (error.status == 403) {
        setMessage("Invalid API Key: Access denied");
      }
      console.error("Error fetching products:", error);
    }
  };

  const refreshProducts = async () => {
    setProductList([]);
    fetchProducts();
  };

  const handleAddProduct = async () => {
    await axiosInstance.post("/apiKey/add", productForm, { headers: getAuthHeader() });
    resetForm();
    fetchProducts();
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditProductId(product._id);
    setProductForm(product);
  };

  const handleUpdateProduct = async () => {
    await axiosInstance.patch(`/apiKey/update/${editProductId}`, productForm, { headers: getAuthHeader() });
    resetForm();
    fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    await axiosInstance.delete(`/apiKey/delete/${id}`, { headers: getAuthHeader() });
    fetchProducts();
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditProductId(null);
    setProductForm({ name: "", category: "", price: "" });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">🔑 API Key CRUD</h2>

      <div className="flex gap-3 mb-8">
        <input
          className="border p-2 rounded flex-1"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="API Key"
        />
      </div>

      <ProductForm
        {...{ isEditing, productForm, setProductForm, handleAddProduct, handleUpdateProduct, resetForm }}
      />

      <ProductList {...{ productList, handleEditClick, handleDeleteProduct, refreshProducts }} />

      {message && <p>{message}</p>}
    </div>
  );
}

function ProductForm({ isEditing, productForm, setProductForm, handleAddProduct, handleUpdateProduct, resetForm }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-medium mb-3">{isEditing ? "✏️ Update Product" : "➕ Add Product"}</h3>
      <div className="flex gap-2 mb-4">
        <input className="border p-2 rounded flex-1" placeholder="Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
        <input className="border p-2 rounded flex-1" placeholder="Category" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
        <input className="border p-2 rounded w-24" placeholder="Price" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
        {!isEditing ? (
          <button className="bg-green-600 text-white px-4 rounded" onClick={handleAddProduct}>Add</button>
        ) : (
          <>
            <button className="bg-yellow-500 text-white px-4 rounded" onClick={handleUpdateProduct}>Update</button>
            <button className="bg-gray-500 text-white px-4 rounded" onClick={resetForm}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

function ProductList({ productList, handleEditClick, handleDeleteProduct, refreshProducts }) {
  return (
    <>
      <div className="flex gap-2 mb-3"><h3 className="text-lg font-semibold">📦 Products</h3><button className="bg-gray-500 text-white px-3 rounded" onClick={() => refreshProducts()}>Refresh</button></div>
      <ul className="space-y-2">
        {productList.map((p) => (
          <li key={p._id} className="border p-3 rounded flex justify-between items-center">
            <span>{p.name} - {p.category} - ₹{p.price}</span>
            <div className="flex gap-2">
              <button className="bg-blue-500 text-white px-3 rounded" onClick={() => handleEditClick(p)}>Edit</button>
              <button className="bg-red-600 text-white px-3 rounded" onClick={() => handleDeleteProduct(p._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
