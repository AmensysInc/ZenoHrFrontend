/*
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import FroalaEditor from 'react-froala-wysiwyg';
import { Modal } from 'antd';



export default function EditWithHoldTracking() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [tracking, setTracking] = useState({});
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [editorHtml, setEditorHtml] = useState('');
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  let { employeeId, trackingId } = useParams();

  const [monthOptions] = useState([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]);

  const startYear = 1990;
  const endYear = 2099;
  const [yearOptions] = useState(
    Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index)
  );

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const rows = pasteData.split('\n');
    const parsedData = rows.map(row => row.split('\t'));
    setTableData(parsedData);
  };

  useEffect(() => {
    if (employeeId && trackingId) {
      fetchTracking();
      loadEmployeeDetails();
    }
  }, [employeeId, trackingId]);

  const fetchTracking = async () => {
    try {
      const token = localStorage.getItem('token');
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(`${apiUrl}/trackings/${trackingId}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to fetch tracking');
      }
      const trackingData = await response.json();
      setTracking(trackingData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tracking:', error);
    }
  };

  const loadEmployeeDetails = async () => {
    try {
      const token = localStorage.getItem('token');

      var myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      const response = await fetch(`${apiUrl}/employees/${employeeId}`, requestOptions);
      const data = await response.json();
      setEmployeeDetails(data);
    } catch (error) {
      console.error('Error loading employee details:', error);
    }
  };

  useEffect(() => {
    const actualAmtValue = tracking.actualHours * tracking.actualRate;
    const paidAmtValue = tracking.paidHours * tracking.paidRate;
    const balanceValue = actualAmtValue - paidAmtValue;

    setTracking((prevTracking) => ({
      ...prevTracking,
      actualAmt: actualAmtValue,
      paidAmt: paidAmtValue,
      balance: balanceValue,
    }));
  }, [tracking.actualHours, tracking.actualRate, tracking.paidHours, tracking.paidRate]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tracking),
      };
      const response = await fetch(`${apiUrl}/employees/trackings/${trackingId}`, requestOptions);
      if (response.status === 200) {
        showModal();
      }else if (!response.ok) {
        throw new Error('Failed to update tracking');
      }
    } catch (error) {
      console.error('Error updating tracking:', error);
    }
  };

  const handleNavigate = (employeeId) => {
    navigate(`/tracking/${employeeId}`);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    handleNavigate(employeeId);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    handleNavigate(employeeId);
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTracking((prevTracking) => ({
      ...prevTracking,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleEditorChange = (html) => {
    setEditorHtml(html);
    setTracking({ ...tracking, ["excelData"]: html });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Edit WithHold Tracking</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group row">
          <div className="col">
            <label>First Name:</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={employeeDetails.firstName}
              readOnly
            />
          </div>
          <div className="col">
            <label>Last Name:</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={employeeDetails.lastName}
              readOnly
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="col">
            <label>Month:</label>
            <select
              className="form-control"
              name="month"
              value={tracking.month}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select month</option>
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <label>Year:</label>
            <select
              className="form-control"
              name="year"
              value={tracking.year}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select year</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group row">
          <div className="col">
            <label>Actual Hours:</label>
            <input
              type="text"
              className="form-control"
              name="actualHours"
              value={tracking.actualHours}
              onChange={handleInputChange}
            />
          </div>
          <div className="col">
            <label>Actual Rate:</label>
            <input
              type="text"
              className="form-control"
              name="actualRate"
              value={tracking.actualRate}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="col">
            <label>Paid Hours:</label>
            <input
              type="text"
              className="form-control"
              name="paidHours"
              value={tracking.paidHours}
              onChange={handleInputChange}
            />
          </div>
          <div className="col">
            <label>Paid Rate:</label>
            <input
              type="text"
              className="form-control"
              name="paidRate"
              value={tracking.paidRate}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <div className="col">
            <label>Actual Amount:</label>
            <input
              type="text"
              className="form-control"
              name="actualAmt"
              value={tracking.actualAmt}
              readOnly
            />
          </div>
          <div className="col">
            <label>Paid Amount:</label>
            <input
              type="text"
              className="form-control"
              name="paidAmt"
              value={tracking.paidAmt}
              readOnly
            />
          </div>
          <div className="col">
            <label>Balance:</label>
            <input
              type="text"
              className="form-control"
              name="balance"
              value={tracking.balance}
              readOnly
            />
          </div>
          <div>
        <label htmlFor="editorHtml">Excel Data :</label>
      <FroalaEditor
        model={tracking.excelData}
        name="editorHtml"
        onModelChange={handleEditorChange}
        onPaste={handlePaste}
      />
    </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Update
        </button>
        <button
          type="button"
          className="btn btn-outline-danger mx-2"
          onClick={() => handleNavigate(employeeId)}
        >
          Cancel
        </button>
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>WithHold Updated succesfully</p>
        </Modal>  
      </form>
    </div>
  );
}

*/

import React from 'react'
import WithHoldTrackingForm from './WithHoldTrackingForm'

export default function EditWithHoldTracking() {
  return (
    <WithHoldTrackingForm mode="edit"/>
  )
}
