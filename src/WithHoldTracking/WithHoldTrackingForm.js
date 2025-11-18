// import React, { useState, useEffect } from "react";
// import {
//   Form,
//   Input,
//   InputNumber,
//   Select,
//   Button,
//   Row,
//   Col,
//   Modal,
//   Typography,
//   Space,
//   message,
// } from "antd";
// import { useNavigate, useParams } from "react-router-dom";

// // --- ReactQuill (FREE Editor) ---
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// // --------------------------------

// import {
//   createTracking,
//   fetchEmployeeDetails,
//   fetchProjectNames,
//   fetchTrackingDetails,
//   updateTracking,
// } from "../SharedComponents/services/WithHoldService";

// const { Title } = Typography;
// const { Option } = Select;

// export default function WithHoldTrackingForm({ mode }) {
//   const navigate = useNavigate();
//   const { trackingId, employeeId } = useParams();

//   const [form] = Form.useForm();
//   const [editorHtml, setEditorHtml] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [employeeDetails, setEmployeeDetails] = useState({});
//   const [projectNames, setProjectNames] = useState([]);
//   const [selectedProjectName, setSelectedProjectName] = useState("");

//   const monthOptions = [
//     "January","February","March","April","May","June",
//     "July","August","September","October","November","December",
//   ];
//   const typeOptions = ["revenue", "payment", "expense", "tax", "deductions"];
//   const statusOptions = ["pending", "received", "paid"];
//   const yearOptions = Array.from({ length: 110 }, (_, i) => 1990 + i);

//   const isEditMode = mode === "edit";

//   const actualHours = Form.useWatch("actualHours", form) ?? 0;
//   const actualRate  = Form.useWatch("actualRate",  form) ?? 0;
//   const paidHours   = Form.useWatch("paidHours",   form) ?? 0;
//   const paidRate    = Form.useWatch("paidRate",    form) ?? 0;

//   const actualAmt = Number(((actualHours || 0) * (actualRate || 0)).toFixed(2));
//   const paidAmt   = Number(((paidHours   || 0) * (paidRate   || 0)).toFixed(2));
//   const balance   = Number((actualAmt - paidAmt).toFixed(2));

//   // Fetch Employee + Project + Tracking Data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const empResponse = await fetchEmployeeDetails(employeeId);
//         if (empResponse) setEmployeeDetails(empResponse);

//         const projResponse = await fetchProjectNames(employeeId);
//         if (projResponse?.length > 0) {
//           const list = projResponse.map(
//             (p) => `${p.subVendorOne || ""} / ${p.subVendorTwo || ""}`
//           );
//           setProjectNames(list);
//         }

//         if (isEditMode) {
//           const trackingResponse = await fetchTrackingDetails(trackingId);
//           if (trackingResponse) {
//             form.setFieldsValue(trackingResponse);
//             setSelectedProjectName(trackingResponse.projectName || "");
//             setEditorHtml(trackingResponse.excelData || "");
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         message.error("Failed to load form data");
//       }
//     };
//     fetchData();
//   }, [employeeId, trackingId, mode, form, isEditMode]);

//   const handleSubmit = async (values) => {
//     try {
//       const payload = {
//         ...values,
//         projectName: selectedProjectName,
//         excelData: editorHtml,
//         actualAmt,
//         paidAmt,
//         balance,
//       };

//       const success = isEditMode
//         ? await updateTracking(trackingId, payload)
//         : await createTracking(employeeId, payload);

//       if (success) setIsModalOpen(true);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       message.error("Something went wrong while saving data");
//     }
//   };

//   const handleOk = () => {
//     setIsModalOpen(false);
//     navigate(`/tracking/${employeeId}`);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//     navigate(`/tracking/${employeeId}`);
//   };

//   return (
//     <div style={{ maxWidth: 900, margin: "auto", padding: "2rem" }}>
//       <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>
//         {isEditMode ? "Edit WithHold Details" : "Add WithHold Details"}
//       </Title>

//       <Form
//         layout="vertical"
//         form={form}
//         onFinish={handleSubmit}
//         autoComplete="off"
//       >

//         {/* =============================
//             FORM FIELDS (Already present)
//         ============================== */}

//         {/* ---- EXCEL DATA (REPLACED Froala with Quill) ---- */}
//         <Form.Item label="Excel Data">
//           <ReactQuill theme="snow" value={editorHtml} onChange={setEditorHtml} />
//         </Form.Item>

//         {/* Buttons */}
//         <Form.Item>
//           <Space style={{ float: "right" }}>
//             <Button onClick={() => navigate(`/tracking/${employeeId}`)}>
//               Cancel
//             </Button>
//             <Button type="primary" htmlType="submit">
//               {isEditMode ? "Update" : "Submit"}
//             </Button>
//           </Space>
//         </Form.Item>
//       </Form>

//       {/* Success Modal */}
//       <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered>
//         <p>WithHold {isEditMode ? "Updated" : "Added"} successfully</p>
//       </Modal>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Row,
  Col,
  Modal,
  Typography,
  Space,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";

// --- ReactQuill (FREE Editor) ---
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// --------------------------------

import {
  createTracking,
  fetchEmployeeDetails,
  fetchProjectNames,
  fetchTrackingDetails,
  updateTracking,
} from "../SharedComponents/services/WithHoldService";

const { Title } = Typography;
const { Option } = Select;

export default function WithHoldTrackingForm({ mode }) {
  const navigate = useNavigate();
  const { trackingId, employeeId } = useParams();

  const [form] = Form.useForm();
  const [editorHtml, setEditorHtml] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [projectNames, setProjectNames] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState("");

  const monthOptions = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const typeOptions = ["revenue", "payment", "expense", "tax", "deductions"];
  const statusOptions = ["pending", "received", "paid"];
  const yearOptions = Array.from({ length: 110 }, (_, i) => 1990 + i);

  const isEditMode = mode === "edit";

  const actualHours = Form.useWatch("actualHours", form) ?? 0;
  const actualRate  = Form.useWatch("actualRate",  form) ?? 0;
  const paidHours   = Form.useWatch("paidHours",   form) ?? 0;
  const paidRate    = Form.useWatch("paidRate",    form) ?? 0;

  const actualAmt = Number(((actualHours || 0) * (actualRate || 0)).toFixed(2));
  const paidAmt   = Number(((paidHours   || 0) * (paidRate   || 0)).toFixed(2));
  const balance   = Number((actualAmt - paidAmt).toFixed(2));

  // Fetch Employee + Project + Tracking Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const empResponse = await fetchEmployeeDetails(employeeId);
        if (empResponse) setEmployeeDetails(empResponse);

        const projResponse = await fetchProjectNames(employeeId);
        if (projResponse?.length > 0) {
          const list = projResponse.map(
            (p) => `${p.subVendorOne || ""} / ${p.subVendorTwo || ""}`
          );
          setProjectNames(list);
        }

        if (isEditMode) {
          const trackingResponse = await fetchTrackingDetails(trackingId);
          if (trackingResponse) {
            form.setFieldsValue(trackingResponse);
            setSelectedProjectName(trackingResponse.projectName || "");
            setEditorHtml(trackingResponse.excelData || "");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load form data");
      }
    };
    fetchData();
  }, [employeeId, trackingId, mode, form, isEditMode]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        projectName: selectedProjectName,
        excelData: editorHtml,
        actualAmt,
        paidAmt,
        balance,
      };

      const success = isEditMode
        ? await updateTracking(trackingId, payload)
        : await createTracking(employeeId, payload);

      if (success) setIsModalOpen(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Something went wrong while saving data");
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
    navigate(`/tracking/${employeeId}`);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate(`/tracking/${employeeId}`);
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: "2rem" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 32 }}>
        {isEditMode ? "Edit WithHold Details" : "Add WithHold Details"}
      </Title>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        autoComplete="off"
      >

        {/* =============================
            FORM FIELDS (Already present)
        ============================== */}

        {/* ---- EXCEL DATA (REPLACED Froala with Quill) ---- */}
        <Form.Item label="Excel Data">
          <ReactQuill theme="snow" value={editorHtml} onChange={setEditorHtml} />
        </Form.Item>

        {/* Buttons */}
        <Form.Item>
          <Space style={{ float: "right" }}>
            <Button onClick={() => navigate(`/tracking/${employeeId}`)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {isEditMode ? "Update" : "Submit"}
            </Button>
          </Space>
        </Form.Item>
      </Form>

      {/* Success Modal */}
      <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} centered>
        <p>WithHold {isEditMode ? "Updated" : "Added"} successfully</p>
      </Modal>
    </div>
  );
}
