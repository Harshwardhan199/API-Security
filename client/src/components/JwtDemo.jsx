import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function JwtAuthDemo() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("password123");
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", price: "" });
  const [updateMode, setUpdateMode] = useState(false);
  const [editingId, setEditingId] = useState("");

  const [message, setMessage] = useState("");

  const authHeader = () => ({
    Authorization: `Bearer ${token}`,
  });

  const loginUser = async () => {
    try {
      const res = await axiosInstance.post("/jwt/login", { username, password });
      setToken(res.data.token);
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    setMessage("");
    try {
      const res = await axiosInstance.get("/jwt/get", { headers: authHeader() });
      setProducts(res.data);
    } catch (error) {
      if (error.status == 403) {
        setMessage("Invalid or expired token");
      }
      console.error("Error fetching products:", error);
    }
  };

  const refreshProducts = async () => {
    setProducts([]);
    fetchProducts();
  };

  const addProduct = async () => {
    await axiosInstance.post("/jwt/add", form, { headers: authHeader() });
    setForm({ name: "", category: "", price: "" });
    fetchProducts();
  };

  const startEdit = (p) => {
    setUpdateMode(true);
    setForm({ name: p.name, category: p.category, price: p.price });
    setEditingId(p._id);
  };

  const updateProduct = async () => {
    await axiosInstance.patch(`/jwt/update/${editingId}`, form, { headers: authHeader() });
    setUpdateMode(false);
    setForm({ name: "", category: "", price: "" });
    fetchProducts();
  };

  const cancelEdit = () => {
    setUpdateMode(false);
    setForm({ name: "", category: "", price: "" });
  };

  const deleteProduct = async (id) => {
    await axiosInstance.delete(`/jwt/delete/${id}`, { headers: authHeader() });
    fetchProducts();
  };

  useEffect(() => {
    if (loggedIn) fetchProducts();
  }, [loggedIn]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">JWT Auth CRUD</h2>

      {token && <input className="border p-2 rounded w-full mb-10" value={token} onChange={(e) => setToken(e.target.value)} placeholder="" />}

      {!token ? (
        <div className="flex gap-2 mb-3">
          <input className="border p-2 rounded w-1/2" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          <input className="border p-2 rounded w-1/2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button className="bg-blue-600 text-white px-4 rounded" onClick={loginUser}>Login</button>
        </div>
      ) : (
        <div>
          {!updateMode ? (
            <div>
              <h3 className="text-lg font-semibold mb-3">Add Product</h3>
              <div className="flex gap-2 mb-4">
                <input className="border p-2 rounded flex-1" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="border p-2 rounded flex-1" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <input className="border p-2 rounded w-24" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <button className="bg-green-600 text-white px-3 rounded" onClick={addProduct}>Add</button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-3">Update Product</h3>
              <div className="flex gap-2 mb-4">
                <input className="border p-2 rounded flex-1" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="border p-2 rounded flex-1" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <input className="border p-2 rounded w-24" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <button className="bg-yellow-500 text-white px-3 rounded" onClick={updateProduct}>Update</button>
                <button className="bg-red-500 text-white px-3 rounded" onClick={cancelEdit}>Cancel</button>
              </div>
            </div>
          )}

          <div className="flex gap-2 mb-3"><h3 className="text-lg font-semibold">Products</h3><button className="bg-gray-500 text-white px-3 rounded" onClick={refreshProducts}>Refresh</button></div>
          <ul className="space-y-2">
            {products.map((p) => (
              <li key={p._id} className="border p-2 rounded flex justify-between items-center">
                <span>{p.name} - {p.category} - ₹{p.price}</span>
                <div className="flex gap-2">
                  <button className="bg-blue-500 text-white px-3 rounded" onClick={() => startEdit(p)}>Edit</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteProduct(p._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-3">
            {message && <p>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
