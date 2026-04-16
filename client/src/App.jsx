import { useEffect, useState } from "react";
import Login from "./pages/Login";
import "./index.css";

function App() {
  const [message, setMessage] = useState("Loading...");
  const [dbTime, setDbTime] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(JSON.parse(savedUser));
    }

    fetch(`${import.meta.env.VITE_API_URL}/api`)
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setDbTime(data.databaseTime);
      })
      .catch(() => {
        setMessage("Failed to connect to backend");
      });
  }, []);

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  // 🔐 Show login page
  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // ✅ Wrapped with container
  return (
    <div className="container">
      <h1>DTI Accounting System</h1>
      <p>Welcome, {currentUser?.username}!</p>
      <p>{message}</p>
      {dbTime && <p>Database time: {dbTime}</p>}

      <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
        Logout
      </button>
    </div>
  );
}

export default App;