import React from 'react';
import '../../assets/expenseContainer.css';
import ManageExpense from './ExpenseTabs/ManageExpense';
import Visualizer from './ExpenseTabs/Visualizer';
// import Component3 from './Component3';

const ExpenseContainer = ({selectedComponent}) => {

  // Function to switch between components
  return (
    <div className="expense-container">
      {/* Render the selected component */}
      {selectedComponent === 1 && <ManageExpense />}
      {selectedComponent === 2 && <Visualizer />}
    </div>
  );
};

export default ExpenseContainer;
