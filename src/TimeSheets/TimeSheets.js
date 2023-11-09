import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const { Option } = Select;

export default function TimeSheets() {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [timeSheets, setTimeSheets] = useState([]);
  const [changedRecords, setChangedRecords] = useState([]); // New state variable for changed records
  const getDayStyle = (params) =>
  params.value && (params.value.getDay() === 0 || params.value.getDay() === 6) ? { color: 'red' } : {};

  const getAbbreviatedDay = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const getDatesInMonth = (month, year) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const datesArray = [];
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      datesArray.push(new Date(date));
    }

    return datesArray;
  };

  const onCellValueChanged = (params) => {
    const { data, colDef, newValue } = params;
    const { field } = colDef;

    // Check if the regularHours or overtimeHours field is changed
    if (field === 'regularHours' || field === 'overtimeHours') {
      const changedRecord = {
        employeeId: selectedEmployee,
        month: selectedMonth,
        year: selectedYear,
        date: data.date,
        [field]: newValue,
      };

      // Check if the record is already in the changedRecords array
      const isRecordChanged = changedRecords.some(
        (record) => record.employeeId === selectedEmployee && record.date === data.date
      );

      // Update or add the record to the changedRecords array
      setChangedRecords((prevRecords) =>
        isRecordChanged
          ? prevRecords.map((record) =>
              record.employeeId === selectedEmployee && record.date === data.date ? changedRecord : record
            )
          : [...prevRecords, changedRecord]
      );
    }

    console.log("Changed record : "+changedRecords);
  };

  const [gridOptions, setGridOptions] = useState({
    columnDefs: [
      { headerName: 'Date', field: 'date', width: 150, cellStyle: getDayStyle },
      { headerName: 'Day', field: 'day', width: 80 },
      { headerName: 'Regular Hours', field: 'regularHours', width: 150, editable: true },
      { headerName: 'Overtime Hours', field: 'overtimeHours', width: 150, editable: true },
    ],
    defaultColDef: {
      editable: true,
      resizable: true,
    },
    onCellValueChanged: onCellValueChanged,
  });

  const generateRandomTimeSheets = (dates) => {
    const timeSheetsArray = dates.map((date) => ({
      date,
      day: getAbbreviatedDay(date),
      regularHours: Math.floor(Math.random() * 8) + 1,
      overtimeHours: Math.floor(Math.random() * 4) + 1,
    }));

    return timeSheetsArray;
  };

  useEffect(() => {
    if (selectedEmployee && selectedMonth && selectedYear) {
      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth, 0);
      const datesInMonth = getDatesInMonth(selectedMonth, selectedYear);
      const randomTimeSheets = generateRandomTimeSheets(datesInMonth);
      setTimeSheets(randomTimeSheets);
    }
  }, [selectedEmployee, selectedMonth, selectedYear]);

  const handleSubmit = () => {
    // Implement the logic to submit the changed data
    // For example, you can make an API call to update the backend with the changes

    // For demonstration purposes, logging the changed records
    console.log('Changed Records to Submit:', changedRecords);

    // Reset the changedRecords state after submission
    setChangedRecords([]);
  };

  return (
    <div className="timesheets-container" style={{ marginLeft: '200px', maxWidth: '800px', width: '100%' }}>
      <div className="input-group">
        <div className="input-item">
          <label>Select Employee:</label>
          <Select style={{ width: '150px' }} value={selectedEmployee} onChange={(value) => setSelectedEmployee(value)}>
            <Option value="employee1">Employee 1</Option>
            <Option value="employee2">Employee 2</Option>
          </Select>
        </div>

        <div className="input-item">
          <label>Select Month:</label>
          <Select style={{ width: '150px' }} value={selectedMonth} onChange={(value) => setSelectedMonth(value)}>
            <Option value="1">January</Option>
            <Option value="2">February</Option>
            {/* Add more options as needed */}
          </Select>
        </div>

        <div className="input-item">
          <label>Select Year:</label>
          <Select style={{ width: '150px' }} value={selectedYear} onChange={(value) => setSelectedYear(value)}>
            <Option value="2023">2023</Option>
            <Option value="2024">2024</Option>
            {/* Add more options as needed */}
          </Select>
        </div>
      </div>

      <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
        <AgGridReact gridOptions={gridOptions} rowData={timeSheets}></AgGridReact>
      </div>
      <button onClick={handleSubmit} disabled={changedRecords.length === 0} type="submit" className="btn btn-outline-primary">
        Submit
      </button>
    </div>
  );
};
