import React, { useState, useEffect } from "react";
import { Button, Form, Input, Typography, Select, message, Card } from "antd";
import axios from "axios";
import ReusableTable from "../components/ReusableTable";
import TableFilter from "../components/TableFilter";
import AnimatedPageWrapper from "../components/AnimatedPageWrapper";
import { titleStyle } from "../constants/styles";

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

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

  const fetchCampaigns = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

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

  const fetchContacts = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const recruiterId = sessionStorage.getItem("id");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`${apiUrl}/bulkmails/${recruiterId}`, {
        headers,
      });

      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      message.error("Failed to fetch contacts.");
    }
  };

  const handleCampaignSubmit = async (values) => {
    try {
      const token = sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      await axios.post(`${apiUrl}/campaigns`, values, { headers });

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

  const columns = [
    { title: "Campaign Name", dataIndex: "name" },
    { title: "Sender Email", dataIndex: "senderEmail" },
    {
      title: "Recipients",
      dataIndex: "recipients",
      render: (_, record) => record.recipients.join(", "),
    },
    {
      title: "BCC",
      dataIndex: "bcc",
      render: (_, record) => record.bcc.join(", "),
    },
    { title: "Subject", dataIndex: "subject" },
    { title: "Body", dataIndex: "body" },
  ];

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
          Campaigns
        </Title>

        {showCampaignForm && (
          <Form
            layout="vertical"
            onFinish={handleCampaignSubmit}
            initialValues={campaignData}
            style={{ marginBottom: 24, padding: "0 28px" }}
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
              <Select mode="multiple" placeholder="Select BCC contacts">
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

            <Button
              htmlType="submit"
              style={{
                backgroundColor: "#0D2A4D",
                color: "#fff",
                borderRadius: 8,
                height: 40,
                fontWeight: 500,
                border: "none",
              }}
            >
              Save Campaign
            </Button>
          </Form>
        )}

        <TableFilter />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginLeft: 30,
          }}
        >
          <Button
            style={{
              backgroundColor: "#0D2A4D",
              color: "#fff",
              borderRadius: 8,
              height: 40,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              border: "none",
            }}
            onClick={() => setShowCampaignForm(!showCampaignForm)}
          >
            {showCampaignForm ? "Cancel" : "Add Campaign"}
          </Button>
        </div>

        <ReusableTable
          columns={columns}
          data={campaigns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </AnimatedPageWrapper>
  );
};

export default BulkMailForm;
