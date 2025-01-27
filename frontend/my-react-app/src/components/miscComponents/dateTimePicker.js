import React, { useState } from 'react';
import '../../assets/ExpenseFrame/miscComponents/dateTimePicker.css';

function DateRange({setStartDate, setEndDate}) {
    const [startDate, setStartDateFilter] = useState('');
    const [endDate, setEndDateFilter] = useState('');

    const handleStartDateChange = (e) => {
        const selectedStartDate = e.target.value;
        setStartDate(selectedStartDate);
        setStartDateFilter(selectedStartDate);
    };
    const handleEndDateChange = (e) => {
        const selectedEndDate = e.target.value;
        setEndDate(selectedEndDate);
        setEndDateFilter(selectedEndDate);
    }

    return (
        <>
            <div className="dateRange">
                <div className='dateComponent'>
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                </div>
                {startDate && (
                    <div className='dateComponent'>
                        <label htmlFor="endDate">End Date:</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            min={startDate} // Set the minimum value for End Date
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default DateRange;
