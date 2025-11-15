import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useLocation } from "react-router-dom";

export default function OAuthAuthDemo() {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [acode, setAcode] = useState("");
  const [token, setToken] = useState("");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", category: "", price: "" });
  const [updateMode, setUpdateMode] = useState(false);
  const [editId, setEditId] = useState("");

  const [message, setMessage] = useState("");

  // Capture token from redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("token");
    if (t) {
      setToken(t);
      localStorage.setItem("oauthToken", t);
      window.history.replaceState({}, document.title, "/oauth");
    } else {
      const stored = localStorage.getItem("oauthToken");
      if (stored) setToken(stored);
    }
  }, [location]);

  const authHeader = () => ({
    Authorization: `Bearer ${token}`,
  });

  const handleGoogleSignIn = async (e) => {
    if (!window.google) {
      console.error("Google Identity Services SDK not loaded");
      return;
    }

    const client = window.google.accounts.oauth2.initCodeClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      ux_mode: "popup",
      callback: async (response) => {
        try {
          const { code } = response;

          setAcode(code);

          const res = await axiosInstance.post(`/oAuth/google`, { code });
          console.log(res);

          setToken(res.data.access_token);
          setLoggedIn(true);
        } catch (err) {
          console.error("Google login error:", err);
        }
      },
    });

    client.requestCode();
  };

  const fetchProducts = async () => {
    setMessage("");
    try {
      const res = await axiosInstance.get("/oAuth/get", { headers: authHeader() });
      setProducts(res.data);
    } catch (error) {
      if (error.status == 401) {
        setMessage("Invalid or expired Google access token");
      }
      console.error("Error fetching products:", error);
    }
  };

  const refreshProducts = async () => {
    setProducts([]);
    fetchProducts();
  };

  const addProduct = async () => {
    await axiosInstance.post("/oAuth/add", form, { headers: authHeader() });
    setForm({ name: "", category: "", price: "" });
    fetchProducts();
  };

  const startEdit = (p) => {
    setUpdateMode(true);
    setForm({ name: p.name, category: p.category, price: p.price });
    setEditId(p._id);
  };

  const updateProduct = async () => {
    await axiosInstance.patch(`/oAuth/update/${editId}`, form, { headers: authHeader() });
    setUpdateMode(false);
    setForm({ name: "", category: "", price: "" });
    fetchProducts();
  };

  const cancelEdit = () => {
    setUpdateMode(false);
    setForm({ name: "", category: "", price: "" });
  };

  const deleteProduct = async (id) => {
    await axiosInstance.delete(`/oAuth/delete/${id}`, { headers: authHeader() });
    fetchProducts();
  };

  useEffect(() => {
    if (loggedIn) fetchProducts();
  }, [loggedIn]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">OAuth2 (Google) Auth CRUD</h2>
      {token &&
        <div className="flex flex-col">
          <div>
            <label>Google Authorization Code: </label>
            <input className="border p-2 rounded w-full mb-2" value={acode} readOnly placeholder="" />
          </div>

          <div>
            <label>Google Access Token: </label>
            <input className="border p-2 rounded w-full mb-10" value={token} onChange={(e) => setToken(e.target.value)} placeholder="" />
          </div>
        </div>
      }

      {!token ? (
        <button
          onClick={() => handleGoogleSignIn()}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Login with Google
        </button>
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
