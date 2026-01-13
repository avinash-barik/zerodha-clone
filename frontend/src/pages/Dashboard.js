import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [inputs, setInputs] = useState({});

  const token = localStorage.getItem("token");

  const fetchData = () => {
    // Fetch wallet balance
    api
      .get("/wallet/balance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setBalance(res.data.balance))
      .catch((err) => console.error(err));

    // Fetch stocks
    api
      .get("/stocks")
      .then((res) => setStocks(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add money from bank
  const handleAddFunds = async () => {
    const amount = Number(inputs.wallet);

    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      await api.post(
        "/wallet/add",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Money added successfully");
      setInputs({});
      fetchData();
    } catch (error) {
      alert("Failed to add money");
    }
  };

  // Buy stock
  const handleBuy = async (symbol) => {
    const qty = Number(inputs[symbol]);

    if (!qty || qty <= 0) {
      alert("Enter valid quantity");
      return;
    }

    try {
      await api.post(
        "/orders/buy/market",
        {
          symbol,
          quantity: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Buy order placed successfully");
      setInputs({});
      fetchData();
    } catch (error) {
      alert("Buy failed");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "6px",
      }}
    >
      <h2>Dashboard</h2>

      {/* Wallet Section */}
      <h3>Wallet Balance: ₹{balance}</h3>

      <div style={{ marginBottom: "25px" }}>
        <input
          type="number"
          placeholder="Enter amount"
          value={inputs.wallet || ""}
          onChange={(e) => setInputs({ ...inputs, wallet: e.target.value })}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleAddFunds}>Add Funds</button>
      </div>

      {/* Market Watch */}
      <h3>Market Watch</h3>

      <table>
        <thead>
          <tr>
            <th>Share</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {stocks.map((stock) => (
            <tr key={stock._id}>
              <td>{stock.symbol}</td>
              <td>{stock.name}</td>
              <td>₹{stock.price}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={inputs[stock.symbol] || ""}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      [stock.symbol]: e.target.value,
                    })
                  }
                />
              </td>
              <td>
                <button onClick={() => handleBuy(stock.symbol)}>Buy</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
