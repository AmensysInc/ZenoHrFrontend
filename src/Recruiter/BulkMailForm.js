import React, { useState } from "react";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

const BulkMailForm = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [emails, setEmails] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const recruiterId = sessionStorage.getItem("id"); 
      console.log(recruiterId);
      const emailList = emails.split(",").map((email) => email.trim());
  
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/plain",
      };
  
      const response = await axios.post(
        `${apiUrl}/bulkmails/save?recruiterId=${recruiterId}`, // Include recruiterId in the URL
        emailList.join(","),
        { headers }
      );
  
      console.log(response.data);
  
      setEmails("");
    } catch (error) {
      console.error("Error sending emails:", error);
    }
  };
  

  return (
    <div className="col-md-10" style={{ overflowX: "auto" }}>
      <div className="col-md-8 offset-md-2">
        <form onSubmit={handleSubmit}>
          <FormControl sx={{ m: 1, width: 500 }}>
          <TextField id="standard-basic" label="Enter email IDs (comma-separated):" variant="standard" value={emails} onChange={(e) => setEmails(e.target.value)}/>
          </FormControl>
          <Button variant="outlined" type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default BulkMailForm;
