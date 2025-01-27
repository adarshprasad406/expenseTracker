import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

//Date-Range-Picker
import DateRange from '../../../miscComponents/dateTimePicker';
import "../../../../assets/ExpenseFrame/filter.css";
function Filter({ setFilter: setFilterMain }) {
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        categories: [],
    });
    const handleCategoryChange = (e) => {
        let temp = []
        for(let i=0;i<e.length;i++){
            temp[i] = e[i].value;
        }
        setFilters({ ...filters, categories: temp });
    }
    const handleStartDateChange = (date) => {
        setFilters({ ...filters, startDate: date });
    };
    const handleEndDateChange = (date) => {
        setFilters({ ...filters, endDate: date })
    };
    const applyFilters = () => {
        setFilterMain(filters);
    };
    useEffect(() => {
        //load the categories from the database
        const fetchCategories = async () => {
            const fetchedCategories = await axios.get(`${process.env.REACT_APP_SERVERURL}expense/getExpCategory`, {
                headers: {
                    'authorization': localStorage.getItem('authToken')
                }
            });
            // make an array which will contains object with value and label
            for (let i = 0; i < fetchedCategories?.data?.categories?.length; i++) {
                fetchedCategories.data.categories[i] = { value: fetchedCategories.data.categories[i], label: fetchedCategories.data.categories[i] }
            }
            setCategories(fetchedCategories?.data?.categories);
            console.log(categories);
        }
        fetchCategories();
    }, [])
    const options = categories

    return (
        <div className="filter-section">
            <div className='filterTitle'>
                <img width="18em" height="18em" src="https://img.icons8.com/external-tanah-basah-glyph-tanah-basah/48/1A1A1A/external-filter-design-thinking-tanah-basah-glyph-tanah-basah.png" alt="external-filter-design-thinking-tanah-basah-glyph-tanah-basah" />
                <span>Filters</span>
            </div>
            <div className='dateRangeContainer'>
                <>
                    <DateRange setStartDate={handleStartDateChange} setEndDate={handleEndDateChange} />
                </>
            </div>
            <Select
                isMulti
                name="colors"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleCategoryChange}
            />
            <button onClick={applyFilters} className="filter-button">
                Apply Filters
            </button>
        </div>
    );
}

export default Filter;
