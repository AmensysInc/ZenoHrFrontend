import React, { useState, useEffect,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "antd";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import htmlToFormattedText from "html-to-formatted-text";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function EmailForm() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [fromEmail, setFromEmail] = useState("");
  const [to, setTo] = useState([]);
  const [cc, setCc] = useState([]);
  const [bcc, setBcc] = useState([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [plainText, setPlainText] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [email, setEmail] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllCc, setSelectAllCc] = useState(false);
  const [selectAllBcc, setSelectAllBcc] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const recruiterId = sessionStorage.getItem("id");
        const response = await axios.get(`${apiUrl}/bulkmails/${recruiterId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmail(response.data.map((emailObject) => emailObject.email));
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    fetchEmails();
  }, []);

  const handleSelectAll = () => {
    console.log("select all to");
    if (selectAll) {
      setTo([]);
    } else {
      setTo([...email]);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectAllCc = () => {
    console.log("select all cc");
    if (selectAllCc) {
      setCc([]);
    } else {
      setCc([...email]);
    }
    setSelectAllCc(!selectAllCc);
  };

  const handleSelectAllBcc = () => {
    if (selectAllBcc) {
      setBcc([]);
    } else {
      setBcc([...email]);
    }
    setSelectAllBcc(!selectAllBcc);
  };

  const handleChangeFrom = (event) => {
    const {
      target: { value },
    } = event;
    setFromEmail(value);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTo(typeof value === "string" ? value.split(",") : value);
    setSelectAll(false);
  };

  const handleCcChange = (event) => {
    const {
      target: { value },
    } = event;
    setCc(typeof value === "string" ? value.split(",") : value);
    setSelectAllCc(false);
  };

  const handleBccChange = (event) => {
    const {
      target: { value },
    } = event;
    setBcc(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleEditorChange = (newContent) => {
    setBody(newContent);
    setIsDirty(true);
  };

  const htmlToText = useCallback((html) => {
    return htmlToFormattedText(html);
  }, []);

  useEffect(() => {
    if (isDirty) {
      setPlainText(htmlToText(body));
      setIsDirty(false);
    }
  }, [body, isDirty, htmlToText]);

  const handleAttachmentChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    const allEmails = [...to, ...cc, ...bcc];

    const uniqueEmails = [...new Set(allEmails)];

    const uniqueTo = [];
    const uniqueCc = [];
    const uniqueBcc = [];

    uniqueEmails.forEach((email) => {
      if (to.includes(email)) {
        uniqueTo.push(email);
      } else if (cc.includes(email)) {
        uniqueCc.push(email);
      } else {
        uniqueBcc.push(email);
      }
    });

    setTo(uniqueTo);
    setCc(uniqueCc);
    setBcc(uniqueBcc);

    // const emailRequest = {
    //   fromEmail: fromEmail,
    //   toList: uniqueTo,
    //   ccList: uniqueCc,
    //   bccList: uniqueBcc,
    //   subject: subject,
    //   body: plainText,
    // };
    const emailRequest = new FormData();
    emailRequest.append("fromEmail", fromEmail);
    emailRequest.append("subject", subject);
    emailRequest.append("body", plainText);
    if (attachment) {
      emailRequest.append("attachment", attachment);
    }

    uniqueTo.forEach((email) => {
      emailRequest.append("toList", email);
    });

    uniqueCc.forEach((email) => {
      emailRequest.append("ccList", email);
    });

    uniqueBcc.forEach((email) => {
      emailRequest.append("bccList", email);
    });

    try {
      const response = await axios.post(`${apiUrl}/email/send`, emailRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 202
      ) {
        showModal();
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email");
      if (error.response && error.response.status === 403) {
        alert("Permission denied. You are not authorized to send emails.");
      } else {
        alert("Error sending email");
      }
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    navigate("/email");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate("/email");
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="form-group">
            <FormControl sx={{ m: 1, width: 500 }}>
              <TextField
                id="fromEmail"
                label="From"
                variant="standard"
                value={fromEmail}
                onChange={handleChangeFrom}
              />
            </FormControl>
          </div>
          <FormControl sx={{ m: 1, width: 500 }}>
            <InputLabel id="demo-multiple-checkbox-label">To</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={to}
              onChange={handleChange}
              input={<OutlinedInput label="To" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              <MenuItem key="SelectAll" value="SelectAll">
                <Checkbox checked={selectAll} onChange={handleSelectAll} />
                <ListItemText primary="Select All" />
              </MenuItem>
              {email.map((emails) => (
                <MenuItem key={emails} value={emails}>
                  <Checkbox checked={to.indexOf(emails) > -1} />
                  <ListItemText primary={emails} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="form-group">
            <FormControl sx={{ m: 1, width: 500 }}>
              <InputLabel id="cc-label">Cc</InputLabel>
              <Select
                labelId="cc-label"
                id="cc"
                multiple
                value={cc}
                onChange={handleCcChange}
                input={<OutlinedInput label="Cc" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                <MenuItem key="SelectAllCc" value="SelectAllCc">
                  <Checkbox
                    checked={selectAllCc}
                    onChange={handleSelectAllCc}
                  />
                  <ListItemText primary="Select All" />
                </MenuItem>
                {email.map((emails) => (
                  <MenuItem key={emails} value={emails}>
                    <Checkbox checked={cc.indexOf(emails) > -1} />
                    <ListItemText primary={emails} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="form-group">
            <FormControl sx={{ m: 1, width: 500 }}>
              <InputLabel id="bcc-label">Bcc</InputLabel>
              <Select
                labelId="bcc-label"
                id="bcc"
                multiple
                value={bcc}
                onChange={handleBccChange}
                input={<OutlinedInput label="Bcc" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                <MenuItem key="SelectAllBcc" value="SelectAllBcc">
                  <Checkbox
                    checked={selectAllBcc}
                    onChange={handleSelectAllBcc}
                  />
                  <ListItemText primary="Select All" />
                </MenuItem>
                {email.map((emails) => (
                  <MenuItem key={emails} value={emails}>
                    <Checkbox checked={bcc.indexOf(emails) > -1} />
                    <ListItemText primary={emails} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="form-group">
            <FormControl sx={{ m: 1, width: 500 }}>
              <TextField
                id="subject"
                label="Subject"
                variant="outlined"
                value={subject}
                onChange={handleSubjectChange}
              />
            </FormControl>
          </div>
          <div className="form-group">
            {/* <FroalaEditor
              model={body}
              onModelChange={handleEditorChange}
              onPaste={handlePaste}
            /> */}
            <FroalaEditor
              model={body}
              onModelChange={handleEditorChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="attachment">Attachment:</label>
            <input
              type="file"
              id="attachment"
              name="attachment"
              accept=".pdf, .jpg, .jpeg"
              onChange={handleAttachmentChange}
            />
          </div>
          <Button variant="outlined" onClick={handleSubmit}>
            Submit
          </Button>
          <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <p>Mail sent successfully</p>
          </Modal>
        </div>
      </div>
    </div>
  );
}
