import {React, useState} from 'react';
import '../../../assets/ExpenseFrame/manageExpenses.css';

import TransactionsTable from './manageExpense/TransactionsTable'
import Filters from './manageExpense/Filters'
import AddTransaction from './manageExpense/AddTransaction'
const ManageExpense = () => {
  //will contain three components: TransactionsTable, Add Transaction and Filter Transactions
  const [trigger, setTrigger] = useState(false);
  const [filter, setFilter] = useState([]);
  
  return (
    <div className="manageExpenses">
      <div className='LeftPane'>
        <div className='addTransaction'>
          <AddTransaction setTrigger={setTrigger} />
        </div>
        <div className='transactionTable'>
          <TransactionsTable trigger={trigger} setTrigger={setTrigger} filter={filter}/>
        </div>
      </div>
      <div className='RightPane'>
        <Filters setFilter={setFilter}/>
      </div>
    </div>
  );
};

export default ManageExpense;