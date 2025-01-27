import React, { useEffect, useState } from 'react';
import '../../../../assets/ExpenseFrame/manageExpenses.css';
import '../../../../assets/ExpenseFrame/editTransaction.css'
import axios from 'axios';

function EditTransaction({ setEditModal, setTrigger, transactionId }) {
    function onClickClose() {
        setEditModal(false);
    }
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClickClose}>
                    &times;
                </span>
                <EditForm setEditModal={setEditModal} setTrigger={setTrigger} transactionId={transactionId} />
            </div>
        </div>
    );
}

function EditForm({ setEditModal, setTrigger, transactionId }) {
    const [defaultCategoryShow, setDefaultCategoryShow] = useState(true);
    const [customCatShow, setCustomCatShow] = useState(false);
    const [customCatToggle, setCustomCatToggle] = useState(true);
    const [defaultCatToggle, setDefaultCatToggle] = useState(false);

    function handleCatToggle() {
        if (customCatToggle) {
            setDefaultCategoryShow(false);
            setCustomCatShow(true);
            setCustomCatToggle(false);
            setDefaultCatToggle(true);
        } else {
            setDefaultCategoryShow(true);
            setCustomCatShow(false);
            setCustomCatToggle(true);
            setDefaultCatToggle(false);
        }

    }
    const [categories, setCategories] = useState(['Rent', 'Utilities', 'Marketing', 'Education', 'Medicine', 'Food', 'Travel', 'Entertainment']);
    useEffect(() => {
        //load the categories from the database
        const fetchCategories = async () => {
            const fetchedCategories = await axios.get(`${process.env.REACT_APP_SERVERURL}expense/getExpCategory`, {
                headers: {
                    'authorization': localStorage.getItem('authToken')
                }
            });

            setCategories([...new Set([...(fetchedCategories?.data?.categories), ...categories])]);

        }
        fetchCategories();
    }, [])
    const handleSubmitTransaction = async (e) => {
        e.preventDefault();
        const description = document.getElementById("description").value;
        const amount = document.getElementById("amount").value;
        const category = document.getElementById("category").value;
        const date = document.getElementById("date").value;
        const transaction = {
            desc: description,
            amount: amount,
            category: category,
            date: date,
            id: transactionId
        }
        const response = await axios.post(`${process.env.REACT_APP_SERVERURL}expense/updateTransaction`, transaction, {
            headers: {
                'authorization': localStorage.getItem('authToken')
            }
        });
        console.log(response.data)
        setEditModal(false)
        setTrigger(true);
    }
    return (
        <>
            <div className='modalTitle'>Edit Transaction</div>
            <form onSubmit={handleSubmitTransaction}>
                <div className="form-group">
                    <div className='addTransactionInput'>
                        <input type="text" id="description" placeholder="Description" />
                    </div>
                    <div className='addTransactionInput'>
                        <input type="number" id="amount" placeholder="Amount" />
                    </div>
                    <div className='addTransactionInput'>
                        {defaultCategoryShow && <select id="category" name="category">
                            {categories?.map((category) => {
                                return (<option value={category}>{category}</option>)
                            })}
                        </select>}
                        {customCatShow && <input type="text" id="category" name="category" placeholder="Custom Category" />}
                        {customCatToggle && <div className='customCatOption' onClick={handleCatToggle}>Custom Category?</div>}
                        {defaultCatToggle && <div className='customCatOption' onClick={handleCatToggle}>Choose from default categories?</div>}
                    </div>
                    <div className='addTransactionInput'>
                        <input type="date" id="date" placeholder="Date" />
                    </div>
                    <button type="submit" className="add-button">
                        Update
                    </button>
                </div>
            </form>
        </>
    );
}

export default EditTransaction;
