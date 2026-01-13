import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Holdings from "./pages/Holdings";
import Orders from "./pages/Orders";

function App() {
  const [page, setPage] = useState(
    localStorage.getItem("token") ? "dashboard" : "login"
  );

  const logout = () => {
    localStorage.removeItem("token");
    setPage("login");
  };

  if (!localStorage.getItem("token")) {
    return page === "login" ? (
      <Login onSwitch={() => setPage("signup")} />
    ) : (
      <Signup onSwitch={() => setPage("login")} />
    );
  }

  return (
    <div>
      {/* Navbar */}
      <div style={{ padding: "15px", background: "#0f172a", color: "white" }}>
        <button onClick={() => setPage("dashboard")}>Dashboard</button>
        <button onClick={() => setPage("holdings")}>Holdings</button>
        <button onClick={() => setPage("orders")}>Orders</button>
        <button className="logout" onClick={logout}>
          Logout
        </button>
      </div>

      <div style={{ padding: "30px" }}>
        {page === "dashboard" && <Dashboard />}
        {page === "holdings" && <Holdings />}
        {page === "orders" && <Orders />}
      </div>
    </div>
  );
}

export default App;
