import React, { useEffect, useState } from 'react';
import '../../../../assets/ExpenseFrame/addTransaction.css'
import axios from 'axios';


function AddTransaction({ setTrigger }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <div>
            <button onClick={openModal} className="add-button">
                Add Transaction
            </button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <TransactionForm closeModal={closeModal} setTrigger={setTrigger} />
                    </div>
                </div>
            )}
        </div>
    );
}

function TransactionForm({ setTrigger, closeModal }) {
    const [defaultCategoryShow, setDefaultCategoryShow] = useState(true);
    const [customCatShow, setCustomCatShow] = useState(false);
    const [customCatToggle, setCustomCatToggle] = useState(true);
    const [defaultCatToggle, setDefaultCatToggle] = useState(false);

    function handleCatToggle(){
        if(customCatToggle){
            setDefaultCategoryShow(false);
            setCustomCatShow(true);
            setCustomCatToggle(false);
            setDefaultCatToggle(true);
        }else{
            setDefaultCategoryShow(true);
            setCustomCatShow(false);
            setCustomCatToggle(true);
            setDefaultCatToggle(false);
        }

    }
    const [categories, setCategories] = useState(['Rent', 'Utilities', 'Marketing', 'Education', 'Medicine', 'Food', 'Travel', 'Entertainment']);
    useEffect(() => {
        //load the categores from the database
        const fetchCategories = async () => {
            const fetchedCategories = await axios.get(`${process.env.REACT_APP_SERVERURL}expense/getExpCategory`, {
                headers: {
                    'authorization': localStorage.getItem('authToken')
                }
            });
            if(fetchedCategories?.data?.categories?.length > 0){
                setCategories([...new Set([...(fetchedCategories?.data?.categories), ...categories])]);

            }
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
            date: date
        }
        await axios.post(`${process.env.REACT_APP_SERVERURL}expense/postExpense`, transaction, {
            headers: {
                'authorization': localStorage.getItem('authToken')
            }
        });
        closeModal()
        setTrigger(true);
    }
    return (
        <>
        <div className='modalTitle'>Add Transaction</div>
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
                    Add
                </button>
            </div>
        </form>
        </>
    );
}

export default AddTransaction;
