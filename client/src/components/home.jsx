import { useState } from "react";
import BasicAuthDemo from "./BasicAuthDemo";
import ApiKeyDemo from "./ApiKeyDemo";
import JwtDemo from "./JwtDemo";
import OAuthDemo from "./OAuthDemo";

function App() {
  const [tab, setTab] = useState("basic");

  return (
    <div className="p-6 min-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">🔐 API Authentication</h1>

      <div className="flex justify-center gap-3 mb-6">
        {["basic", "apiKey", "jwt", "oauth"].map((method) => (
          <button
            key={method}
            onClick={() => setTab(method)}
            className={`px-4 py-2 rounded-lg capitalize ${
              tab === method ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {method}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        {tab === "basic" && <BasicAuthDemo />}
        {tab === "apiKey" && <ApiKeyDemo />}
        {tab === "jwt" && <JwtDemo />}
        {tab === "oauth" && <OAuthDemo />} 
      </div>
    </div>
  );
}

export default App;
