import React, { useState, useEffect, useCallback } from "react";
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
  const [attachment, setAttachment] = useState([]);

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
    const files = e.target.files;
    const attachments = Array.from(files);

    setAttachment(attachments);
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

    const emailRequest = new FormData();
    emailRequest.append("fromEmail", fromEmail);
    emailRequest.append("subject", subject);
    emailRequest.append("body", plainText);
    if (attachment) {
      attachment.forEach((file, index) => {
        emailRequest.append(`attachment`, file);
    });
    }
    console.log(attachment);

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
    navigate("/contacts");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate("/contacts");
  };

  return (
    <div className="col-md-10" style={{ overflowX: "auto" }}>
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
            <FroalaEditor model={body} onModelChange={handleEditorChange} />
          </div>
          {/* <div className="form-group">
            <label htmlFor="attachment">Attachment:</label>
            <input
              type="file"
              id="attachment"
              name="attachment"
              accept=".pdf, .jpg, .jpeg"
              onChange={handleAttachmentChange}
              multiple
            />
          </div> */}
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
/*
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Space,
  Modal,
  Typography,
  message,
  Upload,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";
import htmlToFormattedText from "html-to-formatted-text";

const { Title } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

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
  const [emails, setEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllCc, setSelectAllCc] = useState(false);
  const [selectAllBcc, setSelectAllBcc] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const token = sessionStorage.getItem("token");
  const recruiterId = sessionStorage.getItem("id");

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/bulkmails/${recruiterId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmails(response.data.map((e) => e.email));
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };
    fetchEmails();
  }, [apiUrl, recruiterId, token]);

  const handleSelectAll = (listType) => {
    if (listType === "to") {
      setTo(selectAll ? [] : [...emails]);
      setSelectAll(!selectAll);
    } else if (listType === "cc") {
      setCc(selectAllCc ? [] : [...emails]);
      setSelectAllCc(!selectAllCc);
    } else if (listType === "bcc") {
      setBcc(selectAllBcc ? [] : [...emails]);
      setSelectAllBcc(!selectAllBcc);
    }
  };

  const handleEditorChange = (newContent) => {
    setBody(newContent);
    setIsDirty(true);
  };

  const htmlToText = useCallback((html) => htmlToFormattedText(html), []);
  useEffect(() => {
    if (isDirty) {
      setPlainText(htmlToText(body));
      setIsDirty(false);
    }
  }, [body, isDirty, htmlToText]);

  const handleAttachmentChange = ({ fileList }) => {
    setAttachments(fileList.map((f) => f.originFileObj));
  };

  const handleSubmit = async () => {
    if (!fromEmail) {
      message.error("Please enter From email.");
      return;
    }

    const allEmails = [...to, ...cc, ...bcc];
    const uniqueEmails = [...new Set(allEmails)];

    const uniqueTo = [];
    const uniqueCc = [];
    const uniqueBcc = [];

    uniqueEmails.forEach((email) => {
      if (to.includes(email)) uniqueTo.push(email);
      else if (cc.includes(email)) uniqueCc.push(email);
      else uniqueBcc.push(email);
    });

    const formData = new FormData();
    formData.append("fromEmail", fromEmail);
    formData.append("subject", subject);
    formData.append("body", plainText);
    attachments.forEach((file) => formData.append("attachment", file));

    uniqueTo.forEach((email) => formData.append("toList", email));
    uniqueCc.forEach((email) => formData.append("ccList", email));
    uniqueBcc.forEach((email) => formData.append("bccList", email));

    try {
      const response = await axios.post(`${apiUrl}/email/send`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if ([200, 201, 202].includes(response.status)) setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      message.error("Error sending email. Permission may be denied.");
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
    navigate("/contacts");
  };

  return (
    <div className="p-6">
      <Title level={3}>Send Email</Title>
      <Form layout="vertical">
        <Form.Item label="From">
          <Input value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
        </Form.Item>

        <Form.Item label="To">
          <Select
            mode="multiple"
            value={to}
            onChange={(val) => {
              setTo(val);
              setSelectAll(false);
            }}
            style={{ width: "100%" }}
            placeholder="Select recipients"
          >
            <Select.Option key="selectAllTo">
              <Checkbox checked={selectAll} onChange={() => handleSelectAll("to")}>
                Select All
              </Checkbox>
            </Select.Option>
            {emails.map((email) => (
              <Option key={email} value={email}>
                {email}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Cc">
          <Select
            mode="multiple"
            value={cc}
            onChange={(val) => {
              setCc(val);
              setSelectAllCc(false);
            }}
            style={{ width: "100%" }}
            placeholder="Select CC recipients"
          >
            <Select.Option key="selectAllCc">
              <Checkbox checked={selectAllCc} onChange={() => handleSelectAll("cc")}>
                Select All
              </Checkbox>
            </Select.Option>
            {emails.map((email) => (
              <Option key={email} value={email}>
                {email}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Bcc">
          <Select
            mode="multiple"
            value={bcc}
            onChange={(val) => {
              setBcc(val);
              setSelectAllBcc(false);
            }}
            style={{ width: "100%" }}
            placeholder="Select BCC recipients"
          >
            <Select.Option key="selectAllBcc">
              <Checkbox checked={selectAllBcc} onChange={() => handleSelectAll("bcc")}>
                Select All
              </Checkbox>
            </Select.Option>
            {emails.map((email) => (
              <Option key={email} value={email}>
                {email}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Subject">
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </Form.Item>

        <Form.Item label="Body">
          <FroalaEditor model={body} onModelChange={handleEditorChange} />
        </Form.Item>

        <Form.Item label="Attachments">
          <Dragger
            multiple
            beforeUpload={() => false}
            onChange={handleAttachmentChange}
            fileList={attachments}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag files to this area to upload</p>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" onClick={handleSubmit}>
              Send Email
            </Button>
            <Button onClick={() => navigate("/contacts")}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>

      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleOk} title="Success">
        <p>Mail sent successfully</p>
      </Modal>
    </div>
  );
}

*/