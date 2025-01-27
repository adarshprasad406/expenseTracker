// Inside NavPane.js
import React from 'react';
import '../../assets/navPane.css';

const NavPane = ({ setComponent }) => {
  return (
    <div className="nav-pane">
      <button onClick={() => setComponent(1)}>Manage Expenses</button>
      {/* <button onClick={() => setComponent(2)}>Track Expenses</button> */}
    </div>
  );
};

export default NavPane;
