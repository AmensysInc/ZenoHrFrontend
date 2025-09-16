import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input, Typography, Select, message } from "antd";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

const BulkMailForm = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [campaignData, setCampaignData] = useState({
    name: "",
    senderEmail: "",
    recipients: [],
    bcc: [],
    subject: "",
    body: "",
  });
  const [campaigns, setCampaigns] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchCampaigns();
    fetchContacts();
  }, []);

  // Fetch campaigns and ensure recipients and bcc are arrays
  const fetchCampaigns = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${apiUrl}/campaigns`, { headers });

      const processedData = response.data.map((campaign) => ({
        ...campaign,
        recipients: campaign.recipients
          ? campaign.recipients.split(",").map((email) => email.trim())
          : [],
        bcc: campaign.bcc
          ? campaign.bcc.split(",").map((email) => email.trim())
          : [],
      }));

      setCampaigns(processedData);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      message.error("Failed to fetch campaigns.");
    }
  };

  // Fetch contacts to populate dropdowns
  const fetchContacts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const recruiterId = sessionStorage.getItem("id");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(`${apiUrl}/bulkmails/${recruiterId}`, { headers });
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      message.error("Failed to fetch contacts.");
    }
  };

  // Submit the campaign form
  const handleCampaignSubmit = async (values) => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post(`${apiUrl}/campaigns`, values, { headers });

      console.log("Campaign saved:", response.data);
      message.success("Campaign saved successfully!");
      setShowCampaignForm(false);
      setCampaignData({
        name: "",
        senderEmail: "",
        recipients: [],
        bcc: [],
        subject: "",
        body: "",
      });
      fetchCampaigns();
    } catch (error) {
      console.error("Error saving campaign:", error);
      message.error("Failed to save campaign.");
    }
  };

  // Define table columns
  const columns = [
    {
      title: "Campaign Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sender Email",
      dataIndex: "senderEmail",
      key: "senderEmail",
    },
    {
      title: "Recipients",
      dataIndex: "recipients",
      key: "recipients",
      render: (text, record) => record.recipients.join(", "),
    },
    {
      title: "BCC",
      dataIndex: "bcc",
      key: "bcc",
      render: (text, record) => record.bcc.join(", "),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Body",
      dataIndex: "body",
      key: "body",
    },
  ];

  return (
    <div className="container" style={{ marginTop: "20px" }}>
      <Typography.Title level={3}>Campaigns</Typography.Title>

      <Button
        type="primary"
        style={{ marginBottom: "20px" }}
        onClick={() => setShowCampaignForm(true)}
      >
        Add Campaign
      </Button>

      {showCampaignForm && (
        <Form
          layout="vertical"
          onFinish={handleCampaignSubmit}
          initialValues={campaignData}
          style={{ marginBottom: "20px" }}
        >
          <Form.Item
            label="Campaign Name"
            name="name"
            rules={[{ required: true, message: "Please input campaign name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Sender Email"
            name="senderEmail"
            rules={[{ required: true, message: "Please input sender email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Recipients"
            name="recipients"
            rules={[{ required: true, message: "Please select recipients!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select or type recipients"
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            >
              {contacts.map((contact) => (
                <Option
                  key={contact.id}
                  value={contact.email}
                  label={`${contact.firstName} ${contact.lastName} (${contact.email})`}
                >
                  {`${contact.firstName} ${contact.lastName} (${contact.email})`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="BCC" name="bcc">
            <Select
              mode="multiple"
              placeholder="Select or type BCC contacts"
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            >
              {contacts.map((contact) => (
                <Option
                  key={contact.id}
                  value={contact.email}
                  label={`${contact.firstName} ${contact.lastName} (${contact.email})`}
                >
                  {`${contact.firstName} ${contact.lastName} (${contact.email})`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: "Please input subject!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Body"
            name="body"
            rules={[{ required: true, message: "Please input body!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Campaign
            </Button>
          </Form.Item>
        </Form>
      )}

      <Table columns={columns} dataSource={campaigns} rowKey="id" />
    </div>
  );
};

export default BulkMailForm;
