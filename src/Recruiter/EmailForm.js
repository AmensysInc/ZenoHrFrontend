import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Card, Input, Button, Modal, Typography, message } from "antd";
import { PaperClipOutlined, DeleteOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import { titleStyle } from "../constants/styles";
import htmlToFormattedText from "html-to-formatted-text";

const { Title } = Typography;

const quillStyles = {
  wrapper: {
    border: "1px solid #ddd",
    borderRadius: 8,
    overflow: "hidden",
    background: "#fff",
  },
  toolbar: {
    border: "none",
    background: "#fafafa",
    borderBottom: "1px solid #eee",
    padding: "6px 8px",
  },
  editor: {
    minHeight: 220,
    border: "none",
    padding: "12px 16px",
    fontSize: 14,
  },
};

export default function EmailForm() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [fromEmail, setFromEmail] = useState("");
  const [toRecipients, setToRecipients] = useState([]);
  const [ccRecipients, setCcRecipients] = useState([]);
  const [bccRecipients, setBccRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const [plainText, setPlainText] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [ccVisible, setCcVisible] = useState(false);
  const [bccVisible, setBccVisible] = useState(false);
  const [newToRecipient, setNewToRecipient] = useState("");
  const [newCcRecipient, setNewCcRecipient] = useState("");
  const [newBccRecipient, setNewBccRecipient] = useState("");

  const token = sessionStorage.getItem("token");
  const recruiterId = sessionStorage.getItem("id");

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/bulkmails/${recruiterId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmailList(response.data.map((e) => e.email));
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };
    fetchEmails();
  }, [apiUrl, recruiterId, token]);

  const htmlToText = useCallback((html) => htmlToFormattedText(html), []);

  useEffect(() => {
    if (isDirty) {
      setPlainText(htmlToText(editorValue));
      setIsDirty(false);
    }
  }, [editorValue, isDirty, htmlToText]);

  const handleEditorChange = (content) => {
    setEditorValue(content);
    setIsDirty(true);
  };

  const addRecipient = (type, value, setter, listSetter, list) => {
    if (value.trim()) {
      listSetter([...list, { id: Date.now(), email: value.trim() }]);
      setter("");
    }
  };

  const removeRecipient = (type, id) => {
    if (type === "to") {
      setToRecipients(toRecipients.filter((r) => r.id !== id));
    } else if (type === "cc") {
      setCcRecipients(ccRecipients.filter((r) => r.id !== id));
    } else if (type === "bcc") {
      setBccRecipients(bccRecipients.filter((r) => r.id !== id));
    }
  };

  const handleKeyPress = (e, type) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (type === "to" && newToRecipient.trim()) {
        addRecipient("to", newToRecipient, setNewToRecipient, setToRecipients, toRecipients);
      } else if (type === "cc" && newCcRecipient.trim()) {
        addRecipient("cc", newCcRecipient, setNewCcRecipient, setCcRecipients, ccRecipients);
      } else if (type === "bcc" && newBccRecipient.trim()) {
        addRecipient("bcc", newBccRecipient, setNewBccRecipient, setBccRecipients, bccRecipients);
      }
    }
  };

  const handleAttachment = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!fromEmail) {
      message.error("Please enter From email.");
      return;
    }

    const toEmails = toRecipients.map((r) => r.email);
    const ccEmails = ccRecipients.map((r) => r.email);
    const bccEmails = bccRecipients.map((r) => r.email);

    if (toEmails.length === 0) {
      message.error("Please add at least one recipient.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("fromEmail", fromEmail);
    formData.append("subject", subject);
    formData.append("body", plainText);

    attachments.forEach((file) => formData.append("attachment", file));
    toEmails.forEach((email) => formData.append("toList", email));
    ccEmails.forEach((email) => formData.append("ccList", email));
    bccEmails.forEach((email) => formData.append("bccList", email));

    try {
      const response = await axios.post(`${apiUrl}/email/send`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if ([200, 201, 202].includes(response.status)) {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      if (error.response && error.response.status === 403) {
        message.error("Permission denied. You are not authorized to send emails.");
      } else {
        message.error("Error sending email.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = () => {
    setIsModalOpen(false);
    navigate("/contacts");
  };

  const handleDiscard = () => {
    navigate("/contacts");
  };

  const quillModules = {
    toolbar: {
      container: ".custom-quill-toolbar",
    },
  };

  const renderRecipientChips = (recipients, type) => (
    <>
      {recipients.map((r) => (
        <div
          key={r.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            background: "#f4f4f4",
            borderRadius: 16,
          }}
        >
          <span style={{ fontSize: 13 }}>{r.email}</span>
          <DeleteOutlined
            onClick={() => removeRecipient(type, r.id)}
            style={{
              fontSize: 12,
              cursor: "pointer",
              color: "#555",
              marginLeft: 4,
            }}
          />
        </div>
      ))}
    </>
  );

  return (
    <AnimatedPageWrapper>
      <Card
        style={{
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          padding: "16px 0 28px 0",
          margin: "0 28px",
        }}
      >
        <Title level={4} style={titleStyle}>
          New Email
        </Title>

        <Form layout="vertical" style={{ padding: "0 28px" }}>
          <Form.Item label="From" required>
            <Input
              placeholder="your-email@company.com"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="To" required>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                paddingBottom: 8,
                borderBottom: "1px solid #ddd",
                alignItems: "center",
              }}
            >
              {renderRecipientChips(toRecipients, "to")}
              <Input
                placeholder="Add recipient and press Enter…"
                value={newToRecipient}
                onChange={(e) => setNewToRecipient(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "to")}
                style={{
                  flex: 1,
                  border: "none",
                  minWidth: 150,
                  boxShadow: "none",
                }}
              />
              <Button type="text" onClick={() => setCcVisible(!ccVisible)}>
                CC
              </Button>
              <Button type="text" onClick={() => setBccVisible(!bccVisible)}>
                BCC
              </Button>
            </div>
          </Form.Item>

          {ccVisible && (
            <Form.Item label="CC">
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  paddingBottom: 8,
                  borderBottom: "1px solid #ddd",
                  alignItems: "center",
                }}
              >
                {renderRecipientChips(ccRecipients, "cc")}
                <Input
                  placeholder="Add CC email and press Enter…"
                  value={newCcRecipient}
                  onChange={(e) => setNewCcRecipient(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, "cc")}
                  style={{
                    flex: 1,
                    border: "none",
                    minWidth: 150,
                    boxShadow: "none",
                  }}
                />
              </div>
            </Form.Item>
          )}

          {bccVisible && (
            <Form.Item label="BCC">
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  paddingBottom: 8,
                  borderBottom: "1px solid #ddd",
                  alignItems: "center",
                }}
              >
                {renderRecipientChips(bccRecipients, "bcc")}
                <Input
                  placeholder="Add BCC email and press Enter…"
                  value={newBccRecipient}
                  onChange={(e) => setNewBccRecipient(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, "bcc")}
                  style={{
                    flex: 1,
                    border: "none",
                    minWidth: 150,
                    boxShadow: "none",
                  }}
                />
              </div>
            </Form.Item>
          )}

          <Form.Item label="Subject">
            <Input
              placeholder="Type subject…"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Message">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              style={quillStyles.wrapper}
            >
              <div className="custom-quill-toolbar" style={quillStyles.toolbar}>
                <button className="ql-bold" />
                <button className="ql-italic" />
                <button className="ql-underline" />
                <button className="ql-link" />
                <button className="ql-list" value="ordered" />
                <button className="ql-list" value="bullet" />
              </div>

              <ReactQuill
                theme="snow"
                value={editorValue}
                onChange={handleEditorChange}
                modules={quillModules}
                placeholder="Write your message…"
                style={quillStyles.editor}
              />
            </div>
          </Form.Item>

          {attachments.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              {attachments.map((file, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                    background: "#fafafa",
                    borderRadius: 6,
                    marginBottom: 6,
                  }}
                >
                  <PaperClipOutlined />
                  <span>{file.name}</span>
                  <DeleteOutlined
                    style={{ cursor: "pointer", color: "#DC2626" }}
                    onClick={() => removeAttachment(idx)}
                  />
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleAttachment}
            multiple
            style={{ display: "none" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 12,
              marginTop: 20,
            }}
          >
            <Button
              onClick={handleDiscard}
              style={{
                backgroundColor: "#DC2626",
                color: "#fff",
                borderRadius: 8,
                height: 40,
                fontWeight: 500,
                border: "none",
                minWidth: 130,
              }}
            >
              Discard
            </Button>

            <Button
              onClick={handleSubmit}
              loading={loading}
              style={{
                backgroundColor: "#0D2A4D",
                color: "#fff",
                borderRadius: 8,
                height: 40,
                fontWeight: 500,
                border: "none",
                minWidth: 130,
              }}
            >
              Send Email
            </Button>
          </div>
        </Form>
      </Card>

      <Modal
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        title="Success"
      >
        <p>Mail sent successfully!</p>
      </Modal>
    </AnimatedPageWrapper>
  );
}
