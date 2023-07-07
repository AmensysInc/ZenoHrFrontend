import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate,} from "react-router-dom";

export default function AddWithHoldTracking() {
  let navigate = useNavigate();

  const [tracking, setTrackings] = useState({
    employeeId: "",
    month : "",
    actualHours : "",
    actualRate : "",
    paidHours : "",
    paidRate : "",

  });

  const { employeeId, month, actualHours, actualRate, paidHours, paidRate} = tracking;

  const onInputChange = (e) => {
    setTrackings({ ...tracking, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:8082/employees/${employeeId}/trackings`, tracking);
    navigate("/");
  };

  return (
    <div className="form-container">
          <h2 className="text-center m-4">Add New WithHoldTracking</h2>
          <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-row">
          <div className="form-group">
              <label htmlFor="employeeId">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Employee ID"
                name="employeeId"
                value={employeeId}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="month">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Month"
                name="month"
                value={month}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="actualHours">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Actual Hours"
                name="actualHours"
                value={actualHours}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            </div>
            <div className="form-group">
              <label htmlFor="actualRate">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Actual Rate"
                name="actualRate"
                value={actualRate}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="paidHours">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Paid Hours"
                name="paidHours"
                value={paidHours}
                onChange={(e) => onInputChange(e)}
                required
              />
              </div>
              <div className="form-group">
              <label htmlFor="paidRate">
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Paid Rate"
                name="paidRate"
                value={paidRate}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>

            <button type="submit" className="btn btn-outline-primary">
              Submit
            </button>
            <Link className="btn btn-outline-danger mx-2" to="/">
              Cancel
            </Link>
          </form>
        </div>
  )
}
