import React, {useState} from 'react';
import NavPane from './NavPane';
import ExpenseContainer from './expenseContainer';
import '../../assets/expense.css';

const Expense = () => {
  const [selectedComponent, setSelectedComponent] = useState(1);
  return (
    <div className='expenseContainer'>
      <NavPane setComponent = {setSelectedComponent}/>
      <ExpenseContainer selectedComponent={selectedComponent}/>
    </div>
  );
};

export default Expense;
