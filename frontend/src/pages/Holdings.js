import { useEffect, useState } from "react";
import api from "../services/api";

function Holdings() {
  const [holdings, setHoldings] = useState([]);
  const [sellQty, setSellQty] = useState({});
  const token = localStorage.getItem("token");

  const fetchHoldings = () => {
    api
      .get("/orders/holdings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setHoldings(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const handleSell = async (symbol) => {
    if (!sellQty[symbol] || sellQty[symbol] <= 0) {
      alert("Enter valid quantity");
      return;
    }

    try {
      await api.post(
        "/orders/sell/market",
        {
          symbol,
          quantity: Number(sellQty[symbol]),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Sell order placed successfully");
      setSellQty({});
      fetchHoldings();
    } catch (error) {
      alert("Sell failed");
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
      <h2>Holdings</h2>

      {holdings.length === 0 ? (
        <p>No holdings available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Avg Price</th>
              <th>Sell Qty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => (
              <tr key={h._id}>
                <td>{h.stockSymbol}</td>
                <td>{h.quantity}</td>
                <td>₹{h.avgPrice}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max={h.quantity}
                    value={sellQty[h.stockSymbol] || ""}
                    onChange={(e) =>
                      setSellQty({
                        ...sellQty,
                        [h.stockSymbol]: e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <button onClick={() => handleSell(h.stockSymbol)}>
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Holdings;
