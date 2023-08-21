import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/Home.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import FroalaEditor from 'react-froala-wysiwyg';

const Tracking = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [trackings, setTrackings] = useState([]);
  const employeeId = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTrackings();
  }, []);

  const fetchTrackings = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${apiUrl}/employees/${employeeId}/trackings`,
        config
      );
      setTrackings(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching trackings:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center">Tracking Details</h2>
      <div className="table-container">
        <table className="table border shadow">
          <thead>
            <tr>
              <th>Excel Date</th>
            </tr>
          </thead>
          <tbody>
            {trackings.map((tracking, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <div>
        <label htmlFor="editorHtml">Froala Rich Text Editor:</label>
      <FroalaEditor
        model={tracking.excelData}
        name="editorHtml"
        readOnly
      />
    </div>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tracking;
