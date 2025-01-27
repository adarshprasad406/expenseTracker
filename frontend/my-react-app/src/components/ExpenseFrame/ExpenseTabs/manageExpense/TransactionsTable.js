import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CompactTable } from '@table-library/react-table-library/compact';
import { getTheme } from "@table-library/react-table-library/baseline";
import { useTheme } from "@table-library/react-table-library/theme";
import { useRowSelect } from "@table-library/react-table-library/select";
import { usePagination } from "@table-library/react-table-library/pagination";
import EditTransaction from './EditTransaction';
import DeleteTransaction from './DeleteTransactions';

const COLUMNS = [
    { label: 'Description', renderCell: (item) => item.desc, select: true, resize: true },
    { label: 'Amount', renderCell: (item) => item.amount, resize: true },
    { label: 'Category', renderCell: (item) => item.category, resize: true },
    { label: 'Date', renderCell: (item) => {
        let date = new Date(item.date);
        return `${(date.getDate()<10?'0'+date.getDate():date.getDate())}-${date.getMonth() + 1}-${date.getFullYear()}`;
    }, resize: true },
];

function TransactionsTable({ trigger, setTrigger, filter }) {
    // ======STATE
    //selected rows
    const [selectedRows, setSelectedRows] = useState([]);
    //transactions list filtered from database
    const [transactions, setTransactions] = useState([]);
    //current Style of buttons
    const [styleEditButton, setStyleEditButton] = useState({color: 'gray', cursor: 'default'});
    const [styleDeleteButton, setStyleDeleteButton] = useState({color: 'gray', cursor: 'default'});
    const [editModal, setEditModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const fetchTransactions = async () => {
        const transactions = await axios.get(`${process.env.REACT_APP_SERVERURL}expense/getExpenses`, {
            headers: {
                'authorization': localStorage.getItem('authToken')
            }
        });
        let data = transactions?.data?.expenses;
        let filteredTransactions = [];
        for (let i = 0; i < data.length; i++) {
            let currTrans = {}
            currTrans["id"] = data[i]._id;
            currTrans["amount"] = data[i].amount;
            currTrans["category"] = data[i].category;
            currTrans["date"] = data[i].date;
            currTrans["desc"] = data[i].desc;
            filteredTransactions.push(currTrans);
        }
        setTransactions(filteredTransactions);
    }
    const fetchTransactionsFilter = async () => {
        const transactions = await axios.get(`${process.env.REACT_APP_SERVERURL}expense/getTransactionsByFilter`, {
            headers: {
                'authorization': localStorage.getItem('authToken')
            },
            params: {
                startDate: filter.startDate,
                endDate: filter.endDate,
                categories: filter.categories
            }
        });
        let data = transactions?.data?.expenses;
        let filteredTransactions = [];
        for (let i = 0; i < data.length; i++) {
            let currTrans = {}
            currTrans["id"] = data[i]._id;
            currTrans["amount"] = data[i].amount;
            currTrans["category"] = data[i].category;
            currTrans["date"] = data[i].date;
            currTrans["desc"] = data[i].desc;
            filteredTransactions.push(currTrans);
        }
        setTransactions(filteredTransactions);
    }
    // ======USE EFFECT
    //fetch transactions initally
    useEffect(() => {
        fetchTransactions();
    }, [])
    //fetch transactions when filter is changed
    useEffect(() => {
        fetchTransactionsFilter()
    }, [filter])
    //fetch transactions when trigger is true/transaction is added
    useEffect(() => {
        if (trigger) {
            fetchTransactions()
            setTrigger(false);
        }
    }, [trigger]);
    // ======TABLE FUNCTIONS
    const theme = useTheme([
        getTheme(),
        {
            HeaderRow: `background-color: #f1f1f1;`,
            Cell: `text-align: left;`
        },
    ]);
    const nodes = transactions;//this line is necessary, else will give iterator error
    
    // useEffect is used because setState is asunchronous
    useEffect(() => {
        if (selectedRows.length !== 1) {
            setStyleEditButton({ color: 'gray', cursor: 'default' });
        } else {
            setStyleEditButton({ color: 'black', cursor: 'pointer' });
        }
        if(selectedRows.length === 0){
            setStyleDeleteButton({ color: 'gray', cursor: 'default' });
        }else{
            setStyleDeleteButton({ color: 'black', cursor: 'pointer' });
        }
    }, [selectedRows])

    //below will get triggered when a row is selected
    const select = useRowSelect({ nodes }, {
        onChange: onSelectChange,
    });
    async function onSelectChange(action, state) {
        setSelectedRows(state.ids);
    }
    const pagination = usePagination(nodes, {
        state: {
            page: 0,
            size: 12,
        },
    });
    //functions for edit and delete buttons
    const handleEditButton = () => {
        setEditModal(true);
    }
    const handleDeleteButton = async () => {
        setDeleteModal(true);
    }

    // ======RETURN
    return(
    <>
    {editModal && <EditTransaction setEditModal={setEditModal} setTrigger={setTrigger} transactionId={selectedRows[0]} />}
    {deleteModal && <DeleteTransaction setDeleteModal={setDeleteModal} setTrigger={setTrigger} transactionId={selectedRows} />}
    <div className='editDeleteDiv'>
        <span className='editDelete' style={styleEditButton} 
        onClick={selectedRows.length===1?handleEditButton:null}>Edit</span>
        <span className='editDelete' style={styleDeleteButton} 
        onClick={selectedRows.length>0?handleDeleteButton:null}>Delete</span>
    </div>
        <CompactTable
            columns={COLUMNS}
            data={{ nodes }}
            theme={theme}
            select={select}
            pagination={pagination}
            renderRow={(row, index) => (
                <tr
                  key={index}
                  onClick={() => {
                    // Handle row selection
                    const isSelected = selectedRows.includes(row);
                    if (isSelected) {
                      setSelectedRows(selectedRows.filter(selectedRow => selectedRow !== row));
                    } else {
                      setSelectedRows([...selectedRows, row]);
                    }
                  }}
                >
                  <td>
                    {/* Add a checkbox to select the row */}
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      onChange={() => {}}
                    />
                  </td>
                  {row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              )}
            />
            <br />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total Pages: {pagination.state.getTotalPages(nodes)}</span>

            <span className='pageButton'>
                Page:{" "}
                {pagination.state.getPages(nodes).map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        style={{
                            fontWeight: pagination.state.page === index ? "bold" : "normal",
                        }}
                        onClick={() => pagination.fns.onSetPage(index)}
                    >
                        {index + 1}
                    </button>
                ))}
            </span>
        </div>
        <br />
    </>
)
}

export default TransactionsTable;
