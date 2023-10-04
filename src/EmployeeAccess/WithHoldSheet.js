import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/Home.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import FroalaEditorView from 'react-froala-wysiwyg';

const Tracking = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [trackings, setTrackings] = useState([]);
  const employeeId = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTrackings();
  }, []);

  const config = {
    events: {
      'initialized': function () {
        setTimeout(() => {
          this.edit.off();
        }, 1);
      }
    }
  };


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
      if (Array.isArray(response.data.content)) {
        setTrackings(response.data.content);
      } else {
        console.error('Error: response.data.content is not an array:', response.data.content);
      }
    } catch (error) {
      console.error('Error fetching trackings:', error);
    }
  }; 

  return (
    <div className="container">
      <h2 className="text-center">WithHold Details</h2>
      <div className="table-container">
        <table className="table border shadow">
          <thead>
            <tr>
              
            </tr>
          </thead>
          <tbody>
            {trackings.map((tracking, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <div>
        <label htmlFor="editorHtml"></label>
       
      <FroalaEditorView
      contenteditable="false"
        model={tracking.excelData}
        name="editorHtml"
        config={config}
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
