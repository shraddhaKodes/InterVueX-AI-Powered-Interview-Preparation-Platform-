import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [newStock, setNewStock] = useState({ symbol: "", quantity: "", boughtPrice: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user stocks on mount
  useEffect(() => {
    fetchStocks();
  }, []);

  // ✅ Fetch stocks from backend
  const fetchStocks = async () => {
    try {
      setLoading(true);
      console.log("Entered >>>>>>>>>");
      const response = await axios.get(`${BASE_URL}/stock/all`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStocks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stocks");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle stock input changes
  const handleChange = (e) => {
    setNewStock({ ...newStock, [e.target.name]: e.target.value });
  };

  // ✅ Add stock to portfolio
  const addStock = async () => {
    if (!newStock.symbol || !newStock.quantity || !newStock.boughtPrice) {
      setError("All fields are required");
      return;
    }

    try {
      setError("");
      const stockData = {
        symbol: newStock.symbol.toUpperCase(),
        quantity: Number(newStock.quantity),
        boughtPrice: Number(newStock.boughtPrice),
      };

      const response = await axios.post(`${BASE_URL}/stock/add`, stockData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setStocks([...stocks, response.data.stock]);
      setNewStock({ symbol: "", quantity: "", boughtPrice: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add stock");
    }
  };

  // ✅ Remove stock from portfolio using `_id`
  const deleteStock = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/stock/delete/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setStocks(stocks.filter((stock) => stock._id !== id)); // ✅ Remove by `_id`
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete stock");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">📈 User Stock Portfolio</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Stock Input Form */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="symbol"
          placeholder="Stock Symbol (e.g., AAPL)"
          value={newStock.symbol}
          onChange={handleChange}
          className="border p-2 w-1/3"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newStock.quantity}
          onChange={handleChange}
          className="border p-2 w-1/3"
        />
        <input
          type="number"
          name="boughtPrice"
          placeholder="Bought Price"
          value={newStock.boughtPrice}
          onChange={handleChange}
          className="border p-2 w-1/3"
        />
        <button onClick={addStock} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      {/* Stock List */}
      <ul className="border-t mt-4">
        {stocks.map((stock) => (
          <li key={stock._id} className="flex justify-between items-center border-b p-2">
         {stock.symbol} - {stock.quantity} shares @ ₹{parseFloat(stock.boughtPrice).toFixed(2)}
            <button onClick={() => deleteStock(stock._id)} className="bg-red-500 text-white px-2 py-1 rounded">
              ❌ Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
