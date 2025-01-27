import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Expense from "./ExpenseFrame/Expense";
import '../assets/homepage.css';
import Header from "./Header";

const HomePage = ({ token, setToken }) => {
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <div>
      <Header token={token} setToken={setToken} />
      <div className="homepage">
        {
          !token ? (
            <div>
              <div className="header">
                <h1>Welcome to Expense Tracker</h1>
                <p>Track your expenses easily</p>
              </div>
              <div className="actions">
                <Link to="/login" className="button login-button">Log In</Link>
                <Link to="/signup" className="button signup-button">Sign Up</Link>
              </div>

            </div>
          ) :
            (<Expense />)
        }

        <div className="footer">
          <p>&copy; Vishal Maharathy 2023</p>
        </div>
      </div>

    </div>
  );
};
export default HomePage;